import { Howl, Howler } from "howler";

interface SoundConfig {
	id: string;
	src: string[];
	volume?: number;
	loop?: boolean;
	sprite?: { [key: string]: [number, number] };
	pool?: number;
}

interface ActiveSound {
	id: string;
	howl: Howl;
	soundId: number | null;
}

export class SoundManager {
	private static _instance: SoundManager;
	private sounds: Map<string, Howl> = new Map();
	private activeSounds: ActiveSound[] = [];
	private masterVolume: number = 1.0;
	private isMuted: boolean = false;
	private isInitialized: boolean = false;

	private constructor() {
		// Set up global Howler settings
		Howler.autoUnlock = true;
	}

	static getInstance(): SoundManager {
		if (!this._instance) {
			this._instance = new SoundManager();
		}
		return this._instance;
	}

	/**
	 * Initialize the sound manager with sound configurations
	 */
	public init(soundConfigs: SoundConfig[]): void {
		if (this.isInitialized) {
			console.warn("SoundManager already initialized");
			return;
		}

		soundConfigs.forEach((config) => {
			this.loadSound(config);
		});

		this.isInitialized = true;
	}

	/**
	 * Load a single sound into the manager
	 */
	private loadSound(config: SoundConfig): void {
		if (this.sounds.has(config.id)) {
			console.warn(`Sound with id "${config.id}" already loaded`);
			return;
		}

		const howl = new Howl({
			src: config.src,
			volume: config.volume ?? 1.0,
			loop: config.loop ?? false,
			sprite: config.sprite,
			pool: config.pool ?? 5,
			preload: true,
			onloaderror: (id, error) => {
				console.error(`Failed to load sound "${config.id}":`, error);
			},
			onload: () => {
				// console.log(`Sound "${config.id}" loaded successfully`);
			},
		});

		this.sounds.set(config.id, howl);
	}

	/**
	 * Play a sound by its id
	 */
	public play(
		soundId: string,
		options?: {
			volume?: number;
			loop?: boolean;
			rate?: number;
			sprite?: string;
			onend?: () => void;
		}
	): number | null {
		const howl = this.sounds.get(soundId);
		if (!howl) {
			console.warn(`Sound "${soundId}" not found`);
			return null;
		}

		// Apply options if provided
		if (options?.volume !== undefined) {
			howl.volume(options.volume);
		}
		if (options?.loop !== undefined) {
			howl.loop(options.loop);
		}
		if (options?.rate !== undefined) {
			howl.rate(options.rate);
		}

		// Play the sound (with sprite if specified)
		const instanceId = options?.sprite
			? howl.play(options.sprite)
			: howl.play();

		// Add to active sounds
		this.activeSounds.push({
			id: soundId,
			howl,
			soundId: instanceId,
		});

		// Set up onend callback
		if (options?.onend) {
			howl.once("end", options.onend, instanceId);
		}

		// Clean up from active sounds when done
		howl.once(
			"end",
			() => {
				this.removeActiveSound(soundId, instanceId);
			},
			instanceId
		);

		return instanceId;
	}

	/**
	 * Stop a specific sound instance or all instances of a sound
	 */
	public stop(soundId: string, instanceId?: number): void {
		const howl = this.sounds.get(soundId);
		if (!howl) {
			console.warn(`Sound "${soundId}" not found`);
			return;
		}

		if (instanceId !== undefined) {
			howl.stop(instanceId);
			this.removeActiveSound(soundId, instanceId);
		} else {
			howl.stop();
			this.removeAllActiveSound(soundId);
		}
	}

	/**
	 * Pause a specific sound instance or all instances of a sound
	 */
	public pause(soundId: string, instanceId?: number): void {
		const howl = this.sounds.get(soundId);
		if (!howl) {
			console.warn(`Sound "${soundId}" not found`);
			return;
		}

		if (instanceId !== undefined) {
			howl.pause(instanceId);
		} else {
			howl.pause();
		}
	}

	/**
	 * Resume a paused sound
	 */
	public resume(soundId: string, instanceId?: number): void {
		const howl = this.sounds.get(soundId);
		if (!howl) {
			console.warn(`Sound "${soundId}" not found`);
			return;
		}

		if (instanceId !== undefined) {
			howl.play(instanceId);
		} else {
			howl.play();
		}
	}

	/**
	 * Fade a sound in or out
	 */
	public fade(
		soundId: string,
		from: number,
		to: number,
		duration: number,
		instanceId?: number
	): void {
		const howl = this.sounds.get(soundId);
		if (!howl) {
			console.warn(`Sound "${soundId}" not found`);
			return;
		}

		if (instanceId !== undefined) {
			howl.fade(from, to, duration, instanceId);
		} else {
			howl.fade(from, to, duration);
		}
	}

	/**
	 * Set the master volume for all sounds
	 */
	public setMasterVolume(volume: number): void {
		this.masterVolume = Math.max(0, Math.min(1, volume));
		Howler.volume(this.masterVolume);
	}

	/**
	 * Get the current master volume
	 */
	public getMasterVolume(): number {
		return this.masterVolume;
	}

	/**
	 * Mute all sounds
	 */
	public mute(): void {
		this.isMuted = true;
		Howler.mute(true);
	}

	/**
	 * Unmute all sounds
	 */
	public unmute(): void {
		this.isMuted = false;
		Howler.mute(false);
	}

	/**
	 * Toggle mute state
	 */
	public toggleMute(): boolean {
		if (this.isMuted) {
			this.unmute();
		} else {
			this.mute();
		}
		return this.isMuted;
	}

	/**
	 * Check if a sound is currently playing
	 */
	public isPlaying(soundId: string, instanceId?: number): boolean {
		const howl = this.sounds.get(soundId);
		if (!howl) return false;

		if (instanceId !== undefined) {
			return howl.playing(instanceId);
		}

		return howl.playing();
	}

	/**
	 * Get the duration of a sound
	 */
	public getDuration(soundId: string, instanceId?: number): number {
		const howl = this.sounds.get(soundId);
		if (!howl) return 0;

		return howl.duration(instanceId);
	}

	/**
	 * Stop all currently playing sounds
	 */
	public stopAll(): void {
		this.sounds.forEach((howl) => {
			howl.stop();
		});
		this.activeSounds = [];
	}

	/**
	 * Unload a specific sound from memory
	 */
	public unload(soundId: string): void {
		const howl = this.sounds.get(soundId);
		if (howl) {
			howl.unload();
			this.sounds.delete(soundId);
			this.removeAllActiveSound(soundId);
		}
	}

	/**
	 * Unload all sounds and clean up
	 */
	public dispose(): void {
		this.sounds.forEach((howl) => {
			howl.unload();
		});
		this.sounds.clear();
		this.activeSounds = [];
		this.isInitialized = false;
	}

	/**
	 * Remove a specific active sound instance
	 */
	private removeActiveSound(soundId: string, instanceId: number): void {
		this.activeSounds = this.activeSounds.filter(
			(s) => !(s.id === soundId && s.soundId === instanceId)
		);
	}

	/**
	 * Remove all active sound instances for a given sound id
	 */
	private removeAllActiveSound(soundId: string): void {
		this.activeSounds = this.activeSounds.filter((s) => s.id !== soundId);
	}

	/**
	 * Get all currently active sounds
	 */
	public getActiveSounds(): ActiveSound[] {
		return [...this.activeSounds];
	}

	/**
	 * Check if the sound manager is initialized
	 */
	public getIsInitialized(): boolean {
		return this.isInitialized;
	}
}
