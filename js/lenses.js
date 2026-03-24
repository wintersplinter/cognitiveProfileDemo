const IQ_DOMAIN_IDS = new Set([
  "directed_attention",
  "language_comprehension",
  "language_production",
  "symbolic_logic",
  "task_switching",
  "pattern_recognition",
  "inhibition",
  "working_memory",
  "error_monitoring",
  "goal_prioritization",
]);

const SCC_DOMAIN_IDS = new Set([
  "emotion_generation",
  "emotion_regulation",
  "motivation_drive",
  "affective_stability",

  "empathy",
  "social_signaling",
  "trust_attachment",
  "group_dynamics",

  "language_comprehension",
  "language_production",
  "narrative_coherence",

  "self_awareness",
  "metacognition",

  "task_switching",
  "inhibition",
  "goal_prioritization",

  "error_monitoring", //*image and status, appearance of smart
  "symbolic_logic", //*image and status, appearance of smart
  "directed_attention", //*image and status, appearance of smart
]);

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function average(values) {
  if (!values.length) return 10;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getRelevantSet(viewName) {
  if (viewName === "iq") return IQ_DOMAIN_IDS;
  if (viewName === "scc") return SCC_DOMAIN_IDS;
  return null;
}

/*
  Kleine vaste jitter zodat geprojecteerde waarden
  niet allemaal exact op dezelfde lijn vallen.

  Vast patroon op basis van index, zodat het niet flikkert
  bij elke render.
*/
function seededJitter(index, strength = 0.35) {
  const x = Math.sin((index + 1) * 12.9898) * 43758.5453;
  const fraction = x - Math.floor(x);
  return (fraction * 2 - 1) * strength;
}

/*
  Voor IQ:
  gewoon gemiddelde van de relevante domeinen.
*/
function inferIQMean(relevantValues) {
  return average(relevantValues);
}

/*
  Voor SCC:
  negatieve afwijkingen wegen zwaarder dan positieve.

  Idee:
  - bereken eerst het gewone gemiddelde van de relevante SCC-domeinen
  - kijk dan per waarde hoe ver die van dat gemiddelde afwijkt
  - negatieve afwijkingen krijgen extra gewicht
  - positieve afwijkingen tellen gewoon mee

  Hierdoor zakken sociale "fricties" sterker door in het tijdelijke SCC-gemiddelde.
*/
function inferSCCMean(relevantValues) {
  if (!relevantValues.length) return 10;

  const baseMean = average(relevantValues);

  const weightedValues = relevantValues.map((value) => {
    const deviation = value - baseMean;

    // Lage waarden trekken harder naar beneden
    if (deviation < 0) {
      return baseMean + deviation * 2; // 1.75 -> Negatieve afwijkingen krijgen 75% extra gewicht, waardoor ze zwaarder wegen in het inferentie-gemiddelde.
    }

    // Hoge waarden tellen gewoon normaal mee
    return value;
  });

  return average(weightedValues);
}

/*
  Lens-projectie

  - relevante domeinen blijven vast
  - hun (lens-specifieke) gemiddelde wordt het tijdelijke nieuwe gemiddelde
  - niet-relevante domeinen behouden hun richting t.o.v. het oude gemiddelde
  - maar die afwijking wordt samengedrukt
*/
export function projectProfile(rawValues, domains, viewName) {
  if (viewName === "raw") {
    return rawValues.map((value) => ({
      value,
      projected: false,
      relevant: false,
    }));
  }

  const relevantSet = getRelevantSet(viewName);

  if (!relevantSet) {
    return rawValues.map((value) => ({
      value,
      projected: false,
      relevant: false,
    }));
  }

  /*
    Oude echte gemiddelde van het volledige profiel.
  */
  const oldMean = average(rawValues);

  /*
    Neem alleen de relevante domeinen voor deze lens.
  */
  const relevantValues = rawValues.filter((_, index) =>
    relevantSet.has(domains[index].id),
  );

  /*
    IQ en SCC krijgen nu een ander type inferentie.
  */
  let inferredMean;

  if (viewName === "iq") {
    inferredMean = inferIQMean(relevantValues);
  } else if (viewName === "scc") {
    inferredMean = inferSCCMean(relevantValues);
  } else {
    inferredMean = average(relevantValues);
  }

  /*
    Compressie:
    hoe kleiner, hoe platter de geprojecteerde niet-relevante domeinen.
  */
  const compression = 0.35;

  return rawValues.map((value, index) => {
    const isRelevant = relevantSet.has(domains[index].id);

    if (isRelevant) {
      return {
        value,
        projected: false,
        relevant: true,
      };
    }

    const oldDeviation = value - oldMean;
    const compressedDeviation = oldDeviation * compression;
    const jitter = seededJitter(index, 0.3);

    const projectedValue = clamp(
      inferredMean + compressedDeviation + jitter,
      1,
      20,
    );

    return {
      value: projectedValue,
      projected: true,
      relevant: false,
    };
  });
}
