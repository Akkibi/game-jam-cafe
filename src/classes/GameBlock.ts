import * as THREE from "three/webgpu";
import type { GamePlatform } from "./GamePlatform";
import type { PhysicsEngine } from "../matter/physics";

export class GameBlock {
	private id: number;
	private duration: number;
	private platforms: GamePlatform[] = [];
	private physics: PhysicsEngine;
	private scene: THREE.Scene;

	constructor(
		id: number,
		duration: number,
		platforms: GamePlatform[],
		physics: PhysicsEngine,
		scene: THREE.Scene
	) {
		this.id = id;
		this.duration = duration;
		this.platforms = platforms;
		this.physics = physics;
		this.scene = scene;
	}

	public getPlatforms(): GamePlatform[] {
		return this.platforms;
	}

	public addBlock(): void {
		this.platforms.forEach((p) => {
			console.log(p);
			p.addToScene();
		});
	}

	// public switchBlock(new_block: GameBlock): void {
	// 	this.scene.remove();
	// }
}
