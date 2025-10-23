import * as THREE from "three/webgpu";
import gsap from "gsap";
import { CameraManager } from "./cameraManager";
import { Environement } from "./environement";
import Stats from "stats.js";
import { PhysicsEngine } from "../matter/physics";
import { Player } from "./player";
import { SeedManager } from "./seedManager";
import { GameEngine } from "../game_engine/GameEngine";
import { useStore } from "../store/globalStore";
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
  private physicsEngine: PhysicsEngine;
  private player: Player;
  private seedManager: SeedManager;
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
      this.physicsEngine.engine,
    );
    this.seedManager = SeedManager.getInstance(this.player, this.scene);
    this.gameEngine = GameEngine.getInstance(
      this.physicsEngine,
      this.seedManager,
      this.scene,
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

    gsap.ticker.add((time, deltatime) => this.animate(time, deltatime));
    window.addEventListener("resize", this.resize.bind(this));
    this.init(canvas);

    this.renderer.toneMapping = THREE.NoToneMapping;
    this.scene.environment = null;
    this.scene.background = new THREE.Color(0x111121);

    // this.createBackgroundShader();

    // fallingObjects
    // this.fallingManager = FallingManager.getInstance(
    //   this.scene,
    //   this.physicsEngine,
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

    // const seedPosition = new THREE.Vector3(-1, 0.1, 0);
    // this.seedManager.addSeed(seedPosition, 1);

    // for (let i = 0; i < 20; i++) {
    // 	const plateform = new THREE.Mesh(
    // 		new THREE.BoxGeometry(1, 1, 1),
    // 		new THREE.MeshBasicMaterial({ color: 0x000 })
    // 	);

    // 	const x = (Math.round(Math.random() * 10) * 0.1 - 0.5) * 6;
    // 	const y = (Math.round(Math.random() * 4) * 0.25 - 0.5) * 3;
    // 	plateform.position.set(x, y, 0);
    // 	const seedPosition = plateform.position
    // 		.clone()
    // 		.add(new THREE.Vector3(0, 0.3, 0));
    // 	this.seedManager.addSeed(seedPosition);
    // 	plateform.scale.set(0.5 * Math.random() + 0.5, 0.15, 1.9);
    // 	this.scene.add(plateform);
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

  private animate(time: number, deltatime: number) {
    const customDeltatime = useStore.getState().isPaused
      ? 0
      : useStore.getState().isSlowed
        ? deltatime * 0.25
        : deltatime * 1;
    this.stats.begin();
    this.physicsEngine.update(customDeltatime * 1.5);
    this.camera.update(time, customDeltatime);
    this.renderer.render(this.scene, this.camera.getCamera());
    // this.water.update(time);

    this.gameEngine.update(time);
    this.player.update(customDeltatime);
    // this.fallingManager.update();
    this.seedManager.update(time);
    this.stats.end();
  }

  public getScene(): THREE.Scene {
    return this.scene;
  }
}
