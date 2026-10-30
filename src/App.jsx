import NavBar from "./components/NavBar";
import HeroSection from "./sections/HeroSection";
import { ScrollTrigger } from "gsap/all";
import gsap from "gsap";
import MessageSection from "./sections/MessageSection";
import FlavorSection from "./sections/FlavorSection";
import ProductPage from "./components/ProductPage";
import FooterSection from "./sections/FooterSection";
import { useEffect, useState } from "react";
import { products } from "./constants";

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const [routeHash, setRouteHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onLoad = () => ScrollTrigger.refresh();
    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);

  useEffect(() => {
    const syncRoute = () => setRouteHash(window.location.hash);
    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  const isProductPage = routeHash.startsWith("#nutrition");
  const productId = routeHash.split("/")[1];
  const selectedProduct =
    products.find((product) => product.id === productId) ?? products[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [routeHash]);

  return (
    <main>
      <NavBar />
      {isProductPage ? (
        <>
          <button
            type="button"
            onClick={() => {
              window.location.hash = "";
            }}
            className="fixed right-5 top-5 z-[60] rounded-full bg-dark-brown px-5 py-3 font-paragraph text-white"
          >
            Back to home
          </button>
          <ProductPage product={selectedProduct} />
        </>
      ) : (
        <>
          <HeroSection />
          <MessageSection />
          <FlavorSection />
          <FooterSection />
        </>
      )}
    </main>
  );
};

export default App;
