import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FlavorTitle from "../components/FlavorTitle";
import FlavorSlider from "../components/FlavorSlider";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const BASE = import.meta.env.BASE_URL;

// Background image that slides in from the left.
// Expected at public/images/gymbro1.png
const BG_IMAGE = `${BASE}images/gymbro1.png`;

const FlavorSection = () => {
  const sectionRef = useRef(null);

  // The image slides in from the left as the section enters the viewport
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const scrollTrigger = {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        };

        gsap.from(".flavor-bg-left", {
          xPercent: -100,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger,
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="flavor-section">
      {/* Backdrop: image + translucent dimmer + bottom-to-top black gradient */}
      <div className="flavor-bg" aria-hidden="true">
        <img src={BG_IMAGE} alt="" className="flavor-bg-img flavor-bg-left" />
        <div className="flavor-bg-dim" />
        <div className="flavor-bg-gradient" />
      </div>

      <div className="h-full flex lg:flex-row flex-col items-center relative z-10">
        <div className="lg:w-[57%] flex-none h-72 md:h-80 lg:h-full md:mt-20 xl:mt-0">
          <FlavorTitle />
        </div>
        <div className="h-full w-full min-w-0 lg:w-auto">
          <FlavorSlider />
        </div>
      </div>
    </section>
  );
};

export default FlavorSection;