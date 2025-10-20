import * as THREE from "three/webgpu";

// make an object seed that takes in a position, id and has a "take function"

export class Seed {
  public position: THREE.Vector3;
  private mesh: THREE.Mesh;
  private scene: THREE.Scene;
  private random: number;
  private seeds: Seed[];

  constructor(position: THREE.Vector3, seeds: Seed[], scene: THREE.Scene) {
    this.position = position;
    this.scene = scene;
    this.random = Math.random() * 5;
    this.seeds = seeds;

    const link = "/assets/seed.png";

    const texture = new THREE.TextureLoader().load(link);
    texture.colorSpace = THREE.SRGBColorSpace;

    const box = new THREE.PlaneGeometry(0.2, 0.2);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
    });
    this.mesh = new THREE.Mesh(box, material);
    this.mesh.position.copy(this.position);
    this.scene.add(this.mesh);
  }

  public update(time: number) {
    this.mesh.position.y = this.position.y + Math.sin(time + this.random) * 0.1;
  }

  public destroy() {
    this.scene.remove(this.mesh);
    this.seeds.splice(this.seeds.indexOf(this), 1);
  }
}
