import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// Register GSAP + ScrollTrigger exactly once before any component using
// ScrollTrigger mounts (Req 4.2). The import is intentionally side-effecting.
import "./animation/gsap.js";
import App from "./App.jsx";
import { ErrorBoundary } from "./components/ErrorBoundary";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
