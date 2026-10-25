import { describe, expect, it } from "vitest";
import {
  mealsForDate,
  menuForDate,
  unavailableMeals,
  validateOrderAvailability,
  weekMonday,
} from "./menu-rotation";

// Anchor: Monday 19 October 2026 is a Menu A week.
const A_MONDAY = "2026-10-19";
const B_MONDAY = "2026-10-26";
const NOW = new Date("2026-10-20T12:00:00Z"); // Tuesday of the anchor week, 8 AM in Trinidad

describe("menuForDate", () => {
  it("serves Menu A in the anchor week", () => {
    expect(menuForDate(A_MONDAY)).toBe("A");
    expect(menuForDate("2026-10-21")).toBe("A"); // Wednesday
    expect(menuForDate("2026-10-23")).toBe("A"); // Friday
  });

  it("serves Menu B the following week", () => {
    expect(menuForDate(B_MONDAY)).toBe("B");
    expect(menuForDate("2026-10-28")).toBe("B");
    expect(menuForDate("2026-10-30")).toBe("B");
  });

  it("alternates forever", () => {
    expect(menuForDate("2026-11-02")).toBe("A");
    expect(menuForDate("2026-11-09")).toBe("B");
  });
});

describe("mealsForDate", () => {
  it("returns the four original meals in a Menu A week", () => {
    const ids = mealsForDate(A_MONDAY).map((m) => m.id);
    expect(ids).toEqual([
      "meal-quinoa-chow-mein",
      "meal-sweet-potato-basil",
      "meal-cumin-basmati-tandoori",
      "meal-roasted-veg-thai-butter",
    ]);
  });

  it("returns the three new meals in a Menu B week", () => {
    const ids = mealsForDate(B_MONDAY).map((m) => m.id);
    expect(ids).toEqual([
      "meal-zesty-herb-bowl",
      "meal-mediterranean-mex-bowl",
      "meal-moroccan-chicken-couscous",
    ]);
  });
});

describe("unavailableMeals", () => {
  it("flags Menu B meals during a Menu A week", () => {
    const items = [{ itemId: "meal-zesty-herb-bowl", category: "meal" }];
    expect(unavailableMeals(items, A_MONDAY)).toHaveLength(1);
    expect(unavailableMeals(items, B_MONDAY)).toHaveLength(0);
  });

  it("never flags salads or juices", () => {
    const items = [
      { itemId: "salad-chopped", category: "salad" },
      { itemId: "juice-beetroot", category: "juice" },
    ];
    expect(unavailableMeals(items, A_MONDAY)).toHaveLength(0);
  });
});

describe("validateOrderAvailability", () => {
  const menuAItem = { itemId: "meal-quinoa-chow-mein", category: "meal" };
  const menuBItem = { itemId: "meal-zesty-herb-bowl", category: "meal" };

  it("accepts an on-week meal for a valid day", () => {
    expect(() => validateOrderAvailability([menuAItem], "2026-10-21", NOW)).not.toThrow();
  });

  it("rejects an off-week meal", () => {
    expect(() => validateOrderAvailability([menuBItem], "2026-10-21", NOW)).toThrow(/not available/i);
  });

  it("rejects a non delivery day", () => {
    expect(() => validateOrderAvailability([menuAItem], "2026-10-22", NOW)).toThrow(/Monday, Wednesday or Friday/i);
  });

  it("rejects a missing date", () => {
    expect(() => validateOrderAvailability([menuAItem], "", NOW)).toThrow();
  });
});

describe("weekMonday", () => {
  it("maps any delivery day to its week Monday", () => {
    expect(weekMonday("2026-10-21")).toBe(A_MONDAY);
    expect(weekMonday("2026-10-23")).toBe(A_MONDAY);
    expect(weekMonday("2026-10-30")).toBe(B_MONDAY);
  });
});
