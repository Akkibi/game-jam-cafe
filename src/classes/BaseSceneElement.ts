import * as Three from "three";
import { Vector3 } from "three";
import { PhysicsEngine } from "../matter/physics";
import type { SeedManager } from "../three/seedManager";

export class BaseSceneElement {
	public id: number = -1;
	protected scene: Three.Scene;
	protected physics: PhysicsEngine;
	protected seedManager: SeedManager;
	public position: Vector3;
	public size: Vector3;
	public isActive: boolean;
	protected isMoving: boolean;
	protected direction: Vector3;
	public lifeSpan: number | null;
	private timestampAdded: number = 0;
	protected group: Three.Group;
	private object: Matter.Body | null = null;
	private blinkInterval: number | null = null;
	private removalTimeout: number | null = null;

	constructor(
		id: number,
		scene: Three.Scene,
		physics: PhysicsEngine,
		seedManager: SeedManager,
		position: Vector3,
		size: Vector3,
		lifeSpan: number | null,
		group: Three.Group
	) {
		this.id = id;
		this.scene = scene;
		this.physics = physics;
		this.seedManager = seedManager;
		this.position = position;
		this.size = size;
		this.lifeSpan = lifeSpan;
		this.isMoving = false;
		this.direction = new Vector3();
		this.group = group;
		this.isActive = false;

		this.group.position.copy(this.position);
	}

	protected addSeed() {
		const seedPosition = new Three.Vector3();

		seedPosition.copy(this.position);
		seedPosition.add(new Vector3(0, 0.3, 0));
		this.seedManager.addSeed(seedPosition);
	}

	public addToScene() {
		this.scene.add(this.group);
		this.object = this.physics.addObject(this.position, this.size);
		this.timestampAdded = 0;

		// if (this.lifeSpan)
		// 	this.removalTimeout = window.setTimeout(() => {
		// 		this.removeFromScene();
		// 	}, this.lifeSpan);

		this.isActive = true;
	}

	private startBlinking() {
		if (this.blinkInterval != null) return;
		console.log("Removing plateform.");
		let isVisible = true;
		const blinkSpeed = 150; // milliseconds between blinks

		this.blinkInterval = window.setInterval(() => {
			isVisible = !isVisible;
			this.group.visible = isVisible;
		}, blinkSpeed);
	}

	private stopBlinking() {
		if (this.blinkInterval !== null) {
			clearInterval(this.blinkInterval);
			this.blinkInterval = null;
		}
		this.group.visible = true;
	}

	public removeFromScene() {
		if (!this.isActive) return;
		this.stopBlinking();

		if (this.removalTimeout !== null) {
			clearTimeout(this.removalTimeout);
			this.removalTimeout = null;
		}

		this.scene.remove(this.group);
		if (this.object) this.physics.removeObject(this.object);

		this.isActive = false;
		console.log("Plateform removed.");
	}

	public update(time: number) {
		if (!this.isActive) return;
		if (this.timestampAdded === 0) this.timestampAdded = time;

		const timeElapsed = time - this.timestampAdded;
		if (this.lifeSpan) {
			if (timeElapsed > this.lifeSpan * 0.8) this.startBlinking();

			if (time - this.timestampAdded > this.lifeSpan) {
				this.removeFromScene();
			}
		}
	}
}
