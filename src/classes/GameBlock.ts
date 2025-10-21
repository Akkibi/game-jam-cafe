import * as THREE from "three/webgpu";
import type { GamePlatform } from "./GamePlatform";
import type { PhysicsEngine } from "../matter/physics";
import type { BaseSceneElement } from "./BaseSceneElement";

export class GameBlock {
	private id: number;
	private addDelay: number;
	public stagger: number;
	public blockElements: GamePlatform[] = [];
	private physics: PhysicsEngine;
	private scene: THREE.Scene;
	public isActive: boolean = false;
	public activeElements: { elem: BaseSceneElement; id: number }[] = [];
	private tmpLastObjAdded: number = 0;

	constructor(
		id: number,
		addDelay: number,
		stagger: number,
		platforms: GamePlatform[],
		physics: PhysicsEngine,
		scene: THREE.Scene
	) {
		this.id = id;
		this.addDelay = addDelay;
		this.stagger = stagger;
		this.blockElements = platforms;
		this.physics = physics;
		this.scene = scene;
	}

	public getPlatforms(): GamePlatform[] {
		return this.blockElements;
	}

	public setBlockActive(): void {
		setTimeout(() => {
			this.isActive = true;
		}, this.addDelay * this.id);
	}

	// private addNextObject() {
	// 	if (!this.blockElements || this.blockElements.length === 0) {
	// 		console.error(`The block ${this.id} is empty.`);
	// 		return;
	// 	}
	// 	if (this.activeElement == null) {
	// 		this.blockElements[0].addToScene();
	// 		this.activeElement = {
	// 			elem: this.blockElements[0],
	// 			id: 0,
	// 		};
	// 	} else if (this.blockElements.length > this.activeElement.id + 1) {
	// 		this.activeElement.elem =
	// 			this.blockElements[this.activeElement.id + 1];
	// 	} else {
	// 		this.isActive = false;
	// 	}
	// }

	private addObjects() {
		console.log(`addObjects of block ${this.id}`);
		this.blockElements.forEach((e, i) => {
			console.log("i", i);
			if (i === 0) {
				console.log(`addElement ${i} of block ${this.id}`);
				e.addToScene();
				this.activeElements.push({ elem: e, id: i });
			} else {
				setTimeout(
					() => {
						console.log(`addElement ${i} of block ${this.id}`);
						e.addToScene();
						this.activeElements.push({ elem: e, id: i });
					},
					this.stagger * i * 1000
				);
			}
		});
	}

	public update(time: number) {
		if (!this.isActive) return;
		if (this.tmpLastObjAdded === 0) this.tmpLastObjAdded = time;

		// const timeElapsed = time - this.tmpLastObjAdded;

		if (this.activeElements.length === 0) this.addObjects();
		else
			this.activeElements.forEach((ae) => {
				ae.elem.update(time);
			});
	}
}
