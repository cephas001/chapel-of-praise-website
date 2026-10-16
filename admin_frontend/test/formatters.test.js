import { describe, it, expect } from "vitest";
import {
  cleanPhone,
  formatDate,
  formatEventDisplay,
  headcountTotal,
} from "../utils/formatters.js";

describe("cleanPhone", () => {
  it("returns an empty string for falsy input", () => {
    expect(cleanPhone("")).toBe("");
    expect(cleanPhone(null)).toBe("");
    expect(cleanPhone(undefined)).toBe("");
  });

  it("strips non-digit characters", () => {
    expect(cleanPhone("+234 801-234-5678")).toBe("2348012345678");
  });

  it("converts a leading 0 to the Nigeria country code", () => {
    expect(cleanPhone("08012345678")).toBe("2348012345678");
  });

  it("keeps numbers that already include a country code", () => {
    expect(cleanPhone("2348012345678")).toBe("2348012345678");
  });

  it("does not modify numbers without a leading 0", () => {
    expect(cleanPhone("8012345678")).toBe("8012345678");
  });
});

describe("formatDate", () => {
  it("returns an empty string for falsy input", () => {
    expect(formatDate("")).toBe("");
    expect(formatDate(null)).toBe("");
  });

  it("formats an ISO date in en-US short format", () => {
    expect(formatDate("2026-01-15")).toMatch(/Jan \d{1,2}, 2026/);
  });
});

describe("formatEventDisplay", () => {
  it("returns an empty string for falsy input", () => {
    expect(formatEventDisplay(null)).toBe("");
  });

  it("formats a regular service", () => {
    const display = formatEventDisplay({
      eventDate: "2026-03-01",
      service: "SUNDAY SERVICE",
    });
    expect(display).toMatch(/• SUNDAY SERVICE$/);
  });

  it("formats a special program with a program day", () => {
    const display = formatEventDisplay({
      eventDate: "2026-03-01",
      service: "SPECIAL PROGRAM",
      specialProgram: "WORKERS RETREAT",
      programDay: "Day 2",
    });
    expect(display).toMatch(/• WORKERS RETREAT: Day 2$/);
  });

  it("falls back to defaults for a special program without details", () => {
    const display = formatEventDisplay({
      eventDate: "2026-03-01",
      service: "SPECIAL PROGRAM",
    });
    expect(display).toMatch(/• Special Program$/);
  });
});

describe("headcountTotal", () => {
  it("returns 0 for falsy input", () => {
    expect(headcountTotal(null)).toBe(0);
    expect(headcountTotal(undefined)).toBe(0);
  });

  it("sums all four demographic fields", () => {
    expect(
      headcountTotal({
        maleStudents: 10,
        femaleStudents: 12,
        maleVisitors: 3,
        femaleVisitors: 5,
      }),
    ).toBe(30);
  });

  it("coerces string values and tolerates missing fields", () => {
    expect(headcountTotal({ maleStudents: "10" })).toBe(10);
    expect(
      headcountTotal({ maleStudents: "4", femaleVisitors: "6" }),
    ).toBe(10);
  });
});
