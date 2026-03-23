const IQ_DOMAIN_IDS = new Set([
  "directed_attention",
  "language_comprehension",
  "language_production",
  "symbolic_logic",
  "task_switching",
  "inhibition",
  "error_monitoring",
  "goal_prioritization",
]);

const SCC_DOMAIN_IDS = new Set([
  "emotion_regulation",
  "motivation_drive",
  "affective_stability",
  "empathy",
  "social_signaling",
  "trust_attachment",
  "language_comprehension",
  "language_production",
  "self_awareness",
  "metacognition",
  "task_switching",
  "inhibition",
  "goal_prioritization",
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
  Lens-projectie

  Wat jij beschreef:
  - relevante domeinen blijven vast
  - hun gemiddelde wordt het nieuwe tijdelijke gemiddelde
  - niet-relevante domeinen behouden hun richting
    t.o.v. het oude gemiddelde
  - maar die afwijking wordt samengedrukt
*/
export function projectProfile(rawValues, domains, viewName) {
  /*
    Raw view = niets projecteren
  */
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
    1. Oude echte gemiddelde van het volledige profiel
  */
  const oldMean = average(rawValues);

  /*
    2. Neem alleen de vaste / relevante domeinen
       en bereken hun gemiddelde.
       Dat wordt het tijdelijke nieuwe gemiddelde.
  */
  const relevantValues = rawValues.filter((_, index) =>
    relevantSet.has(domains[index].id),
  );

  const inferredMean = average(relevantValues);

  /*
    3. Compressiefactor:
       hoe kleiner, hoe sterker alles naar het nieuwe gemiddelde schuift.
       0.35 = nog herkenbare profielvorm
       0.20 = sterk institutioneel platgetrokken
  */
  const compression = 0.35;

  return rawValues.map((value, index) => {
    const isRelevant = relevantSet.has(domains[index].id);

    /*
      Relevante domeinen blijven vast staan.
    */
    if (isRelevant) {
      return {
        value,
        projected: false,
        relevant: true,
      };
    }

    /*
      Niet-relevante domeinen:
      - bereken hun oude afwijking t.o.v. het oude gemiddelde
      - druk die afwijking samen
      - zet ze rond het nieuwe tijdelijke gemiddelde
      - voeg mini-jitter toe zodat ze niet exact samenvallen
    */
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
