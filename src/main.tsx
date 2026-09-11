import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MinigameAuthProvider } from "@/context/minigame-auth-context";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <MinigameAuthProvider>
        <App />
      </MinigameAuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
