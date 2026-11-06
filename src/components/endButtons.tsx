import { useEffect, useMemo, useRef } from 'react';
import { useStore } from '../store/globalStore';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import FlipNumbers from 'react-flip-numbers';
import { GameControls } from '../classes/Controls';
import { isTouchDevice } from '../utils/device';

const tapKey = (key: 'a' | 'i') => {
	const controls = GameControls.getInstance();
	controls.handleInputKeydown({ key, id: 1 });
	controls.handleInputKeyup({ key, id: 1 });
};

const EndButtons = () => {
	const openTimelineRef = useRef<gsap.core.Timeline>(gsap.timeline());
	const closeTimelineRef = useRef<gsap.core.Timeline>(gsap.timeline());
	const scopeRef = useRef<HTMLDivElement>(null);
	const elemsRef = useRef<HTMLDivElement>(null);

	const isGameOver = useStore((state) => state.isGameOver);
	const score = useStore((state) => state.score);

	const restartButton = useStore((state) => state.restartButton);
	const nextButton = useStore((state) => state.nextButton);

	const visualScore = useMemo(() => {
		if (isGameOver) return score;
		return 0;
	}, [score, isGameOver]);

	useGSAP(
		() => {
			const scope = scopeRef.current;
			const elems = elemsRef.current;

			if (!scope || !elems) return;

			gsap.set(elems, {
				opacity: 0,
				y: '100%',
			});

			openTimelineRef.current = gsap
				.timeline({
					paused: true,
					overwrite: true,
				})
				.to(elems, {
					duration: 4,
					ease: 'expo.out',
					opacity: 1,
					delay: 1,
					y: '-50%',
				});

			closeTimelineRef.current = gsap
				.timeline({
					paused: true,
					overwrite: true,
				})
				.to(elems, {
					duration: 1,
					ease: 'back.in',
					opacity: 0,
					y: '100%',
				});
		},
		{
			scope: scopeRef,
			dependencies: [scopeRef.current, elemsRef.current],
		},
	);

	useEffect(() => {
		if (isGameOver) {
			closeTimelineRef.current?.pause();
			openTimelineRef.current?.play();
		} else {
			openTimelineRef.current?.pause();
			closeTimelineRef.current?.play();
		}
	}, [isGameOver]);

	return (
		<div className="absolute inset-0 z-50" ref={scopeRef}>
			<div
				className="w-fit flex flex-col gap-20 pointer-coarse:gap-3 top-1/2 left-1/2 -translate-x-1/2 absolute"
				ref={elemsRef}
			>
				<div className="flex gap-2 w-full justify-center items-center h-fit">
					<FlipNumbers
						height={isTouchDevice ? 64 : 140}
						width={isTouchDevice ? 46 : 100}
						color="white"
						numberClassName="custom-shadow"
						background="transparent"
						play
						perspective={1500}
						numbers={visualScore.toString()}
						duration={6}
						delay={1}
					/>
					<p className="absolute left-full">POINTS</p>
				</div>
				<button
					aria-label="Restart"
					className="w-[50vh] h-[20vh] relative !p-0 !border-0 !bg-transparent"
					disabled={!isGameOver}
					onClick={() => tapKey('a')}
					type="button"
				>
					{restartButton ? (
						<div className="absolute inset-0 bg-[url(/assets/end/restart-on.svg)] bg-no-repeat bg-center bg-contain"></div>
					) : (
						<div className="absolute inset-0 bg-[url(/assets/end/restart.svg)] bg-no-repeat bg-center bg-contain"></div>
					)}
				</button>
				<button
					aria-label="Continue"
					className="w-[50vh] h-[10vh] relative !p-0 !border-0 !bg-transparent"
					disabled={!isGameOver}
					onClick={() => tapKey('i')}
					type="button"
				>
					{nextButton ? (
						<div className="absolute inset-0 bg-[url(/assets/end/next-on.svg)] bg-no-repeat bg-center bg-contain"></div>
					) : (
						<div className="absolute inset-0 bg-[url(/assets/end/next.svg)] bg-no-repeat bg-center bg-contain"></div>
					)}
				</button>
			</div>
		</div>
	);
};

export default EndButtons;
