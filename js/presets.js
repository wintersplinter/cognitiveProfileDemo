export const presetDefinitions = {
  balanced: {
    label: "Balanced",
    description:
      "Relatief vlak profiel met beperkte structurele bias tussen domeinen.",
    groupBias: {},
    domainBias: {},
    localVarianceMultiplier: 0.7,
  },

  spiky_reflective: {
    label: "Spiky reflective",
    description:
      "Hogere kans op pieken in zelfmodellering, metacognitie, abstractie en creatieve synthese; lagere kans in verbale en executieve leesbaarheid.",
    groupBias: {
      self_modeling: 2.4,
      world_modeling: 1.4,
      creative_synthesis: 1.5,
      communication_symbol: -0.8,
      executive_regulatory: -1.0,
      social_cognition: -0.6,
    },
    domainBias: {
      metacognition: 2.0,
      existential_reflection: 2.2,
      abstraction: 1.5,
      pattern_recognition: 1.3,
      language_production: -1.0,
      social_signaling: -1.0,
      task_switching: -0.8,
      inhibition: -0.8,
    },
    localVarianceMultiplier: 1.35,
  },

  verbal_underread: {
    label: "Verbal under-read",
    description:
      "Interne complexiteit kan hoger liggen dan verbale of institutioneel leesbare output doet vermoeden.",
    groupBias: {
      self_modeling: 1.8,
      world_modeling: 1.2,
      communication_symbol: -1.6,
      executive_regulatory: -0.6,
      social_cognition: -0.8,
    },
    domainBias: {
      metacognition: 1.5,
      existential_reflection: 1.8,
      abstraction: 1.2,
      language_production: -2.1,
      language_comprehension: -0.7,
      social_signaling: -1.0,
      narrative_coherence: -0.8,
    },
    localVarianceMultiplier: 1.2,
  },

  institutionally_aligned: {
    label: "Institutionally aligned",
    description:
      "Hoger profiel in executieve en verbale leesbaarheid, met lagere kansen in creativiteit, sociale cognitie, zelfmodellering, esthetische gevoeligheid en delen van het affectieve domein.",
    groupBias: {
      executive_regulatory: 2.2,
      communication_symbol: 1.8,
      creative_synthesis: -1.8,
      social_cognition: -1.6,
      self_modeling: -1.8,
      emotional_affective: -1.0,
    },
    domainBias: {
      task_switching: 1.7,
      inhibition: 1.7,
      working_memory: 1.6,
      error_monitoring: 1.5,
      goal_prioritization: 1.8,
      language_production: 1.5,
      language_comprehension: 1.2,
      symbolic_logic: 1.0,

      divergent_thinking: -1.5,
      conceptual_blending: -1.6,
      artistic_expression: -1.8,
      aesthetic_sensitivity: -2.2,

      empathy: -1.1,
      theory_of_mind: -1.0,
      social_signaling: -0.8,

      self_awareness: -1.4,
      metacognition: -1.6,
      identity_coherence: -1.1,
      autobiographical_memory: -0.8,
      existential_reflection: -1.8,

      emotion_generation: -0.8,
      reward_sensitivity: -0.7,
      affective_stability: -0.4,
    },
    localVarianceMultiplier: 0.95,
  },
};
