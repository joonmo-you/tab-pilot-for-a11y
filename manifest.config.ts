import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "TabPilotForA11y",
  version: "0.1.0",
  icons: {
    48: "public/logo.png",
  },
  action: {
    default_icon: {
      48: "public/logo.png",
    },
    default_popup: "src/popup/index.html",
    default_title: "TabPilotForA11y",
  },
  permissions: ["activeTab", "sidePanel", "contentSettings"],
  content_scripts: [
    {
      js: ["src/content/main.tsx"],
      matches: ["<all_urls>"],
    },
  ],
  side_panel: {
    default_path: "src/sidepanel/index.html",
  },
});
