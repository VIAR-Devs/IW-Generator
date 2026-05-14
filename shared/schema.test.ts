/**
 * Smoke tests for the will form data schemas.
 *
 * Charter Item 3: minimum bar is "Vitest installed; one passing smoke test before first deploy".
 * These tests guard against schema drift in the validated data model that the will document is rendered from.
 * The Faraid calculator (when implemented) will get its own dedicated test suite.
 */

import { describe, expect, it } from "vitest";
import {
  basicDetailsSchema,
  executorSchema,
  guardianSchema,
  childSchema,
  funeralPreferencesSchema,
  wasiyyahBeneficiarySchema,
  insertAdminAuditLogSchema,
} from "./schema";

describe("basicDetailsSchema", () => {
  it("accepts a complete valid basic details payload", () => {
    const valid = {
      fullName: "Test User",
      addressLine1: "1 Test Street",
      city: "London",
      postcode: "E1 6AN",
      date: "2026-05-13",
      burialCountry: "United Kingdom",
    };
    expect(() => basicDetailsSchema.parse(valid)).not.toThrow();
  });

  it("rejects missing fullName", () => {
    const invalid = {
      addressLine1: "1 Test Street",
      city: "London",
      postcode: "E1 6AN",
      date: "2026-05-13",
    };
    expect(() => basicDetailsSchema.parse(invalid)).toThrow();
  });

  it("rejects missing date", () => {
    const invalid = {
      fullName: "Test User",
      addressLine1: "1 Test Street",
      city: "London",
      postcode: "E1 6AN",
    };
    expect(() => basicDetailsSchema.parse(invalid)).toThrow();
  });

  it("accepts payload without optional burialCountry", () => {
    const valid = {
      fullName: "Test User",
      addressLine1: "1 Test Street",
      city: "London",
      postcode: "E1 6AN",
      date: "2026-05-13",
    };
    expect(() => basicDetailsSchema.parse(valid)).not.toThrow();
  });
});

describe("executorSchema", () => {
  it("accepts a valid executor", () => {
    const valid = { id: "exec-1", name: "Tabs Rashid", address: "London" };
    expect(() => executorSchema.parse(valid)).not.toThrow();
  });

  it("rejects missing name", () => {
    const invalid = { id: "exec-1", address: "London" };
    expect(() => executorSchema.parse(invalid)).toThrow();
  });
});

describe("guardianSchema", () => {
  it("accepts a valid guardian", () => {
    const valid = { id: "g-1", name: "Guardian One", address: "Bristol" };
    expect(() => guardianSchema.parse(valid)).not.toThrow();
  });

  it("accepts a guardian without optional address", () => {
    const valid = { id: "g-1", name: "Guardian One" };
    expect(() => guardianSchema.parse(valid)).not.toThrow();
  });

  it("rejects guardian without name", () => {
    const invalid = { id: "g-1", address: "Bristol" };
    expect(() => guardianSchema.parse(invalid)).toThrow();
  });
});

describe("childSchema", () => {
  it("accepts a valid male child", () => {
    const valid = { id: "c-1", name: "Child One", gender: "male", dateOfBirth: "2020-01-01" };
    expect(() => childSchema.parse(valid)).not.toThrow();
  });

  it("accepts a valid female child", () => {
    const valid = { id: "c-2", name: "Child Two", gender: "female", dateOfBirth: "2022-03-04" };
    expect(() => childSchema.parse(valid)).not.toThrow();
  });

  it("rejects a child without a gender", () => {
    const invalid = { id: "c-3", name: "Child Three", dateOfBirth: "2020-01-01" };
    expect(() => childSchema.parse(invalid)).toThrow();
  });

  it("rejects a child without a date of birth", () => {
    const invalid = { id: "c-4", name: "Child Four", gender: "male" };
    expect(() => childSchema.parse(invalid)).toThrow();
  });
});

describe("funeralPreferencesSchema", () => {
  it("accepts defaults for boolean fields", () => {
    const valid = {};
    const parsed = funeralPreferencesSchema.parse(valid);
    expect(parsed.restrictPostMortem).toBe(false);
    expect(parsed.organDonation).toBe(false);
  });

  it("accepts full payload", () => {
    const valid = {
      restrictPostMortem: true,
      organDonation: false,
      imamOrMasjid: "Local Masjid",
      cemetery: "Garden of Peace",
      charityAtFuneral: "SDQA",
    };
    expect(() => funeralPreferencesSchema.parse(valid)).not.toThrow();
  });
});

describe("insertAdminAuditLogSchema", () => {
  it("accepts a minimal admin audit log row", () => {
    const valid = {
      adminEmail: "irfan@gardenproject.pro",
      action: "GET /api/admin/onboarding-stats",
    };
    expect(() => insertAdminAuditLogSchema.parse(valid)).not.toThrow();
  });

  it("accepts the full admin audit log shape", () => {
    const valid = {
      adminEmail: "irfan@gardenproject.pro",
      adminUserId: 1,
      action: "POST /api/admin/broadcast-email",
      route: "/api/admin/broadcast-email",
      targetUserId: 42,
      metadata: { subject: "Test broadcast" },
      ipAddress: "203.0.113.42",
    };
    expect(() => insertAdminAuditLogSchema.parse(valid)).not.toThrow();
  });

  it("rejects rows missing the admin email", () => {
    const invalid = { action: "GET /api/admin/onboarding-stats" };
    expect(() => insertAdminAuditLogSchema.parse(invalid)).toThrow();
  });

  it("rejects rows missing the action", () => {
    const invalid = { adminEmail: "irfan@gardenproject.pro" };
    expect(() => insertAdminAuditLogSchema.parse(invalid)).toThrow();
  });
});

describe("wasiyyahBeneficiarySchema", () => {
  it("accepts a valid Wasiyyah beneficiary", () => {
    const valid = { id: "w-1", name: "SDQA Signature Project", percentage: 10 };
    expect(() => wasiyyahBeneficiarySchema.parse(valid)).not.toThrow();
  });

  it("rejects missing name", () => {
    const invalid = { id: "w-1", percentage: 10 };
    expect(() => wasiyyahBeneficiarySchema.parse(invalid)).toThrow();
  });

  it("rejects missing percentage", () => {
    const invalid = { id: "w-1", name: "SDQA Signature Project" };
    expect(() => wasiyyahBeneficiarySchema.parse(invalid)).toThrow();
  });

  it("rejects percentage above the one-third cap (33%)", () => {
    const invalid = { id: "w-1", name: "Test", percentage: 50 };
    expect(() => wasiyyahBeneficiarySchema.parse(invalid)).toThrow();
  });
});
