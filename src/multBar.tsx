import { useEffect, useRef } from "react";
import { useStore } from "./store/globalStore";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const MultBar = () => {
  const caffeineLvl = useStore((s) => s.caffeineLvl);
  const setCaffeineLvl = useStore((s) => s.setCaffeineLvl);
  const waveRef = useRef<HTMLDivElement>(null);
  const wave2Ref = useRef<HTMLDivElement>(null);
  const waveing2 = useRef<gsap.core.Timeline>(gsap.timeline({ paused: true }));
  const waveing = useRef<gsap.core.Timeline>(gsap.timeline({ paused: true }));
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const wave = waveRef.current;
      const wave2 = wave2Ref.current;
      if (!wave || !wave2) return;

      waveing.current = gsap.timeline({ paused: false }).fromTo(
        wave,
        {
          backgroundPositionY: "0%",
        },
        {
          backgroundPositionY: "100%",
          repeat: -1,
          repeatDelay: 0.5,
          duration: 10,
          ease: "none",
        },
      );

      waveing2.current = gsap.timeline({ paused: false }).fromTo(
        wave2,
        {
          backgroundPositionY: "100%",
        },
        {
          backgroundPositionY: "0%",
          repeat: -1,
          repeatDelay: 0.5,
          duration: 10,
          ease: "none",
        },
      );
    },
    {
      scope: containerRef,
      dependencies: [containerRef.current, waveRef.current, wave2Ref.current],
    },
  );

  useEffect(() => {
    const timer = setInterval(() => {
      if (caffeineLvl >= 0) {
        setCaffeineLvl(caffeineLvl - 1);
        console.log(caffeineLvl);
      }
    }, 500);
    return () => clearInterval(timer);
  }, [caffeineLvl, setCaffeineLvl]);

  return (
    <>
      <div
        className="absolute top-5 left-1/2 -translate-x-1/2 h-50 w-2xl bg-[url('/assets/multbar.png')] bg-no-repeat bg-contain"
        ref={containerRef}
      >
        {caffeineLvl}
      </div>
      <div className="absolute top-5 left-1/2 -translate-x-1/2 w-[70vh] h-[6vh] bg-[url('/assets/bar/bg.svg')] bg-no-repeat bg-contain overflow-clip">
        <div
          className="absolute inset-0"
          style={{
            mask: "url('/assets/bar/mask.svg') no-repeat",
          }}
        >
          <div
            className="absolute inset-0 right-auto w-20 bg-[#61351a] opacity-50  duration-100 ease-out"
            style={{ width: `${caffeineLvl}%` }}
          >
            <div
              className="absolute top-0 bottom-0 left-full w-[7vh] bg-[url('/assets/bar/coffee.svg')] bg-no-repeat bg-cover"
              ref={wave2Ref}
              style={{
                backgroundPositionX: "100%",
                backgroundSize: "20vh",
              }}
            ></div>
          </div>
          <div
            className="absolute inset-0 right-auto w-20 bg-[#61351a] z-10 duration-500 ease-out"
            style={{ width: `${caffeineLvl}%` }}
          >
            <div
              className="absolute top-0 bottom-0 left-full w-[6vh] bg-[url('/assets/bar/coffee.svg')] bg-no-repeat"
              style={{
                backgroundPositionX: "100%",
                backgroundSize: "20vh",
              }}
              ref={waveRef}
            ></div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('/assets/bar/nb.svg')] bg-no-repeat bg-contain"></div>
      </div>
    </>
  );
};

export default MultBar;
