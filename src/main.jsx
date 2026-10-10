import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App, { preloadFor } from "./App";
import { AppProvider } from "./lib/store";
import "./index.css";

const start = () => createRoot(document.getElementById("root")).render(
  <React.StrictMode><BrowserRouter><AppProvider><App /></AppProvider></BrowserRouter></React.StrictMode>
);
preloadFor(location.pathname).finally(start);
