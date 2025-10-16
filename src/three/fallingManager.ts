import * as THREE from 'three/webgpu';
import Matter from "matter-js";
import { mapCoords, PhysicsEngine } from '../matter/physics';

interface elemType {
  mesh : THREE.Mesh;
  body : Matter.Body;
  distance: number;
}

export class FallingManager {
  private static instance: FallingManager;
  private falls: elemType[]
  private physicsEngine: PhysicsEngine;

  private constructor(scene : THREE.Scene, physicsEngine: PhysicsEngine) {
    this.physicsEngine = physicsEngine;
    this.falls = [];

    for (let i = 0; i < 10; i++) {
      const boxPosition = new THREE.Vector3(0, -2, 0);
      const boxScale = new THREE.Vector3(0.1, 0.1, 0.1);
      const object = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x0000ff }));
      object.scale.multiply(boxScale);
      const body = this.physicsEngine.addObject(boxPosition, boxScale, true);
      const elem = {
        mesh: object,
        body: body,
        distance: Math.random() + 1
      };
      this.falls.push(elem);
      scene.add(object);
    }
  }

  update(): void {
    for (let i = 0; i < this.falls.length; i++) {
      const fallingObject = this.falls[i];
      if (fallingObject.body.position.y > (window.innerHeight * fallingObject.distance)) {
        Matter.Body.setPosition(fallingObject.body, { x: Math.random() * window.innerWidth, y: -window.innerHeight * 0.5});

      }

      const newPos = mapCoords(fallingObject.body.position, false);
      const rotation = fallingObject.body.angle;
      this.falls[i].mesh.position.set(newPos.x, newPos.y, 0);
      this.falls[i].mesh.rotation.set(0, 0, -rotation);
    }
  }

  public static getInstance(scene: THREE.Scene, physicsEngine: PhysicsEngine): FallingManager {
    if (!FallingManager.instance) {
      FallingManager.instance = new FallingManager(scene,physicsEngine);
    }
    return FallingManager.instance;
  }
}
