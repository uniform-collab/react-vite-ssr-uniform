import React from "react";
import ReactDOMServer from "react-dom/server";
import App from "./App";
import homeComposition from "../content/homeComposition.json";

export function render() {
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <App composition={homeComposition} />
    </React.StrictMode>
  );
  return { html };
}
