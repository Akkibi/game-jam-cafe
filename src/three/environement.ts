import * as THREE from 'three/webgpu';
import { loadGLTFModel } from '../utils/loadGLTFModel';

export class Environement {
  private static instance: Environement;
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private renderer: THREE.WebGPURenderer;
  private instanceGroup: THREE.Group;

  private constructor(scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGPURenderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.instanceGroup = new THREE.Group();
    this.scene.add(this.instanceGroup);
    loadGLTFModel( this.instanceGroup, '/assets/bounds/bounds.glb');
  }

  public static getInstance(scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGPURenderer): Environement {
    if (!Environement.instance) {
      Environement.instance = new Environement(scene, camera, renderer);
    }
    return Environement.instance;
  }
}
