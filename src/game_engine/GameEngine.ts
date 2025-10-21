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
	public activeBlocks: { block: GameBlock; id: number }[] = [];

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
						p.lifeSpan,
						p.type
					)
			);

			this.blocks.push(
				new GameBlock(
					b.id,
					b.addDelay,
					b.stagger,
					plateforms,
					this.physics,
					this.scene
				)
			);
		});
	}

	private addBlocks() {
		this.blocks.forEach((b, i) => {
			if (i < 4) {
				setTimeout(() => {
					b.setBlockActive();
				}, b.stagger * i);
				this.activeBlocks.push({ block: b, id: i });
			}
		});
	}

	public update(time: number) {
		if (this.activeBlocks.length === 0) {
			console.log("addBlock");
			// Add the first 4 blocks
			this.addBlocks();
		}

		this.activeBlocks.forEach((ab) => {
			if (ab) ab.block.update(time);
		});
	}
}
