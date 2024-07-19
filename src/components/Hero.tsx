import { RichTextParamValue } from "@uniformdev/canvas";
import { ComponentProps, UniformText, UniformRichText } from "@uniformdev/canvas-react";

type HeroProps = ComponentProps<{
  title: string;
  description?: RichTextParamValue;
}>;

const Hero: React.FC<HeroProps> = () => (
  <div>
    <UniformText
      className="title"
      parameterId="title"
      as="h1"
      data-test-id="hero-title"
      placeholder="Hero title goes here"
    />
    <UniformRichText parameterId="description" className="description" data-test-id="hero-description" />
  </div>
);

export default Hero;
