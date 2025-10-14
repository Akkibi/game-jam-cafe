import * as THREE from 'three/webgpu';
import gsap from 'gsap';
// import { Water } from './water';
import { CameraManager } from './cameraManager';
import { vec4 ,length, vec2, normalLocal } from 'three/tsl';

export class SceneManager {
  private static instance: SceneManager;
  private canvas: HTMLDivElement | null;
  private scene: THREE.Scene;
  private renderer: THREE.WebGPURenderer;
  private camera: CameraManager;


  private constructor(canvas: HTMLDivElement) {
    this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color(0x111121);
    this.canvas = canvas;
    // this.water = Water.getInstance(this.scene);

    this.renderer = new THREE.WebGPURenderer();
    this.renderer.init();
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera = CameraManager.getInstance(this.renderer , this.scene);

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
    // put per-frame logic here (object updates, controls, etc.)
    this.camera.update(deltatime);
    this.renderer.render(this.scene, this.camera.getCamera());
    // this.water.update(time);
  }

  public getScene(): THREE.Scene {
    return this.scene;
  }
}
