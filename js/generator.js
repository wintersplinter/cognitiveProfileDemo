import { DOMAIN_MIN, DOMAIN_MAX } from "../data/domains.js";

/*
  Houdt waarden binnen de toegestane grenzen.
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
  Maakt van ruwe waarden afwijkingen rond 0.
  Bijvoorbeeld:
  [11, 9, 10] bij gemiddelde 10
  wordt:
  [1, -1, 0]
*/
function deviationsFromMean(values, mean) {
  return values.map((value) => value - mean);
}

/*
  Schaal alle afwijkingen zodat:
  hoogste waarde - laagste waarde = targetVariance

  Dus:
  - variance = 0  => alles op het gemiddelde
  - variance = 6  => top en bottom liggen 6 uit elkaar
*/
function scaleDeviationsToVariance(deviations, targetVariance) {
  const currentMin = Math.min(...deviations);
  const currentMax = Math.max(...deviations);
  const currentSpread = currentMax - currentMin;

  // Geen spreiding mogelijk -> alles vlak
  if (targetVariance <= 0 || currentSpread === 0) {
    return deviations.map(() => 0);
  }

  const scale = targetVariance / currentSpread;
  return deviations.map((d) => d * scale);
}

/*
  Kleine laatste correctie:
  na afronden willen we exact op totalPoints uitkomen.
*/
function fixRoundedSum(values, targetTotal) {
  let currentSum = values.reduce((sum, value) => sum + value, 0);
  let diff = targetTotal - currentSum;

  // Sorteer indices slim:
  // als we moeten verhogen, verhoog eerst de laagste waarden
  // als we moeten verlagen, verlaag eerst de hoogste waarden
  while (diff !== 0) {
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
  Hoofdgenerator

  Logica:
  1. totalPoints bepaalt het echte gemiddelde
  2. we maken ruwe afwijkingen rond dat gemiddelde
  3. presets sturen individuele domeinen
  4. variance bepaalt de uiteindelijke totale spreiding
  5. afronden + exacte som herstellen
*/
export function generateProfile(domains, totalPoints, variance, preset = null) {
  const domainCount = domains.length;
  const minTotal = domainCount * DOMAIN_MIN;
  const maxTotal = domainCount * DOMAIN_MAX;

  const safeTotal = clamp(totalPoints, minTotal, maxTotal);

  /*
    Max mogelijke spreiding tussen hoogste en laagste waarde
    binnen schaal 1..20 is 19.
  */
  const safeVariance = clamp(variance, 0, DOMAIN_MAX - DOMAIN_MIN);

  /*
    Dit is het echte gemiddelde van het real profile.
  */
  const mean = safeTotal / domainCount;

  /*
    Presets sturen voortaan vooral individuele domeinen.
    groupBias mag blijven bestaan als reserve,
    maar domainBias is nu de belangrijkste laag.
  */
  const groupBias = preset?.groupBias ?? {};
  const domainBias = preset?.domainBias ?? {};
  const varianceMultiplier = preset?.localVarianceMultiplier ?? 1;

  /*
    1. Maak eerst ruwe waarden rond het echte gemiddelde.
    We bouwen expres op domeinniveau.
  */
  const rawValues = domains.map((domain) => {
    const gBias = groupBias[domain.groupId] ?? 0;
    const dBias = domainBias[domain.id] ?? 0;

    /*
      Kleine organische ruis.
      Niet te groot, anders wordt het profiel rommelig.
    */
    const jitter = randomBetween(-1, 1) * varianceMultiplier;

    return mean + gBias + dBias + jitter;
  });

  /*
    2. Zet ruwe waarden om naar afwijkingen rond hun eigen gemiddelde.
    Dit maakt het later makkelijk om de totale spreiding exact te sturen.
  */
  const rawMean = average(rawValues);
  let deviations = deviationsFromMean(rawValues, rawMean);

  /*
    3. Schaal de afwijkingen zodat de totale piek-dal-spreiding
       exact overeenkomt met 'variance'.
  */
  deviations = scaleDeviationsToVariance(deviations, safeVariance);

  /*
    4. Bouw de definitieve waarden terug op rond het ECHTE gemiddelde
       dat door totalPoints bepaald wordt.
  */
  let values = deviations.map((deviation) =>
    clamp(mean + deviation, DOMAIN_MIN, DOMAIN_MAX),
  );

  /*
    5. Afronden naar integers.
  */
  values = values.map((value) => Math.round(value));

  /*
    6. Zorg dat de som exact gelijk blijft aan totalPoints.
  */
  values = fixRoundedSum(values, safeTotal);

  return values;
}
