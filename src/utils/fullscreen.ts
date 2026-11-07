import { isTouchDevice } from './device';

type LockableOrientation = ScreenOrientation & {
	lock?: (orientation: 'landscape') => Promise<void>;
};

const enterFullscreen = async () => {
	try {
		await document.documentElement.requestFullscreen?.({ navigationUI: 'hide' });
		await (screen.orientation as LockableOrientation | undefined)?.lock?.('landscape');
	} catch {
		// Unsupported or refused: the game plays the same without it.
	}
};

export const enableFullscreenOnFirstTap = () => {
	if (!isTouchDevice) return;
	window.addEventListener('pointerup', enterFullscreen, { once: true });
};
