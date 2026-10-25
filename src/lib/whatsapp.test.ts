import { describe, expect, it } from "vitest";
import { customerWaLink, customerWaNumber, normalizePhone } from "./whatsapp";

describe("normalizePhone", () => {
  it("accepts a plain 7-digit Trinidad & Tobago number", () => {
    expect(normalizePhone("4884248")).toBe("+18684884248");
  });

  it("strips spaces, dashes and brackets", () => {
    expect(normalizePhone("488-4248")).toBe("+18684884248");
    expect(normalizePhone(" 488 4248 ")).toBe("+18684884248");
    expect(normalizePhone("(488) 4248")).toBe("+18684884248");
  });

  it("forgives an 868 or 1868 prefix on local numbers", () => {
    expect(normalizePhone("8684884248")).toBe("+18684884248");
    expect(normalizePhone("18684884248")).toBe("+18684884248");
    expect(normalizePhone("1-868-488-4248")).toBe("+18684884248");
    expect(normalizePhone("+18684884248")).toBe("+18684884248");
  });

  it("accepts every valid local first digit (2, 3, 4, 6, 7)", () => {
    for (const first of ["2", "3", "4", "6", "7"]) {
      expect(normalizePhone(`${first}884248`)).toBe(`+1868${first}884248`);
    }
  });

  it("rejects local numbers starting with 0, 1, 5, 8 or 9", () => {
    for (const first of ["0", "1", "5", "8", "9"]) {
      expect(normalizePhone(`${first}884248`)).toBeNull();
    }
  });

  it("rejects numbers that are too short or too long", () => {
    expect(normalizePhone("488424")).toBeNull();
    expect(normalizePhone("48842480")).toBeNull();
    expect(normalizePhone("")).toBeNull();
    expect(normalizePhone(null)).toBeNull();
  });

  it("rejects fake patterns", () => {
    expect(normalizePhone("0000000")).toBeNull();
    expect(normalizePhone("1234567")).toBeNull();
    expect(normalizePhone("2222222")).toBeNull();
  });

  it("rejects letters", () => {
    expect(normalizePhone("callme")).toBeNull();
    expect(normalizePhone("488abcd")).toBeNull();
  });

  it("treats +1868 as local, not foreign", () => {
    expect(normalizePhone("+18685884248")).toBeNull();
    expect(normalizePhone("+18684884248")).toBe("+18684884248");
  });

  it("accepts foreign numbers with a country code (8 to 15 digits)", () => {
    expect(normalizePhone("+44 7700 900123")).toBe("+447700900123");
    expect(normalizePhone("+13055550199")).toBe("+13055550199");
  });

  it("rejects foreign numbers outside the 8 to 15 digit range", () => {
    expect(normalizePhone("+447700")).toBeNull();
    expect(normalizePhone("+1234567890123456789")).toBeNull();
  });
});

describe("customerWaNumber / customerWaLink", () => {
  it("builds wa.me digits for a local number", () => {
    expect(customerWaNumber("4884248")).toBe("18684884248");
    expect(customerWaNumber("868-488-4248")).toBe("18684884248");
  });

  it("builds wa.me digits for a foreign number", () => {
    expect(customerWaNumber("+44 7700 900123")).toBe("447700900123");
  });

  it("returns null for unusable numbers", () => {
    expect(customerWaNumber("123")).toBeNull();
    expect(customerWaLink("123", "hi")).toBeNull();
  });

  it("links to the customer, not the business", () => {
    expect(customerWaLink("4884248", "Hi there")).toBe(
      "https://wa.me/18684884248?text=Hi%20there",
    );
  });
});
