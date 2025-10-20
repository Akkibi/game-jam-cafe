import type { PhysicsEngine } from "../matter/physics";
import * as THREE from "three/webgpu";
import { GameBlock } from "../classes/GameBlock";
import { Blocks } from "./blocks";
import { GamePlatform } from "../classes/GamePlatform";

export class GameEngine {
	private static _instance: GameEngine;
	private physics: PhysicsEngine;
	private scene: THREE.Scene;
	private blocks: GameBlock[] = [];

	constructor(physics: PhysicsEngine, scene: THREE.Scene) {
		this.physics = physics;
		this.scene = scene;

		this.createBlocks();
	}

	static getInstance(physics: PhysicsEngine, scene: THREE.Scene): GameEngine {
		if (!this._instance) this._instance = new GameEngine(physics, scene);
		return this._instance;
	}

	private createBlocks() {
		Blocks.forEach((b) => {
			const plateforms = b.blockElements.map(
				(p) =>
					new GamePlatform(
						-1,
						this.scene,
						p.position,
						this.physics,
						p.size,
						p.lifeSpan
					)
			);

			this.blocks.push(
				new GameBlock(
					b.id,
					b.duration,
					plateforms,
					this.physics,
					this.scene
				)
			);
		});
		console.log(this.blocks[0]);
		this.blocks[0].addBlock();
	}

	// public update() {
	// 	const gameState = useStore.getState();
	// 	if (gameState.game_status === "game_over") return;

	// 	console.log(this.blocks[0]);

	// 	this.blocks[0].addBlock();
	// }

	public phase1() {}
}
