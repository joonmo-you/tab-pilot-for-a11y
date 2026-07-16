import type { FocusableItem } from "./scanner";

const CONTAINER_ID = "TPA-OVERLAY-ROOT" as const;
const SVG_NAMESPACE = "http://www.w3.org/2000/svg" as const;

export function removeOverlay() {
  document.getElementById(CONTAINER_ID)?.remove();
}

export function renderOverlay(items: Array<FocusableItem>) {
  removeOverlay();

  if (items.length === 0) return;

  let container = document.createElement("div");
  let svg = document.createElementNS(SVG_NAMESPACE, "svg");

  container.id = CONTAINER_ID;
  svg.setAttribute("width", String(document.documentElement.scrollWidth));
  svg.setAttribute("height", String(document.documentElement.scrollHeight));
  svg.classList.add("tpa-lines");

  let centers = items.map(({ element }) => {
    let rect = element.getBoundingClientRect();
    return { x: rect.left + window.scrollX + rect.width / 2, y: rect.top + window.scrollY + rect.height / 2 };
  });

  for (let index = 0; index < centers.length - 1; index++) {
    let line = document.createElementNS(SVG_NAMESPACE, "line");
    line.setAttribute("x1", String(centers[index].x));
    line.setAttribute("y1", String(centers[index].y));
    line.setAttribute("x2", String(centers[index + 1].x));
    line.setAttribute("y2", String(centers[index + 1].y));
    line.classList.add("tpa-line");
    svg.appendChild(line);
  }
  container.appendChild(svg);

  for (const item of items) {
    let rect = {
      ...item.element.getBoundingClientRect(),
      left: item.element.getBoundingClientRect().left + window.scrollX,
      top: item.element.getBoundingClientRect().top + window.scrollY,
    };

    let box = document.createElement("div");
    box.style.left = `${rect.left}px`;
    box.style.top = `${rect.top}px`;
    box.style.width = `${rect.width}px`;
    box.style.height = `${rect.height}px`;
    box.classList.add("tpa-box");

    let badge = document.createElement("span");
    badge.textContent = item.hasPositiveTabIndex ? `${item.order} ⚠tabindex: ${item.tabIndex}` : String(item.order);
    badge.classList.add("tpa-badge");

    box.appendChild(badge);
    container.appendChild(box);
  }

  document.documentElement.appendChild(container);
}
