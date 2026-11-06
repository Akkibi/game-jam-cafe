export const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

export const touchPortraitQuery = window.matchMedia(
	'(pointer: coarse) and (orientation: portrait)',
);
