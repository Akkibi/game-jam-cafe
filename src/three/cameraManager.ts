import * as THREE from 'three/webgpu';

export class CameraManager {
  private static instance: CameraManager;
  private camera: THREE.PerspectiveCamera;
  private cameraGroup: THREE.Group;

  private constructor(renderer: THREE.WebGPURenderer, scene: THREE.Scene) {
    this.camera = new THREE.PerspectiveCamera(
      52,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.cameraGroup = new THREE.Group();
    this.cameraGroup.position.set(0, 0, 0);
    scene.add(this.cameraGroup);
    this.camera.position.set(0, 0, 5);
    this.cameraGroup.add(this.camera);

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

  public update(time : number): void {
    this.camera.position.x = Math.sin(time * 0.1) * 0.5;
    this.camera.position.y = Math.cos(time * 0.1 + 500) * 0.5;
    // this.camera.position.z = 5
    this.camera.lookAt(0, 0, 0);
  }
}
