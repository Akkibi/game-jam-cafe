import { useEffect } from 'react';
import { useStore } from '../store/globalStore';
import FlipNumbers from 'react-flip-numbers';
import { isTouchDevice } from '../utils/device';
const Score = () => {
	const score = useStore((s) => s.score);
	const setScore = useStore((s) => s.setScore);
	const cafeineLvl = useStore((s) => s.caffeineLvl);
	const isPaused = useStore((s) => s.isPaused || s.isRotateBlocked);
	useEffect(() => {
		const timer = setInterval(() => {
			if (isPaused) return;
			setScore(score + Math.max(Math.round(cafeineLvl * 0.5), 0));
		}, 100);
		return () => clearInterval(timer);
	}, [score, setScore, cafeineLvl, isPaused]);

	// return <p className="absolute right-5 bottom-5">Score : {score}</p>;
	return (
		<div className="absolute h-fit bottom-0 right-0 p-5 flex flex-row justify-end items-end pointer-coarse:bottom-auto pointer-coarse:top-0 pointer-coarse:pr-[max(1.25rem,env(safe-area-inset-right))]">
			<FlipNumbers
				height={isTouchDevice ? 36 : 70}
				width={isTouchDevice ? 26 : 50}
				color="white"
				numberClassName="custom-shadow"
				background="transparent"
				play
				perspective={1000}
				numbers={score.toString()}
			/>
			<span className="text-xl custom-shadow translate-y-1 text-white">PTS</span>
		</div>
	);
};

export default Score;
