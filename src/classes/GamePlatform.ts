import * as THREE from "three/webgpu";
import { Vector3 } from "three";
import { BaseSceneElement } from "./BaseSceneElement";
import type { PhysicsEngine } from "../matter/physics";

export class GamePlatform extends BaseSceneElement {
	constructor(
		id: number,
		scene: THREE.Scene,
		position: Vector3,
		physics: PhysicsEngine,
		size: Vector3,
		lifeSpan: number
	) {
		const plateformMesh = new THREE.Mesh(
			new THREE.BoxGeometry(size.x, size.y, size.z),
			new THREE.MeshBasicMaterial({ color: 0x000 })
		);

		super(id, scene, physics, position, size, lifeSpan, plateformMesh);
	}
}
