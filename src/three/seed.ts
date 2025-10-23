import * as THREE from "three/webgpu";
import { loadGLTFModel } from "../utils/loadGLTFModel";

// make an object seed that takes in a position, id and has a "take function"

export class Seed {
  public position: THREE.Vector3;
  private group: THREE.Group;
  private scene: THREE.Scene;
  private random: number;
  private seeds: Seed[];

  constructor(position: THREE.Vector3, seeds: Seed[], scene: THREE.Scene) {
    this.position = position;
    this.scene = scene;
    this.random = Math.random() * 5;
    this.seeds = seeds;
    this.group = new THREE.Group();

    const link = "/assets/models/coffeegrain.glb";

    loadGLTFModel(this.group, link);

    this.group.position.copy(this.position);
    this.scene.add(this.group);
  }

  public update(time: number) {
    this.group.position.y =
      this.position.y + Math.sin(time + this.random) * 0.1;
    this.group.rotation.y = Math.sin(time * 2 + this.random) * 0.5;
  }

  public destroy() {
    this.seeds.splice(this.seeds.indexOf(this), 1);
    this.scene.remove(this.group);
  }
}
