import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Home from "./home/home.tsx";
import App from "./App.tsx";
import Dashboard from "./dashboard/dashboard.tsx";
import "./index.css";
import Signin from "./authentication/signin.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  </StrictMode>
);
