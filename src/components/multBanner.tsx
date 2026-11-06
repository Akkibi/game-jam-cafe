import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/globalStore';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const MultBanner = ({ caffeineLvl }: { caffeineLvl: number }) => {
	const openTimelineRef = useRef<gsap.core.Timeline>(gsap.timeline());
	const bgRef = useRef<HTMLDivElement>(null);
	const nbRef = useRef<HTMLDivElement>(null);
	const [oldCaffeineLvl, setOldCaffeineLvl] = useState<number>(50);

	useGSAP(() => {
		const bg = bgRef.current;
		const nb = nbRef.current;

		if (!bg || !nb) return;

		gsap.set(bg, { opacity: 0, x: '-200%' });
		gsap.set(nb, {
			opacity: 0,
			x: '100%',
		});

		openTimelineRef.current = gsap
			.timeline({
				paused: true,
				progress: 0,
				onStart: () => useStore.setState({ isSlowed: true }),
				onComplete: () => useStore.setState({ isSlowed: false }),
			})
			.fromTo(
				bg,
				{
					x: '-200%',
					opacity: 0,
				},
				{
					duration: 0.5,
					ease: 'expo.out',
					x: '-50%',
					opacity: 1,
				},
			)
			.fromTo(
				nb,
				{
					x: '100%',
					opacity: 0,
				},
				{
					duration: 0.5,
					ease: 'expo.out',
					x: '-50%',
					opacity: 1,
				},
				'<',
			)
			.fromTo(
				bg,
				{
					x: '-50%',
					opacity: 1,
				},
				{
					duration: 0.5,
					ease: 'expo.in',
					x: '100%',
					opacity: 0,
				},
			)
			.fromTo(
				nb,
				{
					x: '-50%',
					opacity: 1,
				},
				{
					duration: 0.5,
					ease: 'expo.in',
					x: '-200%',
					opacity: 0,
				},
				'<',
			);
		openTimelineRef.current.progress(1);
	}, [nbRef.current, bgRef.current]);

	useEffect(() => {
		if (
			caffeineLvl !== oldCaffeineLvl &&
			(caffeineLvl > oldCaffeineLvl + 20 || caffeineLvl < oldCaffeineLvl - 20)
		) {
			setOldCaffeineLvl(caffeineLvl);
			openTimelineRef.current.progress(0).play();
		}
	}, [caffeineLvl, setOldCaffeineLvl, oldCaffeineLvl]);

	return (
		<div className="absolute inset-0 w-full h-full">
			<div className="absolute bottom-[20vh] w-full">
				<div
					className="absolute inset-0 left-1/2 top-1/2 -translate-y-1/2 w-[275vh] h-[15vh]"
					ref={bgRef}
				>
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
				<div
					className="absolute inset-0 left-1/2 top-1/2 -translate-y-1/2 w-[275vh] h-[10vh]"
					ref={nbRef}
				>
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
		</div>
	);
};

export default MultBanner;
