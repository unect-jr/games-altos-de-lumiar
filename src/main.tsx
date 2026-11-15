import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "motion/react";
import { RouterProvider } from "react-router";
import "./index.css";
import { router } from "./router";
import { SessaoProvider } from "./store/SessaoProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SessaoProvider>
      <MotionConfig reducedMotion="user">
        <RouterProvider router={router} />
      </MotionConfig>
    </SessaoProvider>
  </StrictMode>,
);
