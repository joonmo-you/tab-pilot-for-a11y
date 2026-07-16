import { renderOverlay } from "./overlay.ts";
import { scanTabOrder } from "./scanner.ts";
import "./overlay.css";

console.log("[CRXJS] Hello world from content script!");

let items = scanTabOrder();
console.log(`[TabPilotForA11y] 포커스 가능 요소 ${items.length}개 발견`);

console.table(
  items.map(({ order, tabIndex, element }) => ({
    order,
    tabIndex,
    tag: element.tagName.toLowerCase(),
    text: (element.textContent ?? "").trim().slice(0, 30),
  })),
);

renderOverlay(scanTabOrder());
