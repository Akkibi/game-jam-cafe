import * as Three from "three";
import { Vector3 } from "three";
import { PhysicsEngine } from "../matter/physics";

export class BaseSceneElement {
	private id: number = -1;
	protected scene: Three.Scene;
	protected physics: PhysicsEngine;
	public position: Vector3;
	public size: Vector3;
	public isActive: boolean;
	protected isMoving: boolean;
	protected direction: Vector3;
	public lifeSpan: number | null;
	private timestampAdded: number = 0;
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
		lifeSpan: number | null,
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
		this.isActive = false;

		this.mesh.position.copy(this.position);
	}

	public addToScene() {
		this.scene.add(this.mesh);
		this.object = this.physics.addObject(this.position, this.size);

		// if (this.lifeSpan)
		// 	this.removalTimeout = window.setTimeout(() => {
		// 		this.removeFromScene();
		// 	}, this.lifeSpan);

		this.isActive = true;
	}

	private startBlinking() {
		console.log("Removing plateform.");
		if (this.blinkInterval != null) return;
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
		if (!this.isActive) return;
		this.stopBlinking();

		if (this.removalTimeout !== null) {
			clearTimeout(this.removalTimeout);
			this.removalTimeout = null;
		}

		this.scene.remove(this.mesh);
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
