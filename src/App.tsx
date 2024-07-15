import { RootComponentInstance } from "@uniformdev/canvas";
import { UniformComposition, UniformSlot } from "@uniformdev/canvas-react";

import "./components";

import "./App.css";

function App({ composition }: { composition: RootComponentInstance }) {
  return (
    <>
      <UniformComposition data={composition}>
        <UniformSlot name="content" />
      </UniformComposition>
    </>
  );
}

export default App;
