import * as React from "react";
import { isUndefined } from "@fxts/core";

type TabState = { status: "loading" } | { status: "unavailable" } | { status: "ready"; tabId: number; active: boolean };

export default function App() {
  let [tabState, setTabState] = React.useState<TabState>({ status: "loading" });

  React.useEffect(() => {
    (async () => {
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (isUndefined(tab.id)) return setTabState({ status: "unavailable" });
      chrome.tabs
        .sendMessage(tab.id, { type: "GET_STATE" })
        .then((response: { active: boolean }) =>
          setTabState({ status: "ready", tabId: tab.id as number, active: response.active }),
        )
        .catch(() => setTabState({ status: "unavailable" }));
    })();
  }, []);

  function toggle() {
    if (tabState.status !== "ready") return;
    chrome.tabs
      .sendMessage(tabState.tabId, { type: "TOGGLE" })
      .then((response: { active: boolean }) => setTabState({ ...tabState, active: response.active }));
  }

  return (
    <div className="w-64 p-4 font-sans">
      <h1 className="text-base font-bold text-slate-800">TabPilotForA11y</h1>
      <p className="mt-1 text-xs text-slate-500">키보드 Tab 이동 순서를 시각화합니다</p>

      {tabState.status === "loading" && <p className="mt-3 text-xs text-slate-400">확인 중…</p>}

      {tabState.status === "unavailable" && (
        <p className="mt-3 text-xs text-slate-400">
          이 페이지에서는 사용할 수 없어요.
          <br />
          일반 웹 페이지에서 열어보세요. (익스텐션 설치 전에 열린 탭이라면 새로고침)
        </p>
      )}

      {tabState.status === "ready" && (
        <button
          onClick={toggle}
          className={`mt-3 w-full rounded-md py-2 text-sm font-semibold text-white transition-colors ${
            tabState.active ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"
          }`}>
          {tabState.active ? "시각화 끄기" : "시각화 켜기"}
        </button>
      )}
    </div>
  );
}
