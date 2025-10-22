import * as THREE from "three/webgpu";
import type { PhysicsEngine } from "../matter/physics";
import type { BaseSceneElement } from "./BaseSceneElement";

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
	private allElementsFullyAdded: boolean = false; // NEW FLAG

	constructor(
		id: number,
		location: number,
		addDelay: number,
		stagger: number,
		platforms: BaseSceneElement[],
		physics: PhysicsEngine,
		scene: THREE.Scene
	) {
		this.id = id;
		this.location = location;
		this.addDelay = addDelay;
		this.stagger = stagger;
		this.blockElements = platforms;
		this.physics = physics;
		// this.seedManager = seedManager;
		this.scene = scene;
	}

	public getPlatforms(): BaseSceneElement[] {
		return this.blockElements;
	}

	private addObjects() {
		if (this.hasAddedObjects) return;
		this.hasAddedObjects = true;

		console.log(`addObjects of block ${this.id}`);

		this.blockElements.forEach((e, i) => {
			const delay = this.stagger * i * 1000;

			if (i === 0) {
				// console.log(`addElement ${i} of block ${this.id}`);
				e.addToScene();
				this.activeElements.push({ elem: e, id: i });
			} else {
				setTimeout(() => {
					// console.log(
					// 	`addElement ${i} of block ${this.id} after ${delay}ms`
					// );
					e.addToScene();
					this.activeElements.push({ elem: e, id: i });

					// Mark as fully added when last element is added
					if (i === this.blockElements.length - 1) {
						this.allElementsFullyAdded = true;
					}
				}, delay * Math.random());
			}
		});

		// If no stagger (all added immediately), mark as fully added
		if (this.stagger === 0 || this.blockElements.length === 1) {
			this.allElementsFullyAdded = true;
		}
	}

	public update(time: number) {
		if (!this.isActive) return;

		// Add objects only once when block becomes active
		if (!this.hasAddedObjects) {
			this.addObjects();
		}

		// Update all active elements
		this.activeElements.forEach((ae) => {
			ae.elem.update(time);
		});

		// Only check for completion AFTER all elements are fully added
		if (this.allElementsFullyAdded) {
			const allInactive = this.activeElements.every(
				(ae) => !ae.elem.isActive
			);

			if (allInactive && this.activeElements.length > 0) {
				console.log(
					`Block ${this.id} completed - all elements inactive`
				);
				this.isActive = false;
			}
		}
	}
}
