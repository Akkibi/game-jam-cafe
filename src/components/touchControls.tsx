import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import { GameControls } from '../classes/Controls';
import { useStore } from '../store/globalStore';
import { isTouchDevice } from '../utils/device';

const STICK_TRAVEL_PX = 44;
const DEAD_ZONE = 0.12;
const PRESS_ID = 1;

const Joystick = () => {
	const knobRef = useRef<HTMLDivElement>(null);
	const pointerId = useRef<number | null>(null);
	const originX = useRef(0);

	const setStick = useCallback((dx: number) => {
		const travel = Math.max(-STICK_TRAVEL_PX, Math.min(STICK_TRAVEL_PX, dx));
		if (knobRef.current) knobRef.current.style.transform = `translate3d(${travel}px, 0, 0)`;
		const value = travel / STICK_TRAVEL_PX;
		GameControls.getInstance().handleInputGamepad({
			id: PRESS_ID,
			position: { x: Math.abs(value) < DEAD_ZONE ? 0 : value, y: 0 },
		});
	}, []);

	const release = useCallback(() => {
		pointerId.current = null;
		setStick(0);
	}, [setStick]);

	useEffect(() => {
		window.addEventListener('blur', release);
		return () => {
			window.removeEventListener('blur', release);
			release();
		};
	}, [release]);

	const onDown = (e: PointerEvent<HTMLDivElement>) => {
		if (pointerId.current !== null) return;
		pointerId.current = e.pointerId;
		originX.current = e.clientX;
		e.currentTarget.setPointerCapture(e.pointerId);
	};

	const onMove = (e: PointerEvent<HTMLDivElement>) => {
		if (e.pointerId === pointerId.current) setStick(e.clientX - originX.current);
	};

	const onEnd = (e: PointerEvent<HTMLDivElement>) => {
		if (e.pointerId === pointerId.current) release();
	};

	return (
		<div
			aria-label="Move left or right"
			className="absolute bottom-0 left-0 h-[70vh] w-[45vw] touch-none select-none"
			onContextMenu={(e) => e.preventDefault()}
			onLostPointerCapture={onEnd}
			onPointerCancel={onEnd}
			onPointerDown={onDown}
			onPointerMove={onMove}
			onPointerUp={onEnd}
			role="slider"
			aria-valuemin={-1}
			aria-valuemax={1}
			aria-valuenow={0}
			tabIndex={-1}
		>
			<div className="pointer-events-none absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-[max(1.5rem,env(safe-area-inset-left))] flex h-20 w-44 items-center justify-center rounded-full border-2 border-[#A56C44] bg-[#61351a]/60">
				<span className="absolute left-3 text-2xl text-white/70">‹</span>
				<span className="absolute right-3 text-2xl text-white/70">›</span>
				<div
					className="h-14 w-14 rounded-full border-2 border-white/70 bg-[#A56C44] will-change-transform"
					ref={knobRef}
				/>
			</div>
		</div>
	);
};

const JumpButton = () => {
	const [isPressed, setIsPressed] = useState(false);

	const release = useCallback(() => {
		setIsPressed(false);
		GameControls.getInstance().handleInputKeyup({ key: 'i', id: PRESS_ID });
	}, []);

	useEffect(() => {
		window.addEventListener('blur', release);
		return () => {
			window.removeEventListener('blur', release);
			GameControls.getInstance().handleInputKeyup({ key: 'i', id: PRESS_ID });
		};
	}, [release]);

	const onDown = (e: PointerEvent<HTMLButtonElement>) => {
		e.currentTarget.setPointerCapture(e.pointerId);
		setIsPressed(true);
		GameControls.getInstance().handleInputKeydown({ key: 'i', id: PRESS_ID });
	};

	return (
		<button
			aria-label="Jump"
			className={`absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.5rem,env(safe-area-inset-right))] flex h-24 w-24 touch-none select-none items-center justify-center !rounded-full !border-2 !border-[#A56C44] !p-0 text-4xl text-white transition-transform duration-75 ${
				isPressed ? 'scale-90 !bg-[#A56C44]' : '!bg-[#61351a]/60'
			}`}
			onContextMenu={(e) => e.preventDefault()}
			onLostPointerCapture={release}
			onPointerCancel={release}
			onPointerDown={onDown}
			onPointerUp={release}
			type="button"
		>
			▲
		</button>
	);
};

const TouchControls = () => {
	const isHidden = useStore((s) => s.isRotateBlocked || s.isGameOver || s.isEndAnimationPlaying);
	if (!isTouchDevice || isHidden) return null;

	return (
		<div className="pointer-events-none absolute inset-0 z-[100] [&>*]:pointer-events-auto">
			<Joystick />
			<JumpButton />
		</div>
	);
};

export default TouchControls;
