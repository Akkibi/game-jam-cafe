import { useEffect, useMemo, useRef } from "react";
import { useStore } from "../store/globalStore";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import BarBackground from "../icons/barBackground";

const MultBar = () => {
  const caffeineLvl = useStore((s) => s.caffeineLvl);
  const setCaffeineLvl = useStore((s) => s.setCaffeineLvl);
  const waveRef = useRef<HTMLDivElement>(null);
  const wave2Ref = useRef<HTMLDivElement>(null);
  const waveing2 = useRef<gsap.core.Timeline>(gsap.timeline({ paused: true }));
  const waveing = useRef<gsap.core.Timeline>(gsap.timeline({ paused: true }));
  const containerRef = useRef<HTMLDivElement>(null);

  const currentBackground = useMemo(() => {
    if (caffeineLvl >= 80) {
      return "#d01e17";
    } else if (caffeineLvl >= 60) {
      return "#d67502";
    } else if (caffeineLvl >= 40) {
      return "#e7d332";
    } else if (caffeineLvl >= 20) {
      return "#68ae5d";
    } else {
      return "#66c4f0";
    }
  }, [caffeineLvl]);

  useGSAP(
    () => {
      const wave = waveRef.current;
      const wave2 = wave2Ref.current;
      if (!wave || !wave2) return;

      waveing.current = gsap
        .timeline({ paused: false, smoothChildTiming: true })
        .fromTo(
          wave,
          {
            backgroundPositionY: "0%",
          },
          {
            backgroundPositionY: "50%",
            repeat: -1,
            repeatDelay: 0.5,
            duration: 5,
            ease: "none",
          },
        );

      waveing2.current = gsap
        .timeline({ paused: false, smoothChildTiming: true })
        .fromTo(
          wave2,
          {
            backgroundPositionY: "50%",
          },
          {
            backgroundPositionY: "0%",
            repeat: -1,
            repeatDelay: 0.5,
            duration: 5,
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
        if (caffeineLvl <= 0) {
          waveing.current.pause();
          waveing2.current.pause();
        } else {
          waveing.current.play();
          waveing2.current.play();
          waveing.current.timeScale(caffeineLvl / 100);
          waveing2.current.timeScale(caffeineLvl / 100);
        }
        // console.log(caffeineLvl);
      }
    }, 500);
    return () => clearInterval(timer);
  }, [caffeineLvl, setCaffeineLvl]);

  return (
    <>
      <div className="absolute top-5 left-1/2 -translate-x-1/2 w-[70vh] h-[6vh]">
        <BarBackground
          color={currentBackground}
          className="absolute inset-0 w-full h-full"
        />
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            mask: "url('/assets/bar/mask.svg') no-repeat",
            maskSize: "100% 100%",
          }}
        >
          <div
            className="absolute inset-0 right-auto w-full bg-[#61351a] opacity-50  duration-100 ease-in-out"
            style={{ translate: `${caffeineLvl - 99}% 0%` }}
          >
            <div
              className="absolute top-0 bottom-0 left-full w-[7vh] bg-[url('/assets/bar/coffee.svg')] bg-no-repeat"
              ref={wave2Ref}
              style={{
                backgroundPositionX: "100%",
                backgroundSize: "20vh",
              }}
            ></div>
          </div>
          <div
            className="absolute inset-0 right-auto w-full from-[#A56C44] to-[#61351a] bg-gradient-to-r z-10 duration-500 ease-in-out"
            style={{ translate: `${caffeineLvl - 100}% 0%` }}
          >
            <div
              className="absolute top-0 bottom-0 left-full w-[6vh] bg-[url('/assets/bar/coffee.svg')] bg-no-repeat"
              style={{
                backgroundPositionX: "100%",
                backgroundSize: "20Vh",
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
