export const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

// Every iOS browser runs on WebKit, including Chrome (CriOS) and Firefox (FxiOS).
export const isWebKit =
	/AppleWebKit/.test(navigator.userAgent) && !/Chrome|Chromium/.test(navigator.userAgent);

export const touchPortraitQuery = window.matchMedia(
	'(pointer: coarse) and (orientation: portrait)',
);

// iOS Safari ignores user-scalable=no, so pinch zoom has to be cancelled here.
export const blockSafariPinchZoom = () => {
	if (!isWebKit || !isTouchDevice) return;
	document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
};
