import * as Three from "three";
import { Vector3 } from "three";
import { PhysicsEngine } from "../matter/physics";
import type { SeedManager } from "../three/seedManager";
import gsap from "gsap";

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
	protected timestampAdded: number = 0;
	protected group: Three.Group;
	private object: Matter.Body | null = null;
	private trembleTween: gsap.core.Tween | null = null;
	private originalPosition: Vector3 = new Vector3();
	public isRemoving: boolean = false;

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

		this.group.position.x = position.x;
		this.group.position.y = 3;
		this.group.position.z = position.z;
	}

	protected addSeed() {
		console.log("addSeed");
		const seedPosition = new Three.Vector3();

		seedPosition.copy(this.position);
		seedPosition.add(new Vector3(0, 0.3, 0));
		return this.seedManager.addSeed(seedPosition);
	}

	public addToScene(onComplete?: () => void) {
		this.scene.add(this.group);
		this.timestampAdded = 0;
		this.isActive = true;

		console.log("addToScene - Element with id: ", this.id, " activated");

		gsap.to(this.group.position, {
			y: this.position.y,
			ease: "back.out",
			duration: 2,
			onComplete: () => {
				this.object = this.physics.addObject(this.position, this.size);
				if (onComplete) {
					onComplete();
				}
			},
		});
	}

	private startTrembling() {
		if (this.trembleTween) return;

		this.originalPosition.copy(this.group.position);
		const trembleAmount = 0.05;
		const trembleSpeed = 0.05;

		const tremble = () => {
			this.trembleTween = gsap.to(this.group.position, {
				x:
					this.originalPosition.x +
					(Math.random() - 0.5) * trembleAmount,
				z:
					this.originalPosition.z +
					(Math.random() - 0.5) * trembleAmount,
				duration: trembleSpeed,
				ease: "power1.inOut",
				onComplete: tremble,
			});
		};

		tremble();
	}

	private stopTrembling() {
		if (this.trembleTween) {
			this.trembleTween.kill();
			this.trembleTween = null;
			this.group.position.copy(this.originalPosition);
		}
	}

	public removeFromScene() {
		console.log("BaseSceneRemoveFrom");
		if (!this.isActive) return;
		this.stopTrembling();

		gsap.to(this.group.position, {
			y: 5,
			ease: "back.out",
			duration: 2,
			onStart: () => {
				this.isRemoving = true;
				if (this.object) this.physics.removeObject(this.object);
			},
			onComplete: () => {
				this.scene.remove(this.group);
				this.reset();
			},
		});

		console.log("Plateform removed.");
	}

	public reset(): void {
		console.log("BaseSceneReset");
		this.isActive = false;
		this.timestampAdded = 0;
		this.isMoving = false;
		this.isRemoving = false;
		this.direction.set(0, 0, 0);

		gsap.killTweensOf(this.group.position);

		this.stopTrembling();

		if (this.object) {
			this.physics.removeObject(this.object);
			this.object = null;
		}

		if (this.group.parent) {
			this.scene.remove(this.group);
		}

		this.group.position.x = this.position.x;
		this.group.position.y = 3; // The initial "hidden" y-position
		this.group.position.z = this.position.z;

		this.group.visible = true;

		console.log(`BaseSceneElement with id: ${this.id} has been reset.`);
	}

	public update(time: number) {
		if (!this.isActive) return;
		if (this.timestampAdded === 0) this.timestampAdded = time;

		const timeElapsed = time - this.timestampAdded;
		if (this.lifeSpan) {
			if (timeElapsed > this.lifeSpan * 0.8) this.startTrembling();

			if (
				time - this.timestampAdded > this.lifeSpan &&
				!this.isRemoving
			) {
				this.removeFromScene();
			}
		}
	}
}
