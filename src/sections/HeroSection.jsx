import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMediaQuery } from "react-responsive";
import { getProductImageUrl, heroProducts } from "../constants";
import "./HeroSection.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const BASE = import.meta.env.BASE_URL;

const IMAGES = heroProducts.map((product) => ({
  ...product,
  src: getProductImageUrl(product.image),
  desc: product.description,
}));

const COUNT = IMAGES.length;
const TRANSITION_MS = 650;
const AUTOSLIDE_MS = 5000; // time each slide stays before advancing

const grainSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='200' height='200' filter='url(#n)' opacity='0.08'/></svg>`;
const grainUrl = `url("data:image/svg+xml,${encodeURIComponent(grainSvg)}")`;

const getItemStyle = (i, activeIndex, isMobile) => {
  const center = activeIndex;
  const left = (activeIndex + COUNT - 1) % COUNT;
  const right = (activeIndex + 1) % COUNT;

  if (i === center) {
    return {
      transform: `translateX(-50%) scale(${isMobile ? 1.15 : 1.4})`,
      transformOrigin: "bottom center",
      filter: "none",
      opacity: 1,
      zIndex: 20,
      left: "50%",
      height: isMobile ? "40%" : "50%",
      bottom: isMobile ? "40%" : "26%",
    };
  }
  if (i === left) {
    return {
      transform: "translateX(-50%) scale(1)",
      filter: "blur(2px)",
      opacity: 0.85,
      zIndex: 10,
      left: isMobile ? "20%" : "30%",
      height: isMobile ? "14%" : "24%",
      bottom: isMobile ? "42%" : "46%",
    };
  }
  if (i === right) {
    return {
      transform: "translateX(-50%) scale(1)",
      filter: "blur(2px)",
      opacity: 0.85,
      zIndex: 10,
      left: isMobile ? "80%" : "70%",
      height: isMobile ? "14%" : "24%",
      bottom: isMobile ? "42%" : "46%",
    };
  }
  return {
    transform: "translateX(-50%) scale(1)",
    filter: "blur(4px)",
    opacity: 1,
    zIndex: 5,
    left: "50%",
    height: isMobile ? "12%" : "20%",
    bottom: isMobile ? "42%" : "46%",
  };
};

const HeroSection = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 639px)" });
  const [activeIndex, setActiveIndex] = useState(0);
  const isAnimating = useRef(false);
  const heroRef = useRef(null);
  const swipeStartRef = useRef(null);
  const [paused, setPaused] = useState(false);

  // Hold the hero in place while the message section scrolls over it.
  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
      });
    },
    { scope: heroRef }
  );

  // Preload all figurines
  useEffect(() => {
    IMAGES.forEach((d) => {
      const img = new Image();
      img.src = d.src;
    });
  }, []);

  const navigate = useCallback((dir) => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setActiveIndex((prev) =>
      dir === "next" ? (prev + 1) % COUNT : (prev + COUNT - 1) % COUNT
    );
    setTimeout(() => {
      isAnimating.current = false;
    }, TRANSITION_MS);
  }, []);

  const handleCarouselPointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    swipeStartRef.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleCarouselPointerUp = (event) => {
    const start = swipeStartRef.current;
    swipeStartRef.current = null;
    if (!start) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    navigate(deltaX < 0 ? "next" : "prev");
  };

  const handleCarouselPointerCancel = () => {
    swipeStartRef.current = null;
  };

  // Autoslide: advances after AUTOSLIDE_MS. The timer restarts whenever the
  // slide changes (including manual clicks) and pauses while a mouse hovers.
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => navigate("next"), AUTOSLIDE_MS);
    return () => clearTimeout(id);
  }, [activeIndex, paused, navigate]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") navigate("prev");
      if (e.key === "ArrowRight") navigate("next");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  return (
    <section id="hero" className="bg-main-bg">
    <div
      ref={heroRef}
      className="toon-hero"
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
      style={{ backgroundColor: IMAGES[activeIndex].bg }}
    >
      <video
        className="toon-video"
        src="https://res.cloudinary.com/msz67c6u/video/upload/v1793373046/hero-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      <div
        className="toon-tint"
        style={{ backgroundColor: IMAGES[activeIndex].bg }}
      />

      <div className="toon-grain" style={{ backgroundImage: grainUrl }} />

      {IMAGES.map((d, i) => (
        <div
          key={d.title}
          className={`toon-ghost-text${i === activeIndex ? " is-active" : ""}`}
          aria-hidden={i !== activeIndex}
        >
          {d.title}
        </div>
      ))}

      {/* Spotlight: soft glow behind the product, dark edges around it */}
      <div className="toon-vignette" />

      <div className="toon-brand"></div>

      <div
        className="toon-carousel"
        onPointerDown={handleCarouselPointerDown}
        onPointerUp={handleCarouselPointerUp}
        onPointerCancel={handleCarouselPointerCancel}
      >
        {IMAGES.map((d, i) => (
          <div
            key={d.src}
            className="toon-item"
            style={getItemStyle(i, activeIndex, isMobile)}
          >
            <img src={d.src} alt={d.name} draggable={false} />
          </div>
        ))}
      </div>

      {/* Dark gradient behind the text block for readability */}
      <div className="toon-text-scrim" />

      <div className="toon-bottom-left">
        <div key={activeIndex} className="toon-product-info">
          <p className="toon-product-title">{IMAGES[activeIndex].name}</p>
          <p className="toon-product-desc">{IMAGES[activeIndex].desc}</p>
        </div>
        <div className="toon-nav-buttons">
          <button
            className="toon-nav-btn"
            aria-label="Previous"
            onClick={() => navigate("prev")}
          >
            <svg viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            className="toon-nav-btn"
            aria-label="Next"
            onClick={() => navigate("next")}
          >
            <svg viewBox="0 0 24 24">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      <button
        type="button"
        className="toon-discover"
        onClick={() => {
          window.location.hash = `nutrition/${IMAGES[activeIndex].id}`;
        }}
      >
        BUY NOW
        <svg viewBox="0 0 24 24">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </div>
    </section>
  );
};

export default HeroSection;