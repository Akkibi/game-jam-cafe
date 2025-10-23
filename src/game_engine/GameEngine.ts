import type { PhysicsEngine } from "../matter/physics";
import * as THREE from "three/webgpu";
import { GameBlock } from "../classes/GameBlock";
import { Blocks } from "./blocks";
import { SeedManager } from "../three/seedManager";
import { createGamePlatform } from "../classes/platforms/createGamePlatform";

export class GameEngine {
	private static _instance: GameEngine;
	private physics: PhysicsEngine;
	private seedManager: SeedManager;
	private scene: THREE.Scene;
	private blocks: GameBlock[] = [];
	public activeBlocks: { block: GameBlock; id: number }[] = [];
	private usedBlockIds: Set<number> = new Set();
	private endlessPhaseBlocks: GameBlock[] = []; // Store blocks for endless phase
	private isEndlessPhase: boolean = false;

	constructor(
		physics: PhysicsEngine,
		seedManager: SeedManager,
		scene: THREE.Scene
	) {
		this.physics = physics;
		this.seedManager = seedManager;
		this.scene = scene;

		this.createBlocks();
	}

	static getInstance(
		physics: PhysicsEngine,
		seedManager: SeedManager,
		scene: THREE.Scene
	): GameEngine {
		if (!this._instance)
			this._instance = new GameEngine(physics, seedManager, scene);
		return this._instance;
	}

	private createBlocks() {
		Blocks.forEach((b) => {
			const plateforms = b.blockElements.map((p) =>
				createGamePlatform(
					-1,
					this.scene,
					p.position,
					this.physics,
					this.seedManager,
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

			console.log(this.blocks);
		});
	}

	private addBlocks() {
		this.blocks.forEach((b, i) => {
			if (i < 4) {
				// console.log("activeBlocks", this.activeBlocks, b.location);
				if (
					!this.activeBlocks.find(
						(ab) => b.location === ab.block.location
					)
				) {
					if (i === 0) {
						this.activeBlocks.push({ block: b, id: b.id });
						b.isActive = true;
						this.usedBlockIds.add(b.id);
					} else
						setTimeout(() => {
							this.activeBlocks.push({ block: b, id: b.id });
							b.isActive = true;
							this.usedBlockIds.add(b.id);
						}, b.addDelay * i);
				}
			}
		});
	}

	private getNextBlock(oldBlock: GameBlock): GameBlock | undefined {
		// If we're in endless phase, cycle through endlessPhaseBlocks
		if (this.isEndlessPhase) {
			const availableBlocks = this.endlessPhaseBlocks.filter(
				(b) => b.location === oldBlock.location
			);

			// console.log("availableBlocks", availableBlocks);

			if (availableBlocks.length > 0) {
				// Randomly select from available blocks with same location
				const nextBlock =
					availableBlocks[
						Math.floor(Math.random() * availableBlocks.length)
					];
				console.log("Endless phase - newBlock", nextBlock);
				return nextBlock;
			}
			return undefined;
		}

		// Normal phase: find unused block with same location
		const nextBlock = this.blocks.find(
			(b) =>
				b.location === oldBlock.location && !this.usedBlockIds.has(b.id)
		);

		// If no unused blocks found, we've reached the endless phase
		if (!nextBlock) {
			this.isEndlessPhase = true;

			// Store the last 8 blocks for endless cycling
			// These are the blocks that are currently active
			this.endlessPhaseBlocks = this.blocks;

			console.log("endlessPhaseBlocks", this.endlessPhaseBlocks);

			// Now try to get a block from endless phase
			return this.getNextBlock(oldBlock);
		}

		if (nextBlock) {
			this.usedBlockIds.add(nextBlock.id);
		}

		// console.log("Normal phase - newBlock", nextBlock);
		return nextBlock;
	}

	public update(time: number) {
		if (this.activeBlocks.length === 0) {
			this.addBlocks();
		}

		// Use a reverse loop to safely remove items while iterating
		for (let i = this.activeBlocks.length - 1; i >= 0; i--) {
			const ab = this.activeBlocks[i];
			if (ab) {
				ab.block.update(time);

				if (!ab.block.isActive) {
					// console.log(
					// 	`block ${ab.block.id} is unactive`,
					// 	this.activeBlocks
					// );
					// if (this.blocks.length > 4) {

					// Remove from activeBlocks
					const newBlock = this.getNextBlock(ab.block);
					if (newBlock) {
						console.log(
							`newBlock with id ${newBlock.id} and location ${newBlock.location} activated`
						);
						// this.blocks.splice(ab.id, 1);
						this.activeBlocks.splice(i, 1);
						newBlock.reset();
						newBlock.isActive = true;
						this.activeBlocks.push({
							block: newBlock,
							id: newBlock.id,
						});
					}
					// }
				}
			}
		}
	}
}
