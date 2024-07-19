import { CanvasClient } from "@uniformdev/canvas";
// import homeComposition from "../../content/homeComposition.json" assert { type: "json" };

export async function getComposition() {
  // returning a static composition from json
  //return homeComposition;

  // TODO: use this to fetch composition live
  return await getLiveComposition();
}

export async function getLiveComposition(path) {
  // TODO: move into env vars
  const canvasClient = new CanvasClient({
    projectId: "89e2e3e8-aaa7-4b89-9800-6334909c27e1",
    apiKey:
      "uf1afmk5r7tn5d0f3pxx09ur4cgh3rafejs4h737ygkyk8sgla9jvcncxeg6m040f6gwx2xtztj6xquvg7nde5axuzvehew30",
  });

  const response = await canvasClient.getCompositionByNodePath({
    projectMapNodePath: path ?? "/",
  });

  return response.composition;
}
