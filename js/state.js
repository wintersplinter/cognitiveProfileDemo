import { DEFAULT_TOTAL_POINTS, DEFAULT_VARIANCE } from "../data/domains.js";

export const state = {
  totalPoints: DEFAULT_TOTAL_POINTS,
  variance: DEFAULT_VARIANCE,
  rawValues: [],
  activeLens: "raw",
  activePreset: "balanced",
};
