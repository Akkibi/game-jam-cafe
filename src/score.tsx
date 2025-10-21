import { useEffect } from "react";
import { useStore } from "./store/globalStore";
import FlipNumbers from "react-flip-numbers";
const Score = () => {
  const score = useStore((s) => s.score);
  const setScore = useStore((s) => s.setScore);
  const cafeineLvl = useStore((s) => s.caffeineLvl);
  useEffect(() => {
    const timer = setInterval(() => {
      // console.log(cafeineLvl * 100);
      setScore(score + 1 * Math.max(Math.round(cafeineLvl * 0.12), 0));
    }, 100);
    return () => clearInterval(timer);
  }, [score, setScore, cafeineLvl]);

  // return <p className="absolute right-5 bottom-5">Score : {score}</p>;
  return (
    <div className="absolute h-fit bottom-0 right-0 p-5 flex flex-row justify-end items-end">
      <FlipNumbers
        height={40}
        width={30}
        color="white"
        background="transparent"
        play
        perspective={500}
        numbers={score.toString()}
      />
      <span className="text-base">PTS</span>
    </div>
  );
};

export default Score;
