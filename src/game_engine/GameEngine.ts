import type { PhysicsEngine } from '../matter/physics';
import * as THREE from 'three/webgpu';
import { GameBlock } from '../classes/GameBlock';
import { Blocks } from './blocks';
import { SeedManager } from '../three/seedManager';
import { createGamePlatform } from '../classes/platforms/createGamePlatform';
import type { SoundManager } from '../sounds/soundManager';
import { useStore } from '../store/globalStore';

export class GameEngine {
	private static _instance: GameEngine;
	private physics: PhysicsEngine;
	private seedManager: SeedManager;
	private soundManager: SoundManager;
	private scene: THREE.Scene;
	public activeBlocks: { block: GameBlock; id: number }[] = [];
	private usedBlockIds: Set<number> = new Set();
	private isEndlessPhase: boolean = false;
	private blockActivationTimes: Map<number, number> = new Map();
	private initialTime: number | null = null;

	constructor(
		physics: PhysicsEngine,
		seedManager: SeedManager,
		soundManager: SoundManager,
		scene: THREE.Scene,
	) {
		this.physics = physics;
		this.seedManager = seedManager;
		this.soundManager = soundManager;
		this.scene = scene;
	}

	static getInstance(
		physics: PhysicsEngine,
		seedManager: SeedManager,
		soundManager: SoundManager,
		scene: THREE.Scene,
	): GameEngine {
		if (!this._instance)
			this._instance = new GameEngine(physics, seedManager, soundManager, scene);
		return this._instance;
	}

	private createGameBlock(blockData: (typeof Blocks)[0]): GameBlock {
		const platforms = blockData.blockElements.map((p) =>
			createGamePlatform(
				-1,
				this.scene,
				p.position,
				this.physics,
				this.seedManager,
				this.soundManager,
				p.size,
				p.lifeSpan,
				p.type,
			),
		);

		return new GameBlock(
			blockData.id,
			blockData.location,
			blockData.addDelay,
			blockData.stagger,
			platforms,
			this.physics,
			this.scene,
		);
	}

	private scheduleBlockActivations(currentTime: number) {
		// Schedule the first 4 blocks for activation
		Blocks.forEach((b, i) => {
			if (i < 4) {
				const activationTime = currentTime + (i === 0 ? 0 : b.addDelay * i);
				this.blockActivationTimes.set(b.id, activationTime);
			}
		});
	}

	private checkPendingActivations(currentTime: number) {
		this.blockActivationTimes.forEach((activationTime, blockId) => {
			if (currentTime >= activationTime) {
				const blockData = Blocks.find((b) => b.id === blockId);
				if (
					blockData &&
					!this.activeBlocks.find((ab) => blockData.location === ab.block.location)
				) {
					const block = this.createGameBlock(blockData);
					this.activeBlocks.push({ block, id: block.id });
					block.isActive = true;
					this.usedBlockIds.add(block.id);
					this.blockActivationTimes.delete(blockId);
				}
			}
		});
	}

	private getNextBlockData(oldBlock: GameBlock): (typeof Blocks)[0] | undefined {
		// If we're in endless phase, cycle through all blocks
		if (this.isEndlessPhase) {
			const availableBlocks = Blocks.filter((b) => b.location === oldBlock.location);

			if (availableBlocks.length > 0) {
				const nextBlockData =
					availableBlocks[Math.floor(Math.random() * availableBlocks.length)];
				// console.log("Endless phase - newBlock", nextBlockData);
				return nextBlockData;
			}
			return undefined;
		}

		// Normal phase: find unused block with same location
		const nextBlockData = Blocks.find(
			(b) => b.location === oldBlock.location && !this.usedBlockIds.has(b.id),
		);

		// If no unused blocks found, we've reached the endless phase
		if (!nextBlockData) {
			this.isEndlessPhase = true;
			// console.log("Entering endless phase");

			// Now try to get a block from endless phase
			return this.getNextBlockData(oldBlock);
		}

		if (nextBlockData) {
			this.usedBlockIds.add(nextBlockData.id);
		}

		return nextBlockData;
	}

	public restart() {
		// 1. Clean up and remove all currently active blocks
		// This involves destroying their physical bodies and removing them from the scene.
		for (const ab of this.activeBlocks) {
			// We assume the GameBlock class has a `destroy` method
			// to properly clean up its resources (platforms, etc.).
			ab.block.reset();
		}

		// 2. Clear all active block tracking arrays and maps
		this.activeBlocks = [];
		this.blockActivationTimes.clear();
		this.usedBlockIds.clear();

		// 3. Reset game state variables
		this.isEndlessPhase = false;
		this.initialTime = null; // This is crucial for the `update` loop to re-initialize the game

		// 4. Update the global store to reflect the cleared state
		useStore.setState({
			activeBlocks: [],
		});

		// console.log("GameEngine restarted.");
	}

	public update(time: number) {
		// Initialize start time on first update
		if (this.initialTime === null) {
			this.initialTime = time;
			this.scheduleBlockActivations(time);
		}

		// Check for pending block activations
		this.checkPendingActivations(time);

		// Use a reverse loop to safely remove items while iterating
		for (let i = this.activeBlocks.length - 1; i >= 0; i--) {
			const ab = this.activeBlocks[i];
			if (ab) {
				ab.block.update(time);

				if (!ab.block.isActive) {
					const nextBlockData = this.getNextBlockData(ab.block);
					if (nextBlockData) {
						// console.log(
						// 	`newBlock with id ${nextBlockData.id} and location ${nextBlockData.location} activated`
						// );

						// Create a fresh GameBlock instance
						const newBlock = this.createGameBlock(nextBlockData);

						// Remove old block from activeBlocks
						this.activeBlocks.splice(i, 1);

						// Activate the new block
						newBlock.isActive = true;
						this.activeBlocks.push({
							block: newBlock,
							id: newBlock.id,
						});
					}
				}
			}
		}
		useStore.setState({
			activeBlocks: this.activeBlocks.map((ab) => ({
				id: ab.id,
				location: ab.block.location,
			})),
		});
	}
}
