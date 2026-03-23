import { allDomains } from "../data/domains.js";
import { state } from "./state.js";
import { generateProfile } from "./generator.js";
import { projectProfile } from "./lenses.js";
import { drawChart } from "./chart.js";
import { presetDefinitions } from "../data/presets.js";

const totalPointsInput = document.getElementById("totalPoints");
const varianceInput = document.getElementById("variance");
const presetSelect = document.getElementById("presetSelect");
const generateButton = document.getElementById("generate");
const lensButtons = document.querySelectorAll(".lens-btn");
const viewDescription = document.getElementById("viewDescription");
const modelFraming = document.getElementById("modelFraming");

const viewDescriptions = {
  raw: "Real profile: het onderliggende cognitieve profiel zoals het werkelijk gegenereerd werd.",
  iq: "Institutionally inferred profile (IQ-like): een systeem ziet vooral een beperkte selectie van domeinen en trekt van daaruit de rest fictief richting dat waargenomen gemiddelde.",
  scc: "Institutionally inferred profile (SCC): een systeem ziet vooral maatschappelijk-connectieve capaciteiten en projecteert van daaruit een breder profiel.",
};

function fillPresetSelect() {
  presetSelect.innerHTML = "";

  Object.entries(presetDefinitions).forEach(([key, preset]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = preset.label;
    presetSelect.appendChild(option);
  });

  presetSelect.value = state.activePreset;
}

function updateViewButtons() {
  lensButtons.forEach((button) => {
    const isActive = button.dataset.lens === state.activeLens;
    button.classList.toggle("active", isActive);
  });
}

function updateDescription() {
  const preset = presetDefinitions[state.activePreset];

  if (state.activeLens === "raw") {
    modelFraming.textContent = "Real profile";
  } else {
    modelFraming.textContent = "Institutionally inferred profile";
  }

  viewDescription.textContent =
    `${viewDescriptions[state.activeLens]} ` +
    `Preset: ${preset.label}. ${preset.description}`;
}

function render() {
  const displayedItems = projectProfile(
    state.rawValues,
    allDomains,
    state.activeLens,
  );

  drawChart(allDomains, displayedItems);
  updateViewButtons();
  updateDescription();
}

function regenerate() {
  state.totalPoints = Number(totalPointsInput.value);
  state.variance = Number(varianceInput.value);
  state.activePreset = presetSelect.value;

  state.rawValues = generateProfile(
    allDomains,
    state.totalPoints,
    state.variance,
    presetDefinitions[state.activePreset],
  );

  render();
}

generateButton.addEventListener("click", regenerate);

presetSelect.addEventListener("change", () => {
  state.activePreset = presetSelect.value;
  regenerate();
});

lensButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.activeLens = button.dataset.lens;
    render();
  });
});

fillPresetSelect();

state.rawValues = generateProfile(
  allDomains,
  state.totalPoints,
  state.variance,
  presetDefinitions[state.activePreset],
);

render();
