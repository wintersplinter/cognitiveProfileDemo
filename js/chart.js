import { domainGroups } from "../data/domains.js";

const PLOT_HEIGHT = 320;
const LABEL_HEIGHT = 180;
const BAR_WRAP_WIDTH = 20;
const BAR_GAP = 8;
const GROUP_SIDE_PADDING = 8;

function getGroupPixelWidth(domainCount) {
  return (
    domainCount * BAR_WRAP_WIDTH +
    (domainCount - 1) * BAR_GAP +
    GROUP_SIDE_PADDING * 2
  );
}

function makeBar(domain, item, maxValue = 20) {
  const wrapper = document.createElement("div");
  wrapper.className = "bar-wrap";

  const plotSlot = document.createElement("div");
  plotSlot.className = "bar-plot-slot";
  plotSlot.style.height = `${PLOT_HEIGHT}px`;

  const bar = document.createElement("div");
  bar.className = "bar";
  bar.style.height = `${(item.value / maxValue) * PLOT_HEIGHT}px`;
  bar.style.background = domain.color;

  if (item.projected) {
    bar.classList.add("projected");
  }

  if (item.relevant) {
    bar.classList.add("relevant");
  }

  const tag = item.projected ? "projected" : item.relevant ? "observed" : "raw";

  bar.title = `${domain.label}: ${item.value.toFixed(1)} (${tag})`;

  plotSlot.appendChild(bar);

  const labelSlot = document.createElement("div");
  labelSlot.className = "bar-label-slot";
  labelSlot.style.height = `${LABEL_HEIGHT}px`;

  const label = document.createElement("div");
  label.className = "bar-label";
  label.textContent = domain.label;

  labelSlot.appendChild(label);

  wrapper.appendChild(plotSlot);
  wrapper.appendChild(labelSlot);

  return wrapper;
}

function makeGroupFooter(group) {
  const footer = document.createElement("div");
  footer.className = "group-footer";
  footer.textContent = group.label;
  footer.style.width = `${getGroupPixelWidth(group.domains.length)}px`;
  return footer;
}

export function drawChart(domains, displayItems) {
  const chart = document.getElementById("chart");
  chart.innerHTML = "";

  const topArea = document.createElement("div");
  topArea.className = "chart-top";

  const axis = document.createElement("div");
  axis.className = "chart-axis";

  const axisTop = document.createElement("div");
  axisTop.className = "axis-label axis-top";
  axisTop.textContent = "20";

  const axisBottom = document.createElement("div");
  axisBottom.className = "axis-label axis-bottom";
  axisBottom.textContent = "0";

  const axisPlot = document.createElement("div");
  axisPlot.className = "axis-plot";
  axisPlot.style.height = `${PLOT_HEIGHT}px`;

  const axisLabelSpacer = document.createElement("div");
  axisLabelSpacer.className = "axis-label-spacer";
  axisLabelSpacer.style.height = `${LABEL_HEIGHT}px`;

  axis.appendChild(axisTop);
  axis.appendChild(axisBottom);
  axis.appendChild(axisPlot);
  axis.appendChild(axisLabelSpacer);

  const groupsArea = document.createElement("div");
  groupsArea.className = "groups-area";

  let domainIndex = 0;

  for (const group of domainGroups) {
    const groupColumn = document.createElement("div");
    groupColumn.className = "group-column";
    groupColumn.style.width = `${getGroupPixelWidth(group.domains.length)}px`;

    const barsRow = document.createElement("div");
    barsRow.className = "bars-row";

    for (const domain of group.domains) {
      const enrichedDomain = domains[domainIndex];
      const item = displayItems[domainIndex];
      barsRow.appendChild(makeBar(enrichedDomain, item));
      domainIndex += 1;
    }

    groupColumn.appendChild(barsRow);
    groupsArea.appendChild(groupColumn);
  }

  topArea.appendChild(axis);
  topArea.appendChild(groupsArea);

  const footerRow = document.createElement("div");
  footerRow.className = "footer-row";

  for (const group of domainGroups) {
    footerRow.appendChild(makeGroupFooter(group));
  }

  chart.appendChild(topArea);
  chart.appendChild(footerRow);
}
