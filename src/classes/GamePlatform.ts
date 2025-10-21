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
		lifeSpan: number | null,
		type: string = "c"
	) {
		console.log("plateform type", type);

		// Define colors for each platform type
		let color: number;
		switch (type) {
			case "c":
				color = 0x000000; // Black - Coffee platform
				break;
			case "v":
				color = 0xff0000; // Red - Steam platform
				break;
			case "cg":
				color = 0x00ff00; // Green - Coffee Grinder
				break;
			case "l":
				color = 0x0000ff; // Blue - Line/waterfall
				break;
			default:
				color = 0xffffff; // White - Unknown type
				break;
		}

		const plateformMesh = new THREE.Mesh(
			new THREE.BoxGeometry(size.x, size.y, size.z),
			new THREE.MeshBasicMaterial({
				color: color,
			})
		);

		super(id, scene, physics, position, size, lifeSpan, plateformMesh);
	}
}
