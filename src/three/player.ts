import * as THREE from "three/webgpu"


const physicsScale = 0.004;
const physicsTransform = new THREE.Vector2(-window.innerWidth/2, -window.innerHeight/2);

export class Player {
  private static _instance: Player;
  private object: THREE.Mesh;
  private scene: THREE.Scene;

  public static getInstance(scene : THREE.Scene, currentPhysics: Matter.Body): Player {
    if (!Player._instance) {
      Player._instance = new Player(scene, currentPhysics);
    }
    return Player._instance;
  }

  constructor(scene: THREE.Scene, currentPhysics: Matter.Body) {
    this.scene = scene;
    const width = currentPhysics.bounds.max.x - currentPhysics.bounds.min.x;
    const height = currentPhysics.bounds.max.y - currentPhysics.bounds.min.y;
    this.object = new THREE.Mesh(new THREE.PlaneGeometry(width * physicsScale, height * physicsScale), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
    this.scene.add(this.object);
  }

  public update(currentPhysics: Matter.Body) {
    this.object.position.set((currentPhysics.position.x+ physicsTransform.x) * physicsScale, (currentPhysics.position.y + physicsTransform.y) * -physicsScale, 0);
  }
}
