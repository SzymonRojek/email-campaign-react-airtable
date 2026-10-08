import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App";
import { startMonitoring } from "./monitoring";
import { startAnalytics } from "./analytics";

startMonitoring();
startAnalytics();

createRoot(document.getElementById("root") as HTMLElement).render(<App />);
