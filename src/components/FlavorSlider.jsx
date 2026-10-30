import { useGSAP } from "@gsap/react";
import { getProductImageUrl, products } from "../constants";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import "./FlavorSlider.css";

// Same settings as the Nike card's vanilla-tilt config
const MAX_TILT = 15;
const TILT_SCALE = 1.05;

// Faint giant words in the card corners (Nike: "NIKE" / "SHOES")
const GHOST_TOP = "WISE";
const GHOST_BOTTOM = "MAX";
const BUY_LABEL = "Buy Now";

const FALLBACK_ACCENT = "#e3a458";
const clamp01 = (n) => Math.min(1, Math.max(0, n));

// Average colour of the bg SVG, used as the card's accent (circle + button).
const sampleAccent = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const size = 32;
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);
        let r = 0, g = 0, b = 0, n = 0;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] > 200) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            n++;
          }
        }
        resolve(n ? `rgb(${Math.round(r / n)}, ${Math.round(g / n)}, ${Math.round(b / n)})` : null);
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.width = 64;
    img.height = 64;
    img.src = src;
  });

const FlavorCard = ({ flavor }) => {
  const wrapRef = useRef(null);
  const cardRef = useRef(null);
  const [accent, setAccent] = useState(flavor.accent ?? null);

  const base = import.meta.env.BASE_URL;
  const bgSrc = `${base}images/${flavor.color}-bg.svg`;

  useEffect(() => {
    if (flavor.accent) return;
    let alive = true;
    sampleAccent(bgSrc).then((c) => alive && c && setAccent(c));
    return () => {
      alive = false;
    };
  }, [bgSrc, flavor.accent]);

  // vanilla-tilt maths: rotateY = max/2 - x*max, rotateX = y*max - max/2
  const handleMove = (e) => {
    if (e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const x = clamp01((e.clientX - rect.left) / rect.width);
    const y = clamp01((e.clientY - rect.top) / rect.height);
    const card = cardRef.current;
    card.style.setProperty("--rx", `${y * MAX_TILT - MAX_TILT / 2}deg`);
    card.style.setProperty("--ry", `${MAX_TILT / 2 - x * MAX_TILT}deg`);
    card.style.setProperty("--s", TILT_SCALE);
  };

  const handleLeave = () => {
    const card = cardRef.current;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
    card.style.setProperty("--s", 1);
  };

  return (
    <div
      ref={wrapRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="fc-wrap relative z-30 flex-none"
      style={accent ? { "--accent": accent } : undefined}
    >
      <div ref={cardRef} className="fc-card">
        {/* The only thing taken from the old slider: the flavor bg */}
        <img src={bgSrc} alt="" className="fc-bg" draggable={false} />

        <div className="fc-ghosts" aria-hidden="true">
          <span className="fc-ghost fc-ghost-top">{GHOST_TOP}</span>
          <span className="fc-ghost fc-ghost-bottom">{GHOST_BOTTOM}</span>
        </div>

        <h2 className="fc-name">{flavor.name}</h2>

        <button
          type="button"
          className="fc-buy"
          onClick={() => {
            window.location.hash = `nutrition/${flavor.id}`;
          }}
        >
          {BUY_LABEL}
        </button>

        <div className="fc-circle" />

        <img
          src={getProductImageUrl(flavor.image)}
          alt={`${flavor.name} whey protein`}
          className="fc-product"
          draggable={false}
        />
      </div>
    </div>
  );
};

const FlavorSlider = () => {
  const sliderRef = useRef();
  const isInteractingRef = useRef(false);
  const lastInteractionRef = useRef(0);
  const autoplayDirectionRef = useRef(1);

  const handlePointerDown = () => {
    isInteractingRef.current = true;
  };

  const handlePointerEnd = () => {
    isInteractingRef.current = false;
    lastInteractionRef.current = Date.now();
  };

  useEffect(() => {
    const slider = sliderRef.current;
    const cards = Array.from(slider.querySelector(".flavors").children);

    const intervalId = window.setInterval(() => {
      const sliderRect = slider.getBoundingClientRect();
      const isVisible = sliderRect.bottom > 0 && sliderRect.top < window.innerHeight;

      if (
        window.matchMedia("(min-width: 1025px)").matches ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        document.hidden ||
        !isVisible ||
        isInteractingRef.current ||
        Date.now() - lastInteractionRef.current < 3500
      ) {
        return;
      }

      const sliderCenter = sliderRect.left + slider.clientWidth / 2;
      const currentIndex = cards.reduce((closestIndex, card, index) => {
        const rect = card.getBoundingClientRect();
        const closestRect = cards[closestIndex].getBoundingClientRect();
        return Math.abs(rect.left + rect.width / 2 - sliderCenter) <
          Math.abs(closestRect.left + closestRect.width / 2 - sliderCenter)
          ? index
          : closestIndex;
      }, 0);

      if (currentIndex === cards.length - 1) autoplayDirectionRef.current = -1;
      if (currentIndex === 0) autoplayDirectionRef.current = 1;

      const nextCard = cards[currentIndex + autoplayDirectionRef.current];
      const nextRect = nextCard.getBoundingClientRect();
      const target =
        slider.scrollLeft +
        nextRect.left -
        sliderRect.left -
        (slider.clientWidth - nextRect.width) / 2;

      slider.scrollTo({
        left: Math.max(0, Math.min(target, slider.scrollWidth - slider.clientWidth)),
        behavior: "smooth",
      });
    }, 3500);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1025px)", () => {
      const section = ".flavor-section";

      // Total horizontal travel (same distance the old single tween used)
      const getTotal = () =>
        Math.max(0, sliderRef.current.scrollWidth - window.innerWidth) + 1500;
      // Head start covered while the section is still scrolling into view
      const getPreview = () => Math.min(getTotal(), window.innerWidth * 0.2);
      // Start sliding once ~7rem of the section is visible
      const getStartOffset = () =>
        7 * parseFloat(getComputedStyle(document.documentElement).fontSize);

      // Phase 1: begins as the section enters, ends exactly where the pin starts
      gsap.to(section, {
        x: () => -getPreview(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: () => `top bottom-=${getStartOffset()}`,
          end: "top top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      // Phase 2: pinned, continues from where phase 1 stopped (no jump)
      gsap.fromTo(
        section,
        { x: () => -getPreview() },
        {
          x: () => -getTotal(),
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getTotal() - getPreview()}`,
            scrub: true,
            pin: true,
            invalidateOnRefresh: true,
          },
        }
      );
    });

    const titleTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".flavor-section",
        start: "top top",
        end: "bottom 80%",
        scrub: true,
      },
    });

    titleTl
      .to(".first-text-split", {
        xPercent: -30,
        ease: "power1.inOut",
      })
      .to(
        ".flavor-text-scroll",
        {
          xPercent: -22,
          ease: "power1.inOut",
        },
        "<"
      )
      .to(
        ".second-text-split",
        {
          xPercent: -10,
          ease: "power1.inOut",
        },
        "<"
      );

    return () => mm.revert();
  });

  return (
    <div
      ref={sliderRef}
      className="slider-wrapper"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onPointerLeave={handlePointerEnd}
    >
      <div className="flavors">
        {products.map((product) => (
          <FlavorCard key={product.id} flavor={product} />
        ))}
      </div>
    </div>
  );
};

export default FlavorSlider;