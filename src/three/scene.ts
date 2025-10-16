import * as THREE from 'three/webgpu';
import gsap from 'gsap';
import { CameraManager } from './cameraManager';
import { vec4 ,length, vec2, normalLocal } from 'three/tsl';
import { Environement } from './environement';
import Stats from 'stats.js';
import { PhysicsEngine } from '../matter/physics';
import { Player } from './player';
import { FallingManager } from './fallingManager';

export class SceneManager {
  private static instance: SceneManager;
  private canvas: HTMLDivElement | null;
  private scene: THREE.Scene;
  private renderer: THREE.WebGPURenderer;
  private camera: CameraManager;
  private env: Environement;
  private stats: Stats;
  private physicsEngine: PhysicsEngine;
  private player: Player;
  private fallingManager: FallingManager;

  private constructor(canvas: HTMLDivElement) {
    // stats
    this.physicsEngine = PhysicsEngine.getInstance();
    this.stats = new Stats();
    document.body.appendChild( this.stats.dom );
    this.scene = new THREE.Scene();
    this.player = Player.getInstance(this.scene, this.physicsEngine.getPlayer());
    // this.scene.background = new THREE.Color(0x111121);
    this.canvas = canvas;
    // this.water = Water.getInstance(this.scene);
    this.renderer = new THREE.WebGPURenderer();
    this.renderer.init();
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera = CameraManager.getInstance(this.renderer , this.scene);
    this.env = Environement.getInstance(this.scene, this.camera.getCamera(), this.renderer);
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
    gsap.ticker.add((time, deltatime) => this.animate(time,deltatime));
    window.addEventListener('resize', this.resize.bind(this));
    this.init(canvas);
    this.createBackgroundShader();

    // fallingObjects
    this.fallingManager = FallingManager.getInstance(this.scene, this.physicsEngine);

    // test object
    const test = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0x000 })
    );
    test.position.set(0, 0,0 );
    test.scale.set(0.5, 0.5, 1);
    this.scene.add(test);
    this.physicsEngine.addObject(test.position, test.scale);

    const test2 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0x000 })
    );
    test2.position.set(-2, -1,0);
    test2.scale.set(2, 0.25, 1);
    this.scene.add(test2);
    this.physicsEngine.addObject(test2.position, test2.scale);

    const test3 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0x000 })
    );
    test3.position.set(2, -1,0);
    test3.scale.set(0.5, 0.25, 1);
    this.scene.add(test3);
    this.physicsEngine.addObject(test3.position, test3.scale);

  }

  private createBackgroundShader() {
    this.scene.backgroundNode = vec4(length(vec2(normalLocal.add(0, - 0.5))), length(vec2(normalLocal.add(0.5, - 0.5))), length(vec2(normalLocal.add(1, - 0.5))), 1);
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
    this.renderer.setClearColor(0x000000, 1);
    canvas.appendChild(this.renderer.domElement);
  }

  private animate(time: number, deltatime : number) {
    	this.stats.begin();
      this.physicsEngine.update(deltatime);
      this.camera.update(time);
      this.renderer.render(this.scene, this.camera.getCamera());
      // this.water.update(time);

     this.player.update(this.physicsEngine.getPlayer());
     this.fallingManager.update();
   	this.stats.end();
  }

  public getScene(): THREE.Scene {
    return this.scene;
  }
}
