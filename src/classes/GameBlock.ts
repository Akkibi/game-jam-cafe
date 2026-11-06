import * as THREE from 'three/webgpu';
import type { PhysicsEngine } from '../matter/physics';
import type { BaseSceneElement } from './BaseSceneElement';

export class GameBlock {
	public id: number;
	public location: number;
	public addDelay: number;
	public stagger: number;
	public blockElements: BaseSceneElement[] = [];
	public physics: PhysicsEngine;

	public scene: THREE.Scene;
	public isActive: boolean = false;
	public activeElements: { elem: BaseSceneElement; id: number }[] = [];
	public hasAddedObjects: boolean = false;
	private allElementsFullyAdded: boolean = false;

	// Time-based scheduling properties
	private elementActivationTimes: Map<number, number> = new Map();
	private pendingElementIndices: Set<number> = new Set();

	constructor(
		id: number,
		location: number,
		addDelay: number,
		stagger: number,
		platforms: BaseSceneElement[],
		physics: PhysicsEngine,
		scene: THREE.Scene,
	) {
		this.id = id;
		this.location = location;
		this.addDelay = addDelay;
		this.stagger = stagger;
		this.blockElements = platforms;
		this.physics = physics;
		this.scene = scene;
	}

	public getPlatforms(): BaseSceneElement[] {
		return this.blockElements;
	}

	private scheduleElementActivations(currentTime: number) {
		// console.log(`Scheduling elements for block ${this.id}`);

		this.blockElements.forEach((_e, i) => {
			if (i === 0) {
				// First element activates immediately
				this.elementActivationTimes.set(i, currentTime);
			} else {
				// Calculate activation time with random delay
				const baseDelay = this.stagger * i;
				const randomDelay = baseDelay * Math.random();
				this.elementActivationTimes.set(i, currentTime + randomDelay);
			}
			this.pendingElementIndices.add(i);
		});
	}

	private checkPendingElements(currentTime: number) {
		// Check each pending element to see if it's time to activate
		this.pendingElementIndices.forEach((index) => {
			const activationTime = this.elementActivationTimes.get(index);

			if (activationTime !== undefined && currentTime >= activationTime) {
				const element = this.blockElements[index];

				if (element) {
					element.addToScene();
					this.activeElements.push({ elem: element, id: index });
					this.pendingElementIndices.delete(index);

					// Mark as fully added when last element is added
					if (this.pendingElementIndices.size === 0) {
						this.allElementsFullyAdded = true;
					}
				}
			}
		});
	}

	private addObjects(currentTime: number) {
		if (this.hasAddedObjects) return;
		this.hasAddedObjects = true;

		// console.log(`addObjects of block ${this.id}`);

		// Schedule all element activations
		this.scheduleElementActivations(currentTime);

		// If no stagger (all added immediately), mark as fully added
		if (this.stagger === 0 || this.blockElements.length === 1) {
			this.allElementsFullyAdded = true;
		}
	}

	public reset(): void {
		this.isActive = false;
		this.hasAddedObjects = false;
		this.allElementsFullyAdded = false;
		this.activeElements = [];
		this.elementActivationTimes.clear();
		this.pendingElementIndices.clear();

		this.blockElements.forEach((be) => be.reset());
	}

	public update(time: number) {
		if (!this.isActive) return;

		// Add objects only once when block becomes active
		if (!this.hasAddedObjects) {
			this.addObjects(time);
		}

		// Check for pending elements that need to be activated
		if (this.pendingElementIndices.size > 0) {
			this.checkPendingElements(time);
		}

		// Update all active elements
		this.activeElements.forEach((ae) => {
			ae.elem.update(time);
		});

		// Only check for completion AFTER all elements are fully added
		if (this.allElementsFullyAdded) {
			const allInactive = this.activeElements.every((ae) => !ae.elem.isActive);

			if (allInactive && this.activeElements.length > 0) {
				// console.log(
				// 	`Block ${this.id} completed - all elements inactive`
				// );
				this.isActive = false;
			}
		}
	}
}
