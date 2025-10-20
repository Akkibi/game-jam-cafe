import * as THREE from "three/webgpu";
import gsap from "gsap";
import { CameraManager } from "./cameraManager";
import { Environement } from "./environement";
import Stats from "stats.js";
import { PhysicsEngine } from "../matter/physics";
import { Player } from "./player";
// import { FallingManager } from "./fallingManager";
import { GameEngine } from "../game_engine/GameEngine";

export class SceneManager {
	private static instance: SceneManager;
	private canvas: HTMLDivElement | null;
	private scene: THREE.Scene;
	private renderer: THREE.WebGPURenderer;
	private camera: CameraManager;
	private env: Environement;
	private stats: Stats;
	private physicsEngine: PhysicsEngine;
	private gameEngine: GameEngine;
	private player: Player;
	// private fallingManager: FallingManager;

	private constructor(canvas: HTMLDivElement) {
		// stats
		this.physicsEngine = PhysicsEngine.getInstance();
		this.stats = new Stats();
		document.body.appendChild(this.stats.dom);
		this.scene = new THREE.Scene();
		this.gameEngine = GameEngine.getInstance(
			this.physicsEngine,
			this.scene
		);
		this.player = Player.getInstance(
			this.scene,
			this.physicsEngine.getPlayer()
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

		const sunLight = new THREE.DirectionalLight(0xffffee, 2);
		sunLight.position.set(1, 1, -1);
		sunLight.lookAt(new THREE.Vector3(0, 0, 0));
		sunLight.castShadow = true;
		sunLight.shadow.camera.near = -2; // default
		sunLight.shadow.camera.far = 100; // default
		sunLight.shadow.mapSize.width = 1024; // default
		sunLight.shadow.mapSize.height = 1024; // default
		this.scene.add(sunLight);

		// hook GSAP ticker instead of setAnimationLoop
		gsap.ticker.add((_time, deltatime) => this.animate(deltatime));
		window.addEventListener("resize", this.resize.bind(this));
		this.init(canvas);
		// this.createBackgroundShader();

		// fallingObjects
		// this.fallingManager = FallingManager.getInstance(
		// 	this.scene,
		// 	this.physicsEngine
		// );

		// for (let i = -2; i <= 2; i++) {
		//   for (let j = -2; j <= 2; j++) {
		//     const test = new THREE.Mesh(
		//       new THREE.BoxGeometry(1, 1, 1),
		//       new THREE.MeshBasicMaterial({ color: 0x000 }),
		//     );
		//     const pos = j % 2 === 0 ? i * 1.5 : i * 1.5 + 0.8;
		//     test.position.set(pos, j * 0.7 - 0.2, 0);
		//     test.scale.set(0.5, 0.1, 1);
		//     this.scene.add(test);
		//     this.physicsEngine.addObject(test.position, test.scale);
		//   }
		// }

		// const active_phase = Phases[0];

		// for (let i = 0; i < active_phase.block.length; i++) {
		// 	new Platform(
		// 		this.scene,
		// 		new THREE.Vector3(
		// 			active_phase.block[i].position.x,
		// 			active_phase.block[i].position.y,
		// 			active_phase.block[i].position.z
		// 		),
		// 		active_phase.block[i].lifeSpan,
		// 		this.sceneElements
		// 	);
		// 	const plateform = this.scene.children[
		// 		this.scene.children.length - 1
		// 	] as THREE.Mesh;
		// 	this.physicsEngine.addObject(plateform.position, plateform.scale);
		// }

		// console.log(this.canvas, this.env);
	}

	// private createBackgroundShader() {
	//   this.scene.backgroundNode = vec4(length(vec2(normalLocal.add(0, - 0.5))), length(vec2(normalLocal.add(0.5, - 0.5))), length(vec2(normalLocal.add(1, - 0.5))), 1);
	// }

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

	private animate(deltatime: number) {
		this.stats.begin();
		this.physicsEngine.update(deltatime * 1.5);
		this.camera.update(deltatime);
		this.renderer.render(this.scene, this.camera.getCamera());
		// this.water.update(time);

		this.player.update(deltatime);
		// this.fallingManager.update();
		this.stats.end();
	}

	public getScene(): THREE.Scene {
		return this.scene;
	}
}
