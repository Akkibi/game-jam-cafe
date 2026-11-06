// Fixed virtual world so the game plays the same at any window size.
export const WORLD = { width: 1770, height: 1000 };

export const STEP_MS = 1000 / 120;
export const MAX_FRAME_MS = 50;

export const SPAWN = { x: 45, y: -50 };
export const PLAYER_RADIUS = 25;

// Speeds in world px/s, accelerations in world px/s².
export const MOVE = {
	runSpeedMin: 420,
	runSpeedMax: 620,
	groundAccel: 4000,
	groundDecel: 6000,
	airAccel: 2800,
	airDecel: 1000,
	jumpSpeed: 1600,
	riseGravity: 3200,
	fallGravity: 5200,
	jumpCutMultiplier: 0.5,
	maxFallSpeed: 1700,
	coyoteMs: 100,
	jumpBufferMs: 120,
};

export const SLOW_MOTION_SCALE = 0.5;
