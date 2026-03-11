const IQ_DOMAIN_IDS = new Set([
  "directed_attention",
  "language_comprehension",
  "language_production",
  "symbolic_logic",
  "task_switching",
  "inhibition",
  "working_memory",
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
  "working_memory",
  "goal_prioritization",
]);

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getRelevantSet(viewName) {
  if (viewName === "iq") return IQ_DOMAIN_IDS;
  if (viewName === "scc") return SCC_DOMAIN_IDS;
  return null;
}

function average(values) {
  if (!values.length) return 10;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function seededJitter(index, strength = 0.9) {
  const x = Math.sin((index + 1) * 12.9898) * 43758.5453;
  const fraction = x - Math.floor(x);
  return (fraction * 2 - 1) * strength;
}

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

  const relevantValues = rawValues.filter((_, index) =>
    relevantSet.has(domains[index].id),
  );

  const inferredAverage = average(relevantValues);

  return rawValues.map((value, index) => {
    const isRelevant = relevantSet.has(domains[index].id);

    if (isRelevant) {
      return {
        value,
        projected: false,
        relevant: true,
      };
    }

    const originalInfluence = value * 0.28;
    const inferredInfluence = inferredAverage * 0.72;
    const jitter = seededJitter(index, 0.85);

    const projectedValue = clamp(
      inferredInfluence + originalInfluence + jitter,
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
