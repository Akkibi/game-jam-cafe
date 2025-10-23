import { useGSAP } from "@gsap/react";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const Start = () => {
  const openTimelineRef = useRef<gsap.core.Timeline>(gsap.timeline());
  const closeAnimation = useRef<gsap.core.Timeline>(gsap.timeline());
  const oneRef = useRef<HTMLDivElement>(null);
  const twoRef = useRef<HTMLDivElement>(null);
  const threeRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   // set isOpen false after 10 seconds
  //   setTimeout(() => {
  //     setIsOpen(false);
  //   }, 10000);
  // }, []);

  useGSAP(
    () => {
      const one = oneRef.current;
      const two = twoRef.current;
      const three = threeRef.current;
      if (!one || !two || !three) return;

      gsap.set(one, { scale: 0.5, opacity: 0 });
      gsap.set(two, { scale: 0.5, opacity: 0 });
      gsap.set(three, { scale: 0.5, opacity: 0 });

      openTimelineRef.current = gsap
        .timeline({ paused: true, delay: 1 })
        .fromTo(
          one,
          {
            scale: 0.5,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.75,
            ease: "expo.out",
          },
          "0",
        )
        .to(
          one,
          {
            scale: 0.5,
            opacity: 0,
            duration: 0.25,
            ease: "expo.in",
          },
          "<",
        )
        .fromTo(
          two,
          {
            scale: 0.5,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.75,
            ease: "expo.out",
          },
          ">",
        )
        .to(
          two,
          {
            scale: 0.5,
            opacity: 0,
            duration: 0.25,
            ease: "expo.in",
          },
          "<",
        )
        .fromTo(
          three,
          {
            scale: 0.5,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.75,
            ease: "expo.out",
          },
          ">",
        )
        .to(
          three,
          {
            scale: 0.5,
            opacity: 0,
            duration: 0.25,
            ease: "expo.in",
          },
          "<",
        );
      openTimelineRef.current.progress(0).play();
    },
    {
      dependencies: [oneRef.current, twoRef.current, threeRef.current],
    },
  );

  return (
    <div className="absolute inset-0 z-50">
      <div
        className="h-[50vh] w-[50vh] bg-[url(/assets/mult/x2/bg2-blue.svg)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        ref={oneRef}
      ></div>
      <div
        className="h-[50vh] w-[50vh] bg-[url(/assets/mult/x4/bg2-green.svg))] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        ref={twoRef}
      ></div>
      <div
        className="h-[50vh] w-[50vh] bg-[url(/assets/mult/x6/bg2-yellow.svg))] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        ref={threeRef}
      ></div>
    </div>
  );
};

export default Start;
