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
    <main className="min-w-80 py-8 px-4 font-sans m-2 w-64">
      <h1 className="text-3xl mb-4 font-bold text-slate-800">Tab Pilot For A11y</h1>
      <p className="my-2 text-xs text-slate-500">키보드 Tab 이동 순서를 시각화합니다</p>

      {tabState.status === "loading" && <p className="mt-3 text-xs text-slate-400">로딩 중…</p>}

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
          className={`mt-2 w-full rounded-md py-2 text-sm font-semibold text-white transition-colors ${
            tabState.active
              ? "bg-red-500 fill-red-500 drop-shadow-lg drop-shadow-red-500/50 "
              : "bg-cyan-500 fill-cyan-500 drop-shadow-lg drop-shadow-cyan-500/50 "
          }`}>
          {tabState.active ? "탭 순서 비활성화" : "탭 순서 활성화"}
        </button>
      )}
    </main>
  );
}
