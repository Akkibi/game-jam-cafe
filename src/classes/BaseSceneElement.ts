import * as Three from "three";
import { Vector3 } from "three";
import type { PhysicsEngine } from "../matter/physics";

export class BaseSceneElement {
	private id: number = -1;
	protected scene: Three.Scene;
	protected physics: PhysicsEngine;
	public position: Vector3;
	public size: Vector3;
	protected isMoving: boolean;
	protected direction: Vector3;
	protected lifeSpan: number;
	protected mesh: Three.Mesh;
	private object: Matter.Body | null = null;
	private blinkInterval: number | null = null;
	private removalTimeout: number | null = null;

	constructor(
		id: number,
		scene: Three.Scene,
		physics: PhysicsEngine,
		position: Vector3,
		size: Vector3,
		lifeSpan: number,
		mesh: Three.Mesh
	) {
		this.id = id;
		this.scene = scene;
		this.physics = physics;
		this.position = position;
		this.size = size;
		this.lifeSpan = lifeSpan;
		this.isMoving = false;
		this.direction = new Vector3();
		this.mesh = mesh;

		this.mesh.position.copy(this.position);
	}

	public addToScene() {
		this.scene.add(this.mesh);
		this.object = this.physics.addObject(this.position, this.size);

		// Start blinking when 80% of lifespan has passed
		const blinkStartTime = this.lifeSpan * 0.8;

		setTimeout(() => {
			this.startBlinking();
		}, blinkStartTime);

		this.removalTimeout = window.setTimeout(() => {
			this.removeFromScene();
		}, this.lifeSpan);
	}

	private startBlinking() {
		let isVisible = true;
		const blinkSpeed = 150; // milliseconds between blinks

		this.blinkInterval = window.setInterval(() => {
			isVisible = !isVisible;
			this.mesh.visible = isVisible;
		}, blinkSpeed);
	}

	private stopBlinking() {
		if (this.blinkInterval !== null) {
			clearInterval(this.blinkInterval);
			this.blinkInterval = null;
		}
		this.mesh.visible = true;
	}

	public removeFromScene() {
		this.stopBlinking();

		if (this.removalTimeout !== null) {
			clearTimeout(this.removalTimeout);
			this.removalTimeout = null;
		}

		this.scene.remove(this.mesh);
		if (this.object) this.physics.removeObject(this.object);
	}
}
