import fs from "node:fs/promises";
import express from "express";
import cors from "cors";
import {
  CanvasClient,
  isAllowedReferrer,
  EMPTY_COMPOSITION,
  IN_CONTEXT_EDITOR_CONFIG_CHECK_QUERY_STRING_PARAM,
} from "@uniformdev/canvas";

// This is using a stock Hello World project, you can change it to yours
// TODO: Move these to env vars — they are read-only :)
const UNIFORM_PROJECT_ID = "81bd0790-df64-485a-8aa3-7fc978d9b058";
const UNIFORM_API_KEY =
  "uf1rzhtef4ycj3c0asg97p2sekjzde6yq9v4nx2u69vl66rz9l89ta63z64efl8anzdrterc72zcm9ra9zwzaew88d8l7pnwn";

// For now, we will use the same path we use to render composition.
// But it's recommended to have a dedicated route for the playground and use <UniformPlayground />
const PLAYGROUND_PATH = "/";

// Constants
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5173;
const base = process.env.BASE || "/";

// Cached production assets
const templateHtml = isProduction ? await fs.readFile("./dist/client/index.html", "utf-8") : "";
const ssrManifest = isProduction
  ? await fs.readFile("./dist/client/.vite/ssr-manifest.json", "utf-8")
  : undefined;

// Create http server
const app = express();
app.use(cors());

// Add Vite or respective production middlewares
/**
 * @type {import('vite').ViteDevServer}
 */
let vite;
if (!isProduction) {
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base,
  });
  app.use(vite.middlewares);
} else {
  const compression = (await import("compression")).default;
  const sirv = (await import("sirv")).default;
  app.use(compression());
  app.use(base, sirv("./dist/client", { extensions: [] }));
}

// Serve HTML
app.use("*", async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, "");
    let template;
    let render;
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile("./index.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/entry-server.jsx")).render;
    } else {
      template = templateHtml;
      render = (await import("./dist/server/entry-server.js")).render;
    }

    const isConfigCheck = req.query[IN_CONTEXT_EDITOR_CONFIG_CHECK_QUERY_STRING_PARAM] === "true";
    if (isConfigCheck) {
      res.json({
        hasPlayground: Boolean(PLAYGROUND_PATH),
      });
      return;
    }

    const path = req.params[0];
    let composition;

    if (req.params[0] === "/api/preview" && isAllowedReferrer(req.headers.referer)) {
      // In preview mode, there is no need to spent time fetching the composition
      // we will get it from Canvas editor on the client-side. We just use a stub composition
      composition = EMPTY_COMPOSITION;
      // TODO: check if the preview secret is correct before moving forward
    } else {
      const canvasClient = new CanvasClient({
        projectId: UNIFORM_PROJECT_ID,
        apiKey: UNIFORM_API_KEY,
      });

      const response = await canvasClient.getCompositionByNodePath({
        projectMapNodePath: path,
      });

      composition = response.composition;
    }

    const rendered = await render({ composition });

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? "")
      .replace(`<!--app-html-->`, rendered.html ?? "");

    res.status(200).set({ "Content-Type": "text/html" }).send(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
