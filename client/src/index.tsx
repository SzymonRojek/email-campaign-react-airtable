import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App";
import { startMonitoring } from "./monitoring";

startMonitoring();

createRoot(document.getElementById("root") as HTMLElement).render(<App />);
