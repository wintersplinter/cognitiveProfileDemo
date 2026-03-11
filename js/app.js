import { domains } from "../data/domains.js";
import { state } from "./state.js";
import { generateProfile } from "./generator.js";
import { drawChart } from "./chart.js";

const btn = document.getElementById("generate");

btn.onclick = () => {
  const total = parseInt(document.getElementById("totalPoints").value);
  const variance = parseInt(document.getElementById("variance").value);

  state.values = generateProfile(domains.length, total, variance);

  drawChart(state.values);
};
