import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeContextProvider } from "./components/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeContextProvider>
  </React.StrictMode>
);
