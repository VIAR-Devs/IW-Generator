// Vitest setup file — runs once before any test file is loaded.
//
// Some modules under test transitively import `server/db.ts`, which
// throws at module load if DATABASE_URL is unset. CI does not have a
// real database. Setting a dummy URL here lets the module load and the
// pool sit idle — tests that don't touch the DB never trigger a
// connection.
//
// Tests that DO touch the DB must run against a real fixture; those
// will need their own setup and are out of scope for the smoke-test
// pass shipped today.

process.env.DATABASE_URL ??= "postgres://test:test@localhost:5432/test";
process.env.SESSION_SECRET ??= "test-session-secret-do-not-use-in-production";