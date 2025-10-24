import { useEffect, useRef } from "react";
import { useStore } from "../store/globalStore";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SoundManager } from "../sounds/soundManager";

const End = () => {
	const openTimelineRef = useRef<gsap.core.Timeline>(gsap.timeline());
	const elemsRef = useRef<HTMLDivElement>(null);

	const isEndAnimationPlaying = useStore(
		(state) => state.isEndAnimationPlaying
	);

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
				ease: "none",
				opacity: 1,
			})
			.play();
	}, [isEndAnimationPlaying]);

	useEffect(() => {
		if (isEndAnimationPlaying) {
			SoundManager.getInstance().stopAll();
			console.log("isEndAnimationPlaying", isEndAnimationPlaying);
			// useStore.setState({ isRestarting: false });
			// useStore.setState({ isGameOver: true });
		}

		const videoEnd = document.getElementById("videoEnd");

		const onEnded = () => {
			console.log("onended");
			window.parent.postMessage({
				type: "elevator-command",
				action: "backToElevator",
				data: { score: useStore.getState().score, gameIndex: 3 },
			});
		};

		videoEnd?.addEventListener("ended", onEnded);

		return () => {
			videoEnd?.removeEventListener("ended", onEnded);
		};
	}, [isEndAnimationPlaying]);

	return (
		<div className="absolute inset-0 z-[99]" ref={elemsRef}>
			{isEndAnimationPlaying && (
				<div className="absolute inset-0 bg-black">
					<video
						id="videoEnd"
						className="absolute inset-0 w-full h-full"
						src="/video/outro.mp4"
						autoPlay
					/>
				</div>
			)}
		</div>
	);
};

export default End;
