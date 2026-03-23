export const presetDefinitions = {
  balanced: {
    label: "Balanced reference",
    description: "Relatief vlak referentieprofiel met weinig structurele bias.",
    groupBias: {},
    domainBias: {},
    localVarianceMultiplier: 0.7,
  },

  deep_reflective: {
    label: "Deep reflective",
    description:
      "Sterkere interne modellering, zelfreflectie en creatieve synthese dan institutionele outputkanalen doen vermoeden.",
    groupBias: {
      world_modeling: 3,
      self_modeling: 3,
      creative_synthesis: 2,
      executive_regulatory: -2,
      communication_symbol: -2,
    },
    domainBias: {},
    localVarianceMultiplier: 1.15,
  },

  institutional: {
    label: "Institutionally aligned",
    description:
      "Capaciteiten die institutionele systemen makkelijk herkennen liggen hoger, terwijl andere domeinen minder uitgesproken zichtbaar zijn.",
    groupBias: {
      executive_regulatory: 3,
      communication_symbol: 3,
      creative_synthesis: -2,
      self_modeling: -2,
      social_cognition: -1,
    },
    domainBias: {},
    localVarianceMultiplier: 0.9,
  },

  verbal_bottleneck: {
    label: "Verbal bottleneck",
    description:
      "Sterke modellering en inzicht, maar zwakkere verbale expressie en institutionele leesbaarheid.",
    groupBias: {
      world_modeling: 3,
      communication_symbol: -3,
    },
    domainBias: {},
    localVarianceMultiplier: 1.0,
  },

  socially_legible: {
    label: "Socially legible",
    description:
      "Hoge sociale leesbaarheid en connectiviteit, zonder dat diepere modellering noodzakelijk even sterk is.",
    groupBias: {
      social_cognition: 3,
      communication_symbol: 2,
      executive_regulatory: -1,
      world_modeling: -1,
    },
    domainBias: {},
    localVarianceMultiplier: 0.95,
  },
};
