export const domainGroups = [
  {
    id: "perceptual",
    label: "Perceptual Domains",
    color: "#e8dba4",
    domains: [
      { id: "auditory_perception", label: "Auditory perception" },
      { id: "somatosensory_perception", label: "Somatosensory perception" },
      { id: "proprioception", label: "Proprioception" },
      { id: "interoception", label: "Interoception" },
      {
        id: "olfactory_gustatory_perception",
        label: "Olfactory / gustatory perception",
      },
    ],
  },
  {
    id: "world_modeling",
    label: "World–Modeling & Cognitive Structure",
    color: "#9fd0df",
    domains: [
      { id: "causal_reasoning", label: "Causal reasoning" },
      { id: "temporal_reasoning", label: "Temporal reasoning" },
      { id: "spatial_reasoning", label: "Spatial reasoning" },
      { id: "pattern_recognition", label: "Pattern recognition" },
      { id: "abstraction", label: "Abstraction" },
    ],
  },
  {
    id: "action_embodiment",
    label: "Action & Embodiment",
    color: "#cbbba7",
    domains: [
      { id: "directed_attention", label: "Directed attention" },
      { id: "fine_motor_control", label: "Fine motor control" },
      { id: "gross_motor_coordination", label: "Gross motor coordination" },
      { id: "procedural_skill", label: "Procedural skill" },
      { id: "rhythm", label: "Rhythm" },
    ],
  },
  {
    id: "emotional_affective",
    label: "Emotional & Affective Domains",
    color: "#e9a45b",
    domains: [
      { id: "emotion_generation", label: "Emotion generation" },
      { id: "emotion_regulation", label: "Emotion regulation *" },
      { id: "motivation_drive", label: "Motivation / drive" },
      { id: "reward_sensitivity", label: "Reward sensitivity" },
      { id: "affective_stability", label: "Affective stability" },
    ],
  },
  {
    id: "social_cognition",
    label: "Social Cognition",
    color: "#63b8d3",
    domains: [
      { id: "theory_of_mind", label: "Theory of mind" },
      { id: "empathy", label: "Empathy" },
      { id: "social_signaling", label: "Social signaling" },
      { id: "trust_attachment", label: "Trust & attachment" },
      { id: "group_dynamics", label: "Group dynamics" },
    ],
  },
  {
    id: "communication_symbol",
    label: "Communication & Symbol Use",
    color: "#ae7b9c",
    domains: [
      { id: "language_comprehension", label: "Language comprehension" },
      { id: "language_production", label: "Language production" },
      { id: "symbolic_logic", label: "Symbolic logic" },
      { id: "metaphor_analogy", label: "Metaphor & analogy" },
      { id: "narrative_coherence", label: "Narrative coherence" },
    ],
  },
  {
    id: "self_modeling",
    label: "Self–Modeling & Introspection",
    color: "#f1dd00",
    domains: [
      { id: "self_awareness", label: "Self-awareness" },
      { id: "metacognition", label: "Metacognition" },
      { id: "identity_coherence", label: "Identity coherence" },
      { id: "autobiographical_memory", label: "Autobiographical memory" },
      { id: "existential_reflection", label: "Existential reflection" },
    ],
  },
  {
    id: "creative_synthesis",
    label: "Creative Synthesis",
    color: "#a88658",
    domains: [
      { id: "divergent_thinking", label: "Divergent thinking" },
      { id: "conceptual_blending", label: "Conceptual blending" },
      { id: "novel_problem_solving", label: "Novel problem solving" },
      { id: "artistic_expression", label: "Artistic expression" },
      { id: "aesthetic_sensitivity", label: "Aesthetic sensitivity" },
    ],
  },
  {
    id: "executive_regulatory",
    label: "Executive & Regulatory Control",
    color: "#b8b8b8",
    domains: [
      { id: "task_switching", label: "Task switching *" },
      { id: "inhibition", label: "Inhibition *" },
      { id: "working_memory", label: "Working memory *" },
      { id: "error_monitoring", label: "Error monitoring *" },
      { id: "goal_prioritization", label: "Goal prioritization *" },
    ],
  },
];

export const allDomains = domainGroups.flatMap((group) =>
  group.domains.map((domain) => ({
    ...domain,
    groupId: group.id,
    groupLabel: group.label,
    color: group.color,
  })),
);

export const DOMAIN_MIN = 1;
export const DOMAIN_MAX = 20;
export const DEFAULT_TOTAL_POINTS = 600;
export const DEFAULT_VARIANCE = 6;
