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
					b.location,
					b.addDelay,
					b.stagger,
					plateforms,
					this.physics,
					this.scene
				)
			);
		});
		// console.log("this.blocks", this.blocks);
	}

	private addBlocks() {
		this.blocks.forEach((b, i) => {
			if (i < 4) {
				setTimeout(() => {
					b.isActive = true;
					this.activeBlocks.push({ block: b, id: b.id });
				}, b.addDelay * i);
			}
		});
	}

	private getNextBlock(oldBlock: GameBlock): GameBlock {
		// console.log("getNextBlock", this.blocks);
		let nextBlock = this.blocks.find(
			(b) => b.location === oldBlock.location
		);

		// If there aren't others blocks with the same location we are in the last phase
		// so choose one of the last 4
		if (!nextBlock) {
			nextBlock = this.blocks[Math.floor(Math.random() * 4)];
		}

		console.log("newBlock", nextBlock);

		return nextBlock;
	}

	public update(time: number) {
		if (this.activeBlocks.length === 0) {
			// console.log("addBlock");
			// Add the first 4 blocks
			this.addBlocks();
		}
		this.activeBlocks.forEach((ab) => {
			if (ab) ab.block.update(time);

			if (!ab.block.isActive) {
				// console.log(
				// 	`block ${ab.block.id} is unactive`,
				// 	this.activeBlocks
				// );
				if (this.blocks.length > 4) {
					this.blocks.splice(ab.id, 1);
					const newBlock = this.getNextBlock(ab.block);
					this.activeBlocks.splice(ab.id, 1);
					if (newBlock) {
						newBlock.isActive = true;
						this.activeBlocks.push({
							block: newBlock,
							id: newBlock.id,
						});
					}
				}

				// The last 4 blocks doesn't have to be deleted for the game to be endless
			}
		});
	}
}
