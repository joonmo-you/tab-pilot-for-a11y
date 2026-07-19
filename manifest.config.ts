import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "TabPilotForA11y",
  version: "0.1.0",
  icons: {
    16: "public/icons/icon-16.png",
    48: "public/icons/icon-48.png",
    128: "public/icons/icon-128.png",
  },
  action: {
    default_icon: {
      16: "public/icons/icon-16.png",
      48: "public/icons/icon-48.png",
    },
    default_popup: "src/popup/index.html",
    default_title: "TabPilotForA11y",
  },
  permissions: ["activeTab", "contentSettings"],
  content_scripts: [
    {
      js: ["src/content/main.tsx"],
      matches: ["<all_urls>"],
    },
  ],
});
