export function generateProfile(domainCount, totalPoints, variance) {
  let values = [];

  let base = Math.floor(totalPoints / domainCount);

  for (let i = 0; i < domainCount; i++) {
    let v = base + Math.floor((Math.random() * 2 - 1) * variance);

    v = Math.max(1, Math.min(20, v));

    values.push(v);
  }

  return values;
}
