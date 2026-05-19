/**
 * Tests for the admin allowlist (Charter Item 4 close-out).
 *
 * The `isAdminEmail` function is the gatekeeper for every /api/admin/*
 * endpoint. These tests guard the invariants documented in
 * docs/adr/0002-auth-model.md:
 *
 * - Source of truth is the ADMIN_EMAILS env var, not a DB column.
 * - Comma-separated allowlist with whitespace tolerance.
 * - Case-insensitive comparison.
 * - Fail closed: empty / missing env = no admin access.
 * - Never equality on a single email.
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { isAdminEmail } from "./routes";

describe("isAdminEmail (Charter Item 4 admin allowlist)", () => {
  const originalEnv = process.env.ADMIN_EMAILS;

  beforeEach(() => {
    delete process.env.ADMIN_EMAILS;
  });

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.ADMIN_EMAILS;
    } else {
      process.env.ADMIN_EMAILS = originalEnv;
    }
  });

  it("returns false when ADMIN_EMAILS is unset", () => {
    expect(isAdminEmail("irfan@gardenproject.pro")).toBe(false);
  });

  it("returns false when ADMIN_EMAILS is empty string", () => {
    process.env.ADMIN_EMAILS = "";
    expect(isAdminEmail("irfan@gardenproject.pro")).toBe(false);
  });

  it("returns false when ADMIN_EMAILS is whitespace only", () => {
    process.env.ADMIN_EMAILS = "   ";
    expect(isAdminEmail("irfan@gardenproject.pro")).toBe(false);
  });

  it("returns false when email is null", () => {
    process.env.ADMIN_EMAILS = "irfan@gardenproject.pro";
    expect(isAdminEmail(null)).toBe(false);
  });

  it("returns false when email is undefined", () => {
    process.env.ADMIN_EMAILS = "irfan@gardenproject.pro";
    expect(isAdminEmail(undefined)).toBe(false);
  });

  it("returns true for a single-entry allowlist match", () => {
    process.env.ADMIN_EMAILS = "irfan@gardenproject.pro";
    expect(isAdminEmail("irfan@gardenproject.pro")).toBe(true);
  });

  it("returns true for a multi-entry allowlist match", () => {
    process.env.ADMIN_EMAILS =
      "irfan@gardenproject.pro,riaz@gardenproject.pro,tabassam@islamicwills.pro";
    expect(isAdminEmail("riaz@gardenproject.pro")).toBe(true);
    expect(isAdminEmail("tabassam@islamicwills.pro")).toBe(true);
    expect(isAdminEmail("irfan@gardenproject.pro")).toBe(true);
  });

  it("returns false for a non-allowlisted email", () => {
    process.env.ADMIN_EMAILS = "irfan@gardenproject.pro,riaz@gardenproject.pro";
    expect(isAdminEmail("not-an-admin@example.com")).toBe(false);
  });

  it("is case-insensitive on the allowlist", () => {
    process.env.ADMIN_EMAILS = "Irfan@GardenProject.Pro";
    expect(isAdminEmail("irfan@gardenproject.pro")).toBe(true);
  });

  it("is case-insensitive on the candidate email", () => {
    process.env.ADMIN_EMAILS = "irfan@gardenproject.pro";
    expect(isAdminEmail("IRFAN@GARDENPROJECT.PRO")).toBe(true);
  });

  it("tolerates whitespace around comma-separated entries", () => {
    process.env.ADMIN_EMAILS =
      " irfan@gardenproject.pro , riaz@gardenproject.pro ,  ";
    expect(isAdminEmail("riaz@gardenproject.pro")).toBe(true);
    expect(isAdminEmail("irfan@gardenproject.pro")).toBe(true);
  });

  it("tolerates trailing comma", () => {
    process.env.ADMIN_EMAILS = "irfan@gardenproject.pro,";
    expect(isAdminEmail("irfan@gardenproject.pro")).toBe(true);
  });

  it("does not partial-match (substring of allowlisted email)", () => {
    process.env.ADMIN_EMAILS = "irfan@gardenproject.pro";
    expect(isAdminEmail("rfan@gardenproject.pro")).toBe(false);
    expect(isAdminEmail("irfan@gardenproject.pr")).toBe(false);
  });

  it("does not partial-match (allowlist entry is substring of candidate)", () => {
    process.env.ADMIN_EMAILS = "irfan@gardenproject.pro";
    expect(isAdminEmail("evil-irfan@gardenproject.pro")).toBe(false);
  });
});