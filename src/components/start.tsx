import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import gsap from 'gsap';
import { useStore } from '../store/globalStore';

const Start = () => {
	const openTimelineRef = useRef<gsap.core.Timeline>(gsap.timeline());
	const oneRef = useRef<HTMLDivElement>(null);
	const twoRef = useRef<HTMLDivElement>(null);
	const threeRef = useRef<HTMLDivElement>(null);
	const isRestarting = useStore((s) => s.isRestarting);

	useGSAP(
		() => {
			const one = oneRef.current;
			const two = twoRef.current;
			const three = threeRef.current;
			if (!one || !two || !three || !isRestarting) return;

			openTimelineRef.current = gsap
				.timeline({
					paused: true,
					onComplete: () => {
						useStore.setState({ isPaused: false });
						// console.log("complete");
					},
				})
				.set(one, { scale: 0.5, opacity: 0 })
				.set(two, { scale: 0.5, opacity: 0 })
				.set(three, { scale: 0.5, opacity: 0 })
				.to(one, {
					scale: 1,
					opacity: 1,
					duration: 0.75,
					delay: 1.25,
					ease: 'expo.out',
				})
				.to(one, {
					scale: 0.5,
					opacity: 0,
					duration: 0.5,
					ease: 'expo.in',
				})
				.to(two, {
					scale: 1,
					opacity: 1,
					duration: 0.75,
					ease: 'expo.out',
				})
				.to(two, {
					scale: 0.5,
					opacity: 0,
					duration: 0.5,
					ease: 'expo.in',
				})
				.to(three, {
					scale: 1,
					opacity: 1,
					duration: 0.75,
					ease: 'expo.out',
				})
				.to(three, {
					scale: 0.5,
					opacity: 0,
					duration: 0.5,
					ease: 'expo.in',
				});
			openTimelineRef.current
				.progress(0)
				.play()
				.then(() => {
					useStore.setState({ isRestarting: false });
				});
		},
		{
			dependencies: [oneRef.current, twoRef.current, threeRef.current, isRestarting],
		},
	);

	return (
		<div className="absolute inset-0 z-50">
			<div
				className="h-[50vh] w-[50vh] bg-[url(/assets/3.svg)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-center bg-no-repeat bg-contain"
				ref={oneRef}
			></div>
			<div
				className="h-[50vh] w-[50vh] bg-[url(/assets/2.svg))] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-center bg-no-repeat bg-contain"
				ref={twoRef}
			></div>
			<div
				className="h-[50vh] w-[50vh] bg-[url(/assets/1.svg))] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-center bg-no-repeat bg-contain"
				ref={threeRef}
			></div>
		</div>
	);
};

export default Start;
