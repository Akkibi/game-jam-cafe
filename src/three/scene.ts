import * as THREE from 'three/webgpu';
import gsap from 'gsap';
import { CameraManager } from './cameraManager';
import { Environement } from './environement';
import { PhysicsEngine } from '../matter/physics';
import { SLOW_MOTION_SCALE, WORLD } from '../matter/tuning';
import { Player } from './player';
import { SeedManager } from './seedManager';
import { GameEngine } from '../game_engine/GameEngine';
import { SoundManager } from '../sounds/soundManager';
import { soundConfigs, SOUNDS } from '../sounds/sounds';
import { useStore } from '../store/globalStore';
import { preloadModels } from '../utils/loadGLTFModel';
import { preloadSteamFrames } from '../classes/platforms/SteamWandPlatform';
import { isWebKit } from '../utils/device';
// import { FallingManager } from "./fallingManager";

const MAX_PIXEL_RATIO = 1.5;
const PRELOADED_MODELS = [
	'/assets/models/grinder_platform.glb',
	'/assets/models/grinder.glb',
	'/assets/models/steamwand.glb',
	'/assets/models/sugar_platform.glb',
	'/assets/models/coffeegrain.glb',
];

export class SceneManager {
	private static instance: SceneManager;
	public canvas: HTMLDivElement | null;
	private scene: THREE.Scene;
	private gameEngine: GameEngine;

	private renderer: THREE.WebGPURenderer;
	private camera: CameraManager;
	public env: Environement;
	private player: Player;
	private physicsEngine: PhysicsEngine;
	private seedManager: SeedManager;
	private soundManager: SoundManager;
	private hasPlayedIntro = false;
	private rotateHoldSeconds = 0;
	// private fallingManager: FallingManager;

	private constructor(canvas: HTMLDivElement | null) {
		this.physicsEngine = PhysicsEngine.getInstance();
		this.scene = new THREE.Scene();
		this.soundManager = SoundManager.getInstance();
		this.player = Player.getInstance(
			this.scene,
			this.physicsEngine.getPlayer(),
			this.physicsEngine.engine,
		);
		this.seedManager = SeedManager.getInstance(this.player, this.scene);
		this.gameEngine = GameEngine.getInstance(
			this.physicsEngine,
			this.seedManager,
			this.soundManager,
			this.scene,
		);
		// this.scene.background = new THREE.Color(0x111121);
		this.canvas = canvas;
		// this.water = Water.getInstance(this.scene);
		this.renderer = new THREE.WebGPURenderer({ forceWebGL: isWebKit });
		this.renderer.init();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.camera = CameraManager.getInstance(this.scene);
		this.env = Environement.getInstance(this.scene);
		// ambian light
		const ambientLight = new THREE.AmbientLight(0x9090c0);
		this.scene.add(ambientLight);
		// sun light

		preloadModels(PRELOADED_MODELS);
		preloadSteamFrames();

		this.soundManager.init(soundConfigs);
		this.applyRotateHold(useStore.getState().isRotateBlocked);
		useStore.subscribe((state, previous) => {
			if (state.isRotateBlocked !== previous.isRotateBlocked) {
				this.applyRotateHold(state.isRotateBlocked);
			}
		});

		gsap.ticker.add((time, deltatime) => this.animate(time, deltatime));
		const root = document.getElementById('root');
		if (root) new ResizeObserver(() => this.resize(root)).observe(root);
		if (canvas) {
			this.init(canvas);
		}

		this.renderer.toneMapping = THREE.NoToneMapping;
		this.scene.environment = null;
		this.scene.background = new THREE.Color(0x111121);
	}

	public static getInstance(canvas: HTMLDivElement | null): SceneManager {
		if (!SceneManager.instance) {
			SceneManager.instance = new SceneManager(canvas);
		}
		return SceneManager.instance;
	}

	private applyRotateHold(isBlocked: boolean) {
		if (isBlocked) {
			gsap.globalTimeline.pause();
			this.soundManager.mute();
			return;
		}
		gsap.globalTimeline.resume();
		this.soundManager.unmute();
		if (!this.hasPlayedIntro) {
			this.hasPlayedIntro = true;
			this.playIntro();
		}
	}

	private playIntro() {
		this.soundManager.play(SOUNDS.VOICE_INTRO_1, {
			volume: 0.4,
			onend: () => {
				this.soundManager.play(SOUNDS.VOICE_INTRO_2, {
					volume: 0.4,
					onend: () => this.playSoundtrack(),
				});
			},
		});
	}

	public playSoundtrack() {
		this.soundManager.play(SOUNDS.SOUNDTRACK, {
			loop: true,
			volume: 0.1,
		});
	}

	// Safari reports stale window sizes right after a rotation, so size from the laid out root.
	private resize(root: HTMLElement) {
		const { clientWidth: width, clientHeight: height } = root;
		if (!width || !height) return;
		this.renderer.setSize(width, height);
		const camera = this.camera.getCamera();
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	}

	private init(canvas: HTMLDivElement) {
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setClearColor(0x000000);
		canvas.appendChild(this.renderer.domElement);
	}

	public restart = () => {
		if (useStore.getState().score > 30000) {
			useStore.setState({ isPaused: true });
			useStore.setState({ isGameOver: true });
			useStore.setState({ restartButton: false });
			useStore.setState({ nextButton: false });
			return;
		}
		useStore.setState({ isGameOver: false });
		this.physicsEngine.restart();
		this.seedManager.restart();
		this.gameEngine.restart();
		useStore.setState({
			caffeineLvl: 50,
			game_status: 'intro',
			isPaused: true,
			score: 0,
			isRestarting: true,
			countdownTimeScale: 1.5,
		});
	};

	private animate(time: number, deltatime: number) {
		const { isPaused, isRestarting, isSlowed, isRotateBlocked } = useStore.getState();
		const customDeltatime = isSlowed ? deltatime * SLOW_MOTION_SCALE : deltatime;

		if (isRotateBlocked) {
			// Platform lifespans read this clock, so time spent held must not age them.
			this.rotateHoldSeconds += deltatime / 1000;
		} else {
			const gameTime = time - this.rotateHoldSeconds;
			if (!isPaused) {
				this.physicsEngine.update(customDeltatime);
			}
			// Platforms spawn during the countdown so their colliders exist before the player drops.
			if (!isPaused || isRestarting) {
				this.gameEngine.update(gameTime);
				this.seedManager.update(gameTime);
				const body = this.player.update(customDeltatime);
				if (body.position.y > WORLD.height * 1.5) {
					this.restart();
				}
			}
		}

		this.camera.update(time, deltatime);
		this.renderer.render(this.scene, this.camera.getCamera());
	}

	public getScene(): THREE.Scene {
		return this.scene;
	}
}
