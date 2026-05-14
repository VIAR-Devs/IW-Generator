-- Charter Item 4 — Row-Level Security on PII tables
--
-- Enables RLS on every table that holds user-scoped PII and creates policies
-- that restrict reads/writes to the row owner. Admin actions bypass via a
-- separate policy and are logged to admin_audit_log by the application.
--
-- Per-request context is set via two session variables:
--   - app.user_id  : integer, the authenticated user's id
--   - app.is_admin : 'true' | 'false', whether the request is admin-scoped
--
-- The application sets these inside a transaction via withUserContext()
-- in server/db.ts. Connections that do NOT set the variables (e.g. the
-- background migration runner) see zero rows for user-scoped tables —
-- this is intentional and safe.
--
-- This migration is idempotent. Safe to re-run.

BEGIN;

-- ---------------------------------------------------------------------------
-- Helper: a non-bypass application role.
--
-- The migration runner uses the database owner (which has BYPASSRLS by
-- default). The application should connect as app_user, which does NOT
-- have BYPASSRLS, so policies are enforced. Role swap is a deploy-time
-- action — see RUNBOOK.md "RLS role swap" section.
-- ---------------------------------------------------------------------------

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_user') THEN
    -- Password is set at deploy time. NOLOGIN here keeps the role from
    -- being used accidentally before the DBA sets a password.
    CREATE ROLE app_user NOLOGIN;
  END IF;
END
$$;

-- Grant the application role the privileges it needs on existing PII tables.
-- (Policies still restrict to the row owner.)
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON wills TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON scheduled_jobs TO app_user;
GRANT SELECT, INSERT ON admin_audit_log TO app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;

-- Default privileges so any future Drizzle push picks these up automatically.
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO app_user;

-- ---------------------------------------------------------------------------
-- Enable RLS on PII tables.
-- ---------------------------------------------------------------------------

ALTER TABLE users           ENABLE ROW LEVEL SECURITY;
ALTER TABLE wills           ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_jobs  ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- FORCE RLS so even table owners go through policies (defence in depth
-- against accidental connection-string mix-ups in dev).
ALTER TABLE users           FORCE ROW LEVEL SECURITY;
ALTER TABLE wills           FORCE ROW LEVEL SECURITY;
ALTER TABLE scheduled_jobs  FORCE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log FORCE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- Drop any prior policies so this migration is replayable.
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS users_self_access            ON users;
DROP POLICY IF EXISTS users_admin_bypass           ON users;
DROP POLICY IF EXISTS wills_owner_access           ON wills;
DROP POLICY IF EXISTS wills_admin_bypass           ON wills;
DROP POLICY IF EXISTS scheduled_jobs_owner_access  ON scheduled_jobs;
DROP POLICY IF EXISTS scheduled_jobs_admin_bypass  ON scheduled_jobs;
DROP POLICY IF EXISTS audit_log_admin_read         ON admin_audit_log;
DROP POLICY IF EXISTS audit_log_app_insert         ON admin_audit_log;

-- ---------------------------------------------------------------------------
-- Policies.
--
-- current_setting(name, true) returns NULL when the variable is unset,
-- which means a session that has not called withUserContext() sees zero
-- user-scoped rows. That is the safe default.
-- ---------------------------------------------------------------------------

-- users: a user can only see/update their own row.
CREATE POLICY users_self_access ON users
  USING       (id = NULLIF(current_setting('app.user_id', true), '')::int)
  WITH CHECK  (id = NULLIF(current_setting('app.user_id', true), '')::int);

CREATE POLICY users_admin_bypass ON users
  USING       (current_setting('app.is_admin', true) = 'true')
  WITH CHECK  (current_setting('app.is_admin', true) = 'true');

-- wills: a will is visible only to its owner.
CREATE POLICY wills_owner_access ON wills
  USING       (user_id = NULLIF(current_setting('app.user_id', true), '')::int)
  WITH CHECK  (user_id = NULLIF(current_setting('app.user_id', true), '')::int);

CREATE POLICY wills_admin_bypass ON wills
  USING       (current_setting('app.is_admin', true) = 'true')
  WITH CHECK  (current_setting('app.is_admin', true) = 'true');

-- scheduled_jobs: same owner pattern.
CREATE POLICY scheduled_jobs_owner_access ON scheduled_jobs
  USING       (user_id = NULLIF(current_setting('app.user_id', true), '')::int)
  WITH CHECK  (user_id = NULLIF(current_setting('app.user_id', true), '')::int);

CREATE POLICY scheduled_jobs_admin_bypass ON scheduled_jobs
  USING       (current_setting('app.is_admin', true) = 'true')
  WITH CHECK  (current_setting('app.is_admin', true) = 'true');

-- admin_audit_log: only admins read it; the application can always insert
-- (an admin action without a corresponding audit row is a bug we want to
-- surface, not silence).
CREATE POLICY audit_log_admin_read ON admin_audit_log
  FOR SELECT
  USING (current_setting('app.is_admin', true) = 'true');

CREATE POLICY audit_log_app_insert ON admin_audit_log
  FOR INSERT
  WITH CHECK (true);

COMMIT;