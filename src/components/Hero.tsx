type HeroProps = {
  title: string;
  description: string;
};

const Hero: React.FC<HeroProps> = ({ title, description }) => (
  <>
    <h1>{title}</h1>
    <div dangerouslySetInnerHTML={{ __html: description }}></div>
  </>
);

export default Hero;
