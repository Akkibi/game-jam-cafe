// Sound IDs - use these constants throughout your game
export const SOUNDS = {
	// Machine sounds
	COFFEE: "coffee",
	GRINDER: "grinder",
	STEAM: "steam",

	// Voice - Mathieu
	VOICE_20PTS: "20kpts",
	VOICE_30PTS: "30kpts",
	VOICE_DOULEUR_1: "douleur1",
	VOICE_DOULEUR_2: "douleur2",
	VOICE_DOULEUR_3: "douleur3",
	VOICE_DOULEUR_4: "douleur4",
	VOICE_DOULEUR_5: "douleur5",
	VOICE_DOULEUR_6: "douleur6",
	VOICE_DOULEUR_7: "douleur7",
	VOICE_ECHEC_1: "echec1_2",
	VOICE_ECHEC_2: "echec2_2",
	VOICE_ECHEC_3: "echec2",
	VOICE_ECHEC_4: "echec3",
	VOICE_ECHEC_5: "echec4",
	VOICE_FIN_VALIDE: "fin_valide",
	VOICE_INTRO_1: "intro1",
	VOICE_INTRO_2: "intro2",
	VOICE_MANGER_1: "manger1",
	VOICE_MANGER_2: "manger2",
	VOICE_MANGER_3: "manger3",
	VOICE_MANGER_4: "manger4",
	VOICE_SAUT_1: "saut1",
	VOICE_SAUT_2: "saut2",
	VOICE_SAUT_3: "saut3",

	// Multipliers
	X2: "x2",
	X4: "x4",
	X6: "x6",
	X8: "x8",
	X10_1: "x10_1",
	X10_2: "x10_2",

	// Soundtrack
	SOUNDTRACK: "soundtrack",
} as const;

// Sound configurations for initialization
export const soundConfigs = [
	// === MACHINE SOUNDS ===
	{
		id: SOUNDS.COFFEE,
		src: ["/sounds/machine/coffee/coffee.wav"],
		volume: 0.6,
		pool: 1,
	},
	{
		id: SOUNDS.GRINDER,
		src: ["/sounds/machine/grinder/grinder.mp3"],
		volume: 0.3,
		pool: 1,
	},
	{
		id: SOUNDS.STEAM,
		src: ["/sounds/machine/steam/steam.mp3"],
		volume: 0.2,
		pool: 2,
	},

	// === VOICE - MATHIEU (Points) ===
	{
		id: SOUNDS.VOICE_20PTS,
		src: ["/sounds/voice_mathieu/20Kpts/20kpts.mp3"],
		volume: 0.8,
		pool: 1,
	},
	{
		id: SOUNDS.VOICE_30PTS,
		src: ["/sounds/voice_mathieu/30Kpts/30Kpts.mp3"],
		volume: 0.8,
		pool: 1,
	},

	// === VOICE - MATHIEU (Douleurs - Pain sounds) ===
	{
		id: SOUNDS.VOICE_DOULEUR_1,
		src: ["/sounds/voice_mathieu/douleurs/douleur1.mp3"],
		volume: 0.7,
		pool: 1,
	},
	{
		id: SOUNDS.VOICE_DOULEUR_2,
		src: ["/sounds/voice_mathieu/douleurs/douleur2.mp3"],
		volume: 0.7,
		pool: 1,
	},
	{
		id: SOUNDS.VOICE_DOULEUR_3,
		src: ["/sounds/voice_mathieu/douleurs/douleur3.mp3"],
		volume: 0.7,
		pool: 1,
	},
	{
		id: SOUNDS.VOICE_DOULEUR_4,
		src: ["/sounds/voice_mathieu/douleurs/douleur4.mp3"],
		volume: 0.7,
		pool: 1,
	},
	{
		id: SOUNDS.VOICE_DOULEUR_5,
		src: ["/sounds/voice_mathieu/douleurs/douleur5.mp3"],
		volume: 0.7,
		pool: 1,
	},
	{
		id: SOUNDS.VOICE_DOULEUR_6,
		src: ["/sounds/voice_mathieu/douleurs/douleur6.mp3"],
		volume: 0.7,
		pool: 1,
	},
	{
		id: SOUNDS.VOICE_DOULEUR_7,
		src: ["/sounds/voice_mathieu/douleurs/douleur7.mp3"],
		volume: 0.7,
		pool: 1,
	},

	// === VOICE - MATHIEU (Echecs - Failure sounds) ===
	{
		id: SOUNDS.VOICE_ECHEC_1,
		src: ["/sounds/voice_mathieu/echecs/echec1_2.mp3"],
		volume: 0.75,
		pool: 1,
	},
	{
		id: SOUNDS.VOICE_ECHEC_2,
		src: ["/sounds/voice_mathieu/echecs/echec2_2.mp3"],
		volume: 0.75,
		pool: 1,
	},
	{
		id: SOUNDS.VOICE_ECHEC_3,
		src: ["/sounds/voice_mathieu/echecs/echec2.mp3"],
		volume: 0.75,
		pool: 1,
	},
	{
		id: SOUNDS.VOICE_ECHEC_4,
		src: ["/sounds/voice_mathieu/echecs/echec3.mp3"],
		volume: 0.75,
		pool: 1,
	},
	{
		id: SOUNDS.VOICE_ECHEC_5,
		src: ["/sounds/voice_mathieu/echecs/echec4.mp3"],
		volume: 0.75,
		pool: 1,
	},

	// === VOICE - MATHIEU (Fin validé - Success) ===
	{
		id: SOUNDS.VOICE_FIN_VALIDE,
		src: ["/sounds/voice_mathieu/fin_validé/fin_validé.mp3"],
		volume: 0.8,
		pool: 1,
	},

	// === VOICE - MATHIEU (Intro) ===
	{
		id: SOUNDS.VOICE_INTRO_1,
		src: ["/sounds/voice_mathieu/intro/intro1 .mp3"],
		volume: 0.8,
		pool: 1,
	},
	{
		id: SOUNDS.VOICE_INTRO_2,
		src: ["/sounds/voice_mathieu/intro/intro2.mp3"],
		volume: 0.8,
		pool: 1,
	},

	// === VOICE - MATHIEU (Manger - Eating sounds) ===
	{
		id: SOUNDS.VOICE_MANGER_1,
		src: ["/sounds/voice_mathieu/manger/manger1.mp3"],
		volume: 0.7,
		pool: 1,
	},
	{
		id: SOUNDS.VOICE_MANGER_2,
		src: ["/sounds/voice_mathieu/manger/manger2.mp3"],
		volume: 0.7,
		pool: 1,
	},
	{
		id: SOUNDS.VOICE_MANGER_3,
		src: ["/sounds/voice_mathieu/manger/manger3.mp3"],
		volume: 0.7,
		pool: 1,
	},
	{
		id: SOUNDS.VOICE_MANGER_4,
		src: ["/sounds/voice_mathieu/manger/manger4.mp3"],
		volume: 0.7,
		pool: 1,
	},

	// === VOICE - MATHIEU (Sauts - Jump sounds) ===
	{
		id: SOUNDS.VOICE_SAUT_1,
		src: ["/sounds/voice_mathieu/sauts/saut1.mp3"],
		volume: 0.7,
		pool: 1,
	},
	{
		id: SOUNDS.VOICE_SAUT_2,
		src: ["/sounds/voice_mathieu/sauts/saut2.mp3"],
		volume: 0.7,
		pool: 1,
	},
	{
		id: SOUNDS.VOICE_SAUT_3,
		src: ["/sounds/voice_mathieu/sauts/saut3.mp3"],
		volume: 0.7,
		pool: 1,
	},

	// === MULTIPLIERS ===
	{
		id: SOUNDS.X2,
		src: ["/sounds/voice_mathieu/x2/x2.mp3"],
		volume: 0.8,
		pool: 1,
	},
	{
		id: SOUNDS.X4,
		src: ["/sounds/voice_mathieu/x4/x4.mp3"],
		volume: 0.8,
		pool: 1,
	},
	{
		id: SOUNDS.X6,
		src: ["/sounds/voice_mathieu/x6/x6.mp3"],
		volume: 0.8,
		pool: 1,
	},
	{
		id: SOUNDS.X8,
		src: ["/sounds/voice_mathieu/x8/x8.mp3"],
		volume: 0.8,
		pool: 1,
	},
	{
		id: SOUNDS.X10_1,
		src: ["/sounds/voice_mathieu/x10/x10_1.mp3"],
		volume: 0.8,
		pool: 1,
	},
	{
		id: SOUNDS.X10_2,
		src: ["/sounds/voice_mathieu/x10/x10_2.mp3"],
		volume: 0.8,
		pool: 1,
	},

	// === SOUNDTRACK ===
	{
		id: SOUNDS.SOUNDTRACK,
		src: ["/sounds/soundtrack.mp3"],
		volume: 0.1,
		loop: true,
		pool: 1,
	},
];

// === HELPER FUNCTIONS FOR RANDOM SOUND SELECTION ===

/**
 * Get a random douleur (pain) sound, with a 50% chance of no sound.
 */
export function getRandomDouleurSound(): string {
	if (Math.random() < 0.5) {
		return "";
	}
	const douleurs = [
		SOUNDS.VOICE_DOULEUR_1,
		SOUNDS.VOICE_DOULEUR_2,
		SOUNDS.VOICE_DOULEUR_3,
		SOUNDS.VOICE_DOULEUR_4,
		SOUNDS.VOICE_DOULEUR_5,
		SOUNDS.VOICE_DOULEUR_6,
		SOUNDS.VOICE_DOULEUR_7,
	];
	return douleurs[Math.floor(Math.random() * douleurs.length)];
}

/**
 * Get a random echec (failure) sound, with a 50% chance of no sound.
 */
export function getRandomEchecSound(): string {
	if (Math.random() < 0.5) {
		return "";
	}
	const echecs = [
		SOUNDS.VOICE_ECHEC_1,
		SOUNDS.VOICE_ECHEC_2,
		SOUNDS.VOICE_ECHEC_3,
		SOUNDS.VOICE_ECHEC_4,
		SOUNDS.VOICE_ECHEC_5,
	];
	return echecs[Math.floor(Math.random() * echecs.length)];
}

/**
 * Get a random saut (jump) sound, with a 50% chance of no sound.
 */
export function getRandomSautSound(): string {
	if (Math.random() < 0.5) {
		return "";
	}
	const sauts = [
		SOUNDS.VOICE_SAUT_1,
		SOUNDS.VOICE_SAUT_2,
		SOUNDS.VOICE_SAUT_3,
	];
	return sauts[Math.floor(Math.random() * sauts.length)];
}

/**
 * Get a random manger (eating) sound, with a 50% chance of no sound.
 */
export function getRandomMangerSound(): string {
	if (Math.random() < 0.5) {
		return "";
	}
	const manger = [
		SOUNDS.VOICE_MANGER_1,
		SOUNDS.VOICE_MANGER_2,
		SOUNDS.VOICE_MANGER_3,
		SOUNDS.VOICE_MANGER_4,
	];
	return manger[Math.floor(Math.random() * manger.length)];
}

/**
 * Get a random intro sound
 */
export function getRandomIntroSound(): string {
	const intros = [SOUNDS.VOICE_INTRO_1, SOUNDS.VOICE_INTRO_2];
	return intros[Math.floor(Math.random() * intros.length)];
}

/**
 * Get multiplier sound based on value
 */
export function getMultiplierSound(multiplier: number): string | null {
	switch (multiplier) {
		case 2:
			return SOUNDS.X2;
		case 4:
			return SOUNDS.X4;
		case 6:
			return SOUNDS.X6;
		case 8:
			return SOUNDS.X8;
		case 10:
			return Math.random() < 0.5 ? SOUNDS.X10_1 : SOUNDS.X10_2;
		default:
			return null;
	}
}
