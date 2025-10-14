import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class CameraManager {
  private static instance: CameraManager;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;

  private constructor(renderer: THREE.WebGPURenderer, scene: THREE.Scene) {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 5);

    this.controls = new OrbitControls(this.camera, renderer.domElement);
    this.controls.enableDamping = true;
    scene.add(this.camera);

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });
  }

  public static getInstance(
    renderer: THREE.WebGPURenderer,
    scene: THREE.Scene
  ): CameraManager {
    if (!CameraManager.instance) {
      CameraManager.instance = new CameraManager(renderer, scene);
    }
    return CameraManager.instance;
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  public update(deltatime : number): void {
    this.controls.update( deltatime);
  }
}
