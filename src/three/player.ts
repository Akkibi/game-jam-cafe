import Matter from "matter-js";
import * as THREE from "three/webgpu"
import { mapCoords } from "../matter/physics";


const physicsScale = 0.004;
// const physicsTransform = new THREE.Vector2(-window.innerWidth/2, -window.innerHeight/2);

export class Player {
  private static _instance: Player;
  private object: THREE.Mesh;
  private scene: THREE.Scene;

  public static getInstance(scene : THREE.Scene, body: Matter.Body): Player {
    if (!Player._instance) {
      Player._instance = new Player(scene, body);
    }
    return Player._instance;
  }

  constructor(scene: THREE.Scene, body: Matter.Body) {
    this.scene = scene;
    const width = body.bounds.max.x - body.bounds.min.x;
    const height = body.bounds.max.y - body.bounds.min.y;
    this.object = new THREE.Mesh(new THREE.PlaneGeometry(width * physicsScale, height * physicsScale), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
    this.scene.add(this.object);
  }

  public update(body: Matter.Body) {
    if (body.position.y > window.innerHeight) {
      Matter.Body.setPosition(body, { x: body.position.x, y: -window.innerHeight * 0.5});

    }
    const newPos = mapCoords(body.position, false);
    this.object.position.set(newPos.x, newPos.y, 0);

    // this.object.position.set((body.position.x+ physicsTransform.x) * physicsScale, (currentPhysics.position.y + physicsTransform.y) * -physicsScale, 0);
  }
}
