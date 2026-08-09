/**
 * CCGC loyalty points.
 * Every complete batch of 5 salads or meals earns 10 points.
 * Every complete batch of 6 juices or shots earns 5.5 points.
 */
export const POINTS_PER_FOOD_BATCH = 10;
export const POINTS_PER_DRINK_BATCH = 5.5;

export function pointsFor(foodQty: number, drinkQty: number): number {
  return Math.floor(foodQty / 5) * POINTS_PER_FOOD_BATCH
    + Math.floor(drinkQty / 6) * POINTS_PER_DRINK_BATCH;
}

/** Points shown without a trailing ".0" (for example 10 and 15.5). */
export const fmtPoints = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
