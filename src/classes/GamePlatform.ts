import * as THREE from "three/webgpu";
import { Vector3 } from "three";
import { BaseSceneElement } from "./BaseSceneElement";
import type { PhysicsEngine } from "../matter/physics";
import { loadGLTFModel } from "../utils/loadGLTFModel";

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
		// Define colors for each platform type
		const plateformGroup = new THREE.Group();
		switch (type) {
			case "c":
				loadGLTFModel(
					plateformGroup,
					"/assets/models/plateformemeule.glb",
					0
				);
				break;
			case "v":
				loadGLTFModel(plateformGroup, "/assets/models/tuyau.glb", 0);
				loadGLTFModel(plateformGroup, "/assets/models/sucre.glb", 0);
				break;
			case "cg":
				loadGLTFModel(
					plateformGroup,
					"/assets/models/plateformemeule.glb",
					0
				);
				loadGLTFModel(plateformGroup, "/assets/models/meule.glb", 0);
				break;
			// case "l":
			// 	color = 0x0000ff; // Blue - Line/waterfall
			// 	break;
			default:
				loadGLTFModel(
					plateformGroup,
					"/assets/models/plateformemeule.glb",
					0
				);
				break;
		}

		super(id, scene, physics, position, size, lifeSpan, plateformGroup);
	}
}
