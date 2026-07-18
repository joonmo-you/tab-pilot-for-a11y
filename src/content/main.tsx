import { match } from "ts-pattern";

import { removeOverlay, renderOverlay } from "./overlay.ts";
import { scanTabOrder } from "./scanner.ts";

import "./overlay.css";

let active = false;

function refresh() {
  if (!active) return;
  renderOverlay(scanTabOrder());
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  match(message)
    .with({ type: "TOGGLE" }, () => {
      active = !active;
      active ? refresh() : removeOverlay();
      sendResponse({ active });
    })
    .with({ type: "GET_STATE" }, () => {
      sendResponse({ active });
    });
});

renderOverlay(scanTabOrder());

let resizeTimer: number | undefined;

window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(refresh, 150);
});
