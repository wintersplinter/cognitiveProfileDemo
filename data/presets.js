/*
DOMAIN BIAS TEMPLATE

Gebruik waarden:
-2 sterk onder gemiddeld
-1 licht onder gemiddeld
 0 neutraal
 1 licht boven gemiddeld
 2 sterk boven gemiddeld
*/

/*
domainBias: {
  // Perceptual Domains
  auditory_perception: 0,
  somatosensory_perception: 0,
  proprioception: 0,
  interoception: 0,
  olfactory_gustatory_perception: 0,

  // World–Modeling & Cognitive Structure
  causal_reasoning: 0,
  temporal_reasoning: 0,
  spatial_reasoning: 0,
  pattern_recognition: 0,
  abstraction: 0,

  // Action & Embodiment
  directed_attention: 0,
  fine_motor_control: 0,
  gross_motor_coordination: 0,
  procedural_skill: 0,
  rhythm: 0,

  // Emotional & Affective Domains
  emotion_generation: 0,
  emotion_regulation: 0,
  motivation_drive: 0,
  reward_sensitivity: 0,
  affective_stability: 0,

  // Social Cognition
  theory_of_mind: 0,
  empathy: 0,
  social_signaling: 0,
  trust_attachment: 0,
  group_dynamics: 0,

  // Communication & Symbol Use
  language_comprehension: 0,
  language_production: 0,
  symbolic_logic: 0,
  metaphor_analogy: 0,
  narrative_coherence: 0,

  // Self–Modeling & Introspection
  self_awareness: 0,
  metacognition: 0,
  identity_coherence: 0,
  autobiographical_memory: 0,
  existential_reflection: 0,

  // Creative Synthesis
  divergent_thinking: 0,
  conceptual_blending: 0,
  novel_problem_solving: 0,
  artistic_expression: 0,
  aesthetic_sensitivity: 0,

  // Executive & Regulatory Control
  task_switching: 0,
  inhibition: 0,
  working_memory: 0,
  error_monitoring: 0,
  goal_prioritization: 0,
}
*/

export const presetDefinitions = {
  neutral_random: {
    label: "Natural variation",
    description:
      "Geen specifieke nadruk. Alle domeinen gedragen zich neutraal en worden alleen gestuurd door total points en variance.",
    domainBias: {},
  },

  internal_modeling_dominant: {
    label: "Internal modeling dominant",
    description:
      "Sterkere interne modellering, patroonherkenning, abstractie en zelfreflectie. Minder nadruk op directe externe leesbaarheid.",
    domainBias: {
      causal_reasoning: 1,
      temporal_reasoning: 1,
      spatial_reasoning: 1,
      pattern_recognition: 2,
      abstraction: 2,

      self_awareness: 1,
      metacognition: 2,
      identity_coherence: 1,
      autobiographical_memory: 1,
      existential_reflection: 2,

      divergent_thinking: 1,
      conceptual_blending: 1,
      novel_problem_solving: 1,

      // Communication & Symbol Use
      language_comprehension: 1,
      language_production: -2,
      symbolic_logic: -1,
      metaphor_analogy: 0,
      narrative_coherence: -1,

      // Executive & Regulatory Control
      task_switching: -2,
      inhibition: -2,
      error_monitoring: -1,
      goal_prioritization: -2,
    },
  },

  institutionally_legible: {
    label: "Institutionally legible",
    description:
      "Sterker in taaloutput, symbolische helderheid en executieve regulatie. Wordt makkelijker positief gelezen door institutionele evaluatie.",
    domainBias: {
      directed_attention: 1,

      language_comprehension: 1,
      language_production: 2,
      symbolic_logic: 2,
      narrative_coherence: 1,

      task_switching: 2,
      inhibition: 2,
      working_memory: 1,
      error_monitoring: 2,
      goal_prioritization: 2,

      divergent_thinking: -1,
      conceptual_blending: -1,
      artistic_expression: -1,
      aesthetic_sensitivity: -1,

      self_awareness: -1,
      metacognition: -1,
      existential_reflection: -1,
    },
  },

  socially_attuned: {
    label: "Socially attuned",
    description:
      "Sterkere sociale afstemming, emotionele regulatie en communicatieve leesbaarheid. Wordt makkelijker ondersteund door sociale systemen.",
    domainBias: {
      emotion_regulation: 2,
      motivation_drive: 1,
      affective_stability: 1,

      theory_of_mind: 2,
      empathy: 2,
      social_signaling: 2,
      trust_attachment: 1,
      group_dynamics: 1,

      language_comprehension: 1,
      language_production: 1,
      narrative_coherence: 1,

      abstraction: -1,
      existential_reflection: -1,
      symbolic_logic: -1,
    },
  },

  creative_synthesis_dominant: {
    label: "Creative synthesis dominant",
    description:
      "Sterkere creatieve hercombinatie, esthetische gevoeligheid en nieuwe oplossingsrichtingen. Minder nadruk op standaard regulatie en institutionele netheid.",
    domainBias: {
      divergent_thinking: 2,
      conceptual_blending: 2,
      novel_problem_solving: 1,
      artistic_expression: 2,
      aesthetic_sensitivity: 2,

      metaphor_analogy: 1,
      pattern_recognition: 1,

      inhibition: -1,
      error_monitoring: -1,
      goal_prioritization: -1,
      narrative_coherence: -1,
    },
  },

  executive_language_bottleneck: {
    label: "Executive-language bottleneck",
    description:
      "Lagere executieve regulatie en taaloutput, terwijl andere domeinen vrij kunnen variëren. Kan bij hoge total points en variance sterk verkeerd gelezen worden.",
    domainBias: {
      language_comprehension: -1,
      language_production: -2,
      narrative_coherence: -1,

      task_switching: -2,
      inhibition: -2,
      working_memory: -1,
      error_monitoring: -1,
      goal_prioritization: -2,
    },
  },

  NWOO: {
    label: "NWOO",
    description:
      "Profiel met relatief zwakkere executieve functies en lagere taaloutput, waardoor sterke interne capaciteiten makkelijker verkeerd gelezen kunnen worden.",
    domainBias: {
      // Communication & Symbol Use
      language_comprehension: 1,
      language_production: -2,
      symbolic_logic: -1,
      metaphor_analogy: 0,
      narrative_coherence: -1,

      // Executive & Regulatory Control
      task_switching: -2,
      inhibition: -2,
      working_memory: 0,
      error_monitoring: -1,
      goal_prioritization: -2,
    },
  },
};
