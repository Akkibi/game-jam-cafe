import { useEffect } from "react";
import { useStore } from "./store/globalStore";

const MultBar = () => {
  const caffeineLvl = useStore((s) => s.caffeineLvl);
  const setCaffeineLvl = useStore((s) => s.setCaffeineLvl);

  useEffect(() => {
    const timer = setInterval(() => {
      if (caffeineLvl <= 0) {
        setCaffeineLvl(caffeineLvl + 80);
      } else {
        setCaffeineLvl(caffeineLvl - 5);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [caffeineLvl, setCaffeineLvl]);

  return (
    <div className="absolute top-5 left-1/2 -translate-x-1/2 w-lg h-10 bg-amber-950 rounded-md overflow-clip">
      <div
        className="absolute inset-0 right-auto w-20 bg-white"
        style={{ width: `${caffeineLvl}%` }}
      ></div>
      <div
        className="absolute inset-0 right-auto w-20 bg-amber-900 z-10 duration-200"
        style={{ width: `${caffeineLvl}%` }}
      ></div>
      <div className="absolute inset-0 border-4 border-black/50 rounded-md z-20"></div>
    </div>
  );
};

export default MultBar;
