import * as THREE from "three/webgpu";
import gsap from "gsap";
import { CameraManager } from "./cameraManager";
import { Environement } from "./environement";
import Stats from "stats.js";
import { PhysicsEngine } from "../matter/physics";
import { Player } from "./player";
import { SeedManager } from "./seedManager";
import { GameEngine } from "../game_engine/GameEngine";
import { SoundManager } from "../sounds/soundManager";
import { soundConfigs, SOUNDS } from "../sounds/sounds";
// import { FallingManager } from "./fallingManager";

export class SceneManager {
	private static instance: SceneManager;
	public canvas: HTMLDivElement | null;
	private scene: THREE.Scene;
	private gameEngine: GameEngine;

	private renderer: THREE.WebGPURenderer;
	private camera: CameraManager;
	public env: Environement;
	private stats: Stats;
	private player: Player;
	private physicsEngine: PhysicsEngine;
	private seedManager: SeedManager;
	private soundManager: SoundManager;
	// private fallingManager: FallingManager;

	private constructor(canvas: HTMLDivElement) {
		// stats
		this.physicsEngine = PhysicsEngine.getInstance();
		this.stats = new Stats();
		document.body.appendChild(this.stats.dom);
		this.scene = new THREE.Scene();
		this.player = Player.getInstance(
			this.scene,
			this.physicsEngine.getPlayer(),
			this.physicsEngine.engine
		);
		this.seedManager = SeedManager.getInstance(this.player, this.scene);
		this.soundManager = SoundManager.getInstance();
		this.gameEngine = GameEngine.getInstance(
			this.physicsEngine,
			this.seedManager,
			this.soundManager,
			this.scene
		);
		// this.scene.background = new THREE.Color(0x111121);
		this.canvas = canvas;
		// this.water = Water.getInstance(this.scene);
		this.renderer = new THREE.WebGPURenderer();
		this.renderer.init();
		this.renderer.shadowMap.enabled = true;
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.camera = CameraManager.getInstance(this.scene);
		this.env = Environement.getInstance(this.scene);
		// ambian light
		const ambientLight = new THREE.AmbientLight(0x9090c0);
		this.scene.add(ambientLight);
		// sun light

		this.soundManager.init(soundConfigs);
		this.soundManager.play(SOUNDS.SOUNDTRACK, { loop: true, volume: 0.25 });

		gsap.ticker.add((time, deltatime) => this.animate(time, deltatime));
		window.addEventListener("resize", this.resize.bind(this));
		this.init(canvas);

		this.renderer.toneMapping = THREE.NoToneMapping;
		this.scene.environment = null;
		this.scene.background = new THREE.Color(0x111121);
	}

	public static getInstance(canvas: HTMLDivElement): SceneManager {
		if (!SceneManager.instance) {
			SceneManager.instance = new SceneManager(canvas);
		}
		return SceneManager.instance;
	}

	private resize() {
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		const camera = this.camera.getCamera();
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	}

	private init(canvas: HTMLDivElement) {
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setClearColor(0x000000);
		canvas.appendChild(this.renderer.domElement);
	}

	private animate(time: number, deltatime: number) {
		this.stats.begin();
		this.physicsEngine.update(deltatime * 1.5);
		this.camera.update(deltatime);
		this.renderer.render(this.scene, this.camera.getCamera());
		// this.water.update(time);

		this.gameEngine.update(time);
		this.player.update(deltatime);
		// this.fallingManager.update();
		this.seedManager.update(time);
		this.stats.end();
	}

	public getScene(): THREE.Scene {
		return this.scene;
	}
}
