import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const Controls = () => {
  const [isOpen, setIsOpen] = useState(true);
  const popupRef = useRef<HTMLDivElement>(null);
  const openTimelineRef = useRef<gsap.core.Timeline>(gsap.timeline());
  const closeAnimation = useRef<gsap.core.Timeline>(gsap.timeline());

  useEffect(() => {
    // set isOpen false after 10 seconds
    setTimeout(() => {
      setIsOpen(false);
    }, 10000);
  }, []);

  useGSAP(
    () => {
      const popup = popupRef.current;
      if (!popup) return;

      gsap.set(popup, { y: "100%", opacity: 0 });

      closeAnimation.current = gsap.timeline({ paused: true }).fromTo(
        popup,
        {
          y: "0%",
          opacity: 1,
        },
        {
          y: "100",
          opacity: 0,
          duration: 0.5,
          ease: "power1.inOut",
        },
      );
      openTimelineRef.current = gsap.timeline({ paused: true }).fromTo(
        popup,
        {
          y: "100%",
          opacity: 0,
        },
        {
          y: "0",
          opacity: 1,
          duration: 0.5,
          ease: "power1.inOut",
        },
      );
      openTimelineRef.current.progress(0);
    },
    {
      dependencies: [popupRef.current],
    },
  );

  useEffect(() => {
    if (isOpen) {
      openTimelineRef.current?.play(0);
    } else {
      closeAnimation.current?.play(0);
    }
  }, [isOpen]);
  return (
    <div
      className="absolute bottom-0 left-5 h-[40vh] w-[40vh] bg-[url(/controles.svg)] z-50 bg-no-repeat"
      ref={popupRef}
    ></div>
  );
};

export default Controls;
