import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Import font awesome for icons (linked via CDN - not a direct dependency)
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

// Don't auto-add CSS since we're adding it via CDN
config.autoAddCss = false;

// We're loading Google Fonts via index.html link tags instead of Next.js font loader
// which is not compatible with Vite

createRoot(document.getElementById("root")!).render(<App />);
