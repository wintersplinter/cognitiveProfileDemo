import { DOMAIN_MIN, DOMAIN_MAX } from "../data/domains.js";

/*
  Houdt een waarde binnen de toegestane grenzen.
*/
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/*
  Willekeurig getal tussen min en max.
*/
function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

/*
  Gemiddelde van een lijst.
*/
function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/*
  Laatste correctie zodat de afgeronde waarden exact optellen tot totalPoints.
*/
function fixRoundedSum(values, targetTotal) {
  let currentSum = values.reduce((sum, value) => sum + value, 0);
  let diff = targetTotal - currentSum;

  while (diff !== 0) {
    /*
      Als we moeten verhogen:
      verhoog eerst lage waarden, zodat het profiel natuurlijker blijft.

      Als we moeten verlagen:
      verlaag eerst hoge waarden.
    */
    const indices = [...values.keys()].sort((a, b) =>
      diff > 0 ? values[a] - values[b] : values[b] - values[a],
    );

    let changed = false;

    for (const index of indices) {
      if (diff > 0 && values[index] < DOMAIN_MAX) {
        values[index] += 1;
        diff -= 1;
        changed = true;
        if (diff === 0) break;
      }

      if (diff < 0 && values[index] > DOMAIN_MIN) {
        values[index] -= 1;
        diff += 1;
        changed = true;
        if (diff === 0) break;
      }
    }

    if (!changed) break;
  }

  return values;
}

/*
  Zet bias-niveaus om in een basissterkte.
  Niet de absolute hoogte van de piek,
  maar hoe sterk een domein naar boven of beneden getrokken wordt.

  totalPoints + variance bepalen later nog altijd
  het echte gemiddelde en de uiteindelijke spreiding.
*/
function biasStrength(biasLevel) {
  switch (biasLevel) {
    case 2:
      return randomBetween(0.75, 1.0);
    case 1:
      return randomBetween(0.25, 0.55);
    case -1:
      return randomBetween(-0.55, -0.25);
    case -2:
      return randomBetween(-1.0, -0.75);
    default:
      return randomBetween(-1.0, 1.0);
  }
}

/*
  Hoofdgenerator

  Logica:
  1. totalPoints bepaalt het echte gemiddelde
  2. preset bepaalt per domein aan welke kant van het gemiddelde
     het domein moet terechtkomen
  3. variance bepaalt hoe breed het volledige profiel uitwaaiert
  4. geen waarde mag onder 1 of boven 20 gaan
*/
export function generateProfile(domains, totalPoints, variance, preset = null) {
  const domainCount = domains.length;

  const minTotal = domainCount * DOMAIN_MIN;
  const maxTotal = domainCount * DOMAIN_MAX;

  const safeTotal = clamp(totalPoints, minTotal, maxTotal);
  const safeVariance = clamp(variance, 0, DOMAIN_MAX - DOMAIN_MIN);

  /*
    Dit is het echte gemiddelde van het real profile.
  */
  const mean = safeTotal / domainCount;

  /*
    Domeinen die niet in het preset-profiel staan, krijgen automatisch 0.
  */
  const domainBias = preset?.domainBias ?? {};

  /*
    1. Maak eerst voor elk domein een ruwe "richting-afwijking".
       Die afwijkingen liggen nog rond 0.
       Positieve domeinen moeten boven gemiddeld eindigen,
       negatieve domeinen eronder.
  */
  let rawDeviations = domains.map((domain) => {
    const biasLevel = domainBias[domain.id] ?? 0;
    return biasStrength(biasLevel);
  });

  /*
    2. Schaal de afwijkingen zodat:
       hoogste afwijking - laagste afwijking = variance

       Daardoor bepaalt variance de echte breedte van het profiel.
    */
  const rawMin = Math.min(...rawDeviations);
  const rawMax = Math.max(...rawDeviations);
  const rawSpread = rawMax - rawMin;

  if (safeVariance <= 0 || rawSpread === 0) {
    rawDeviations = rawDeviations.map(() => 0);
  } else {
    const scale = safeVariance / rawSpread;
    rawDeviations = rawDeviations.map((d) => d * scale);
  }

  /*
    3. Bouw echte waarden op rond het gemiddelde.
  */
  let values = rawDeviations.map((deviation) =>
    clamp(mean + deviation, DOMAIN_MIN, DOMAIN_MAX),
  );

  /*
    4. Door clamping kan het gemiddelde licht verschoven zijn.
       Daarom centreren we opnieuw rond het bedoelde gemiddelde.
    */
  const currentMean = average(values);
  const meanShift = mean - currentMean;

  values = values.map((value) =>
    clamp(value + meanShift, DOMAIN_MIN, DOMAIN_MAX),
  );

  /*
    5. Rond af naar integers.
  */
  values = values.map((value) => Math.round(value));

  /*
    6. Zorg dat de som exact overeenkomt met totalPoints.
  */
  values = fixRoundedSum(values, safeTotal);

  return values;
}
