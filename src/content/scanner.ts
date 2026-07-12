export type FocusableItem = {
  element: HTMLElement;
  tabIndex: number;
  order: number;
  hasPositiveTabIndex: boolean;
};

const FocusableSelectors = [
  "a[href]",
  "area[href]",
  "button",
  "input",
  "select",
  "textarea",
  "[tabindex]",
  '[contenteditable="true"]',
  '[contenteditable=""]',
  "audio[controls]",
  "video[controls]",
  "details > summary",
  "iframe",
] as const;

function isVisible(element: HTMLElement): boolean {
  let style = window.getComputedStyle(element);
  let rect = element.getBoundingClientRect();
  if (style.display === "none" || style.visibility === "hidden") return false;
  return rect.width > 0 && rect.height > 0;
}

function isTabbable(element: HTMLElement): boolean {
  let details = element.closest("details:not([open])");
  if (element.tabIndex < 0) return false;
  if ("disabled" in element && (element as HTMLButtonElement).disabled) return false;
  if (element.closest("[inert]")) return false;
  if (details !== null && !(element.tagName === "summary" && element.parentElement === details)) return false;
  return isVisible(element);
}

export function scanTabOrder(root: ParentNode = document): Array<FocusableItem> {
  let candidates = Array.from(root.querySelectorAll<HTMLElement>(FocusableSelectors.join(","))).filter(isTabbable);
  return [
    ...candidates.filter((element) => element.tabIndex > 0).sort((a, b) => a.tabIndex - b.tabIndex),
    ...candidates.filter((element) => element.tabIndex === 0),
  ].map((element, index) => ({
    element,
    tabIndex: element.tabIndex,
    order: index + 1,
    hasPositiveTabIndex: element.tabIndex > 0,
  }));
}
