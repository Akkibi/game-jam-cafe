import { useEffect, useRef } from 'react';
import { useStore } from '../store/globalStore';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SoundManager } from '../sounds/soundManager';
import { SceneManager } from '../three/scene';

const finishOutro = () => {
	useStore.setState({ score: 0, isEndAnimationPlaying: false });
	const scene = SceneManager.getInstance(null);
	scene.restart();
	scene.playSoundtrack();
};

const End = () => {
	const openTimelineRef = useRef<gsap.core.Timeline>(gsap.timeline());
	const elemsRef = useRef<HTMLDivElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);

	const isEndAnimationPlaying = useStore((state) => state.isEndAnimationPlaying);

	useGSAP(() => {
		const elems = elemsRef.current;

		if (!elems || !isEndAnimationPlaying) return;

		gsap.set(elems, {
			opacity: 0,
		});

		openTimelineRef.current = gsap
			.timeline({
				paused: true,
			})
			.to(elems, {
				duration: 1,
				ease: 'none',
				opacity: 1,
			})
			.play();
	}, [isEndAnimationPlaying]);

	useEffect(() => {
		// Safari only allows sound when play() runs inside the tap, so this cannot wait for a render.
		return useStore.subscribe((state, previous) => {
			if (!state.isEndAnimationPlaying || previous.isEndAnimationPlaying) return;
			SoundManager.getInstance().stopAll();
			const video = videoRef.current;
			if (!video) return;
			video.muted = false;
			video.currentTime = 0;
			video
				.play()
				.catch(() => {
					video.muted = true;
					return video.play();
				})
				.catch(finishOutro);
		});
	}, []);

	return (
		<div className="pointer-events-none absolute inset-0 z-[99]" ref={elemsRef}>
			<div
				className={`absolute inset-0 bg-black ${isEndAnimationPlaying ? '' : 'invisible'}`}
			>
				<video
					className="absolute inset-0 w-full h-full"
					onEnded={finishOutro}
					onError={finishOutro}
					playsInline
					preload="none"
					ref={videoRef}
					src="/video/outro.mp4"
				/>
			</div>
		</div>
	);
};

export default End;
