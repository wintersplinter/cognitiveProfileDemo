import { DOMAIN_MIN, DOMAIN_MAX } from "../data/domains.js";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function randomOffset(variance) {
  return Math.round((Math.random() * 2 - 1) * variance);
}

export function generateProfile(domains, totalPoints, variance, preset = null) {
  const domainCount = domains.length;
  const minTotal = domainCount * DOMAIN_MIN;
  const maxTotal = domainCount * DOMAIN_MAX;

  const safeTotal = clamp(totalPoints, minTotal, maxTotal);
  const safeVariance = clamp(variance, 0, DOMAIN_MAX - DOMAIN_MIN);

  const groupBias = preset?.groupBias ?? {};
  const domainBias = preset?.domainBias ?? {};
  const varianceMultiplier = preset?.localVarianceMultiplier ?? 1;

  const base = safeTotal / domainCount;

  let values = domains.map((domain, index) => {
    const groupShift = groupBias[domain.groupId] ?? 0;
    const domainShift = domainBias[domain.id] ?? 0;
    const localVariance = safeVariance * varianceMultiplier;
    const noisyOffset = randomOffset(localVariance);
    const driftOffset = ((index % 4) - 1.5) * 0.15;

    return clamp(
      Math.round(base + groupShift + domainShift + noisyOffset + driftOffset),
      DOMAIN_MIN,
      DOMAIN_MAX,
    );
  });

  let currentSum = values.reduce((sum, value) => sum + value, 0);

  while (currentSum < safeTotal) {
    const order = shuffle([...values.keys()]);
    let changed = false;

    for (const index of order) {
      if (values[index] < DOMAIN_MAX) {
        values[index] += 1;
        currentSum += 1;
        changed = true;
        if (currentSum === safeTotal) break;
      }
    }

    if (!changed) break;
  }

  while (currentSum > safeTotal) {
    const order = shuffle([...values.keys()]);
    let changed = false;

    for (const index of order) {
      if (values[index] > DOMAIN_MIN) {
        values[index] -= 1;
        currentSum -= 1;
        changed = true;
        if (currentSum === safeTotal) break;
      }
    }

    if (!changed) break;
  }

  return values;
}
