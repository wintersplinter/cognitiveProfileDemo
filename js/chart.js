export function drawChart(values) {
  const chart = document.getElementById("chart");

  chart.innerHTML = "";

  values.forEach((v) => {
    const bar = document.createElement("div");

    bar.className = "bar";

    bar.style.height = v * 12 + "px";

    chart.appendChild(bar);
  });
}
