import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import homeComposition from "../content/homeComposition.json";

ReactDOM.hydrateRoot(
  document.getElementById("root"),
  <React.StrictMode>
    <App composition={homeComposition} />
  </React.StrictMode>
);
