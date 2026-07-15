import Hero from "../components/Hero/Hero";
import AIStudio from "../components/AIStudio/AIStudio";
import Products from "../components/Products/Product";
import useRouteMetadata from "../hooks/useRouteMetadata";
import { routeDescriptions } from "../data/catalog";

function Home() {
  useRouteMetadata({
    title: "AURA | Home",
    description: routeDescriptions.home,
  });

  return (
    <>
      <Hero />
      <AIStudio />
      <Products />
    </>
  );
}

export default Home;