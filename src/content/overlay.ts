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

  let centers = items.map(({ element }) => {
    let rect = element.getBoundingClientRect();
    return { x: rect.left + window.scrollX + rect.width / 2, y: rect.top + window.scrollY + rect.height / 2 };
  });

  centers.forEach((_, index) => {
    let line = document.createElementNS(SVG_NAMESPACE, "line");
    line.setAttribute("x1", String(centers[index].x));
    line.setAttribute("y1", String(centers[index].y));
    line.setAttribute("x2", String(centers[index + 1].x));
    line.setAttribute("y2", String(centers[index + 1].y));
    line.classList.add("#tp=line");
    svg.appendChild(line);
  });

  for (const item of items) {
    let rect = {
      ...item.element.getBoundingClientRect(),
      left: item.element.getBoundingClientRect().left + window.screenX,
      top: item.element.getBoundingClientRect().top + window.screenY,
    };

    let box = document.createElement("div");
    box.style.left = `${rect.left}px`;
    box.style.top = `${rect.top}px`;
    box.style.width = `${rect.width}px`;
    box.style.height = `${rect.height}px`;

    let badge = document.createElement("span");
    badge.textContent = item.hasPositiveTabIndex ? `${item.order} ⚠tabindex: ${item.tabIndex}` : String(item.order);

    container.appendChild(box.appendChild(badge));
  }

  document.documentElement.appendChild(container);
}
