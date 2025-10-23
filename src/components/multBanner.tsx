import { useEffect, useRef } from "react";

const MultBanner = ({ caffeineLvl }: { caffeineLvl: number }) => {
  // const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="absolute inset-0 w-full h-full">
      <div className="absolute inset-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[275vh] h-[50vh] opacity-50">
        {caffeineLvl >= 80 ? (
          <div className="absolute inset-0 w-full h-full bg-[url('/assets/mult/x10/bg-red.svg')] bg-no-repeat bg-center"></div>
        ) : caffeineLvl >= 60 ? (
          <div className="absolute inset-0 w-full h-full bg-[url('/assets/mult/x8/bg-orange.svg')] bg-no-repeat bg-center"></div>
        ) : caffeineLvl >= 40 ? (
          <div className="absolute inset-0 w-full h-full bg-[url('/assets/mult/x6/bg-yellow.svg')] bg-no-repeat bg-center"></div>
        ) : caffeineLvl >= 20 ? (
          <div className="absolute inset-0 w-full h-full bg-[url('/assets/mult/x4/bg-green.svg')] bg-no-repeat bg-center"></div>
        ) : (
          <div className="absolute inset-0 w-full h-full bg-[url('/assets/mult/x2/bg-blue.svg')] bg-no-repeat bg-center"></div>
        )}
      </div>
      <div className="absolute inset-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[275vh] h-[30vh]">
        {caffeineLvl >= 80 ? (
          <div className="absolute inset-0 w-full h-full bg-[url('/assets/mult/x10/bg2-red.svg')] bg-no-repeat bg-center"></div>
        ) : caffeineLvl >= 60 ? (
          <div className="absolute inset-0 w-full h-full bg-[url('/assets/mult/x8/bg2-orange.svg')] bg-no-repeat bg-center"></div>
        ) : caffeineLvl >= 40 ? (
          <div className="absolute inset-0 w-full h-full bg-[url('/assets/mult/x6/bg2-yellow.svg')] bg-no-repeat bg-center"></div>
        ) : caffeineLvl >= 20 ? (
          <div className="absolute inset-0 w-full h-full bg-[url('/assets/mult/x4/bg2-green.svg')] bg-no-repeat bg-center"></div>
        ) : (
          <div className="absolute inset-0 w-full h-full bg-[url('/assets/mult/x2/bg2-blue.svg')] bg-no-repeat bg-center"></div>
        )}
      </div>
    </div>
  );
};

export default MultBanner;
