import { Vector3 } from "three";
import { BaseSceneElement } from "../BaseSceneElement";
import * as THREE from "three/webgpu";
import type { PhysicsEngine } from "../../matter/physics";
import type { SeedManager } from "../../three/seedManager";
import { loadGLTFModel } from "../../utils/loadGLTFModel";

export class SteamWandPlatform extends BaseSceneElement {
	constructor(
		id: number,
		scene: THREE.Scene,
		position: Vector3,
		physics: PhysicsEngine,
		seedManager: SeedManager,
		size: Vector3,
		lifeSpan: number | null,
		platformGroup: THREE.Group
	) {
		loadGLTFModel(
			platformGroup,
			"/assets/models/steamwand.glb",
			new Vector3(0, -0.2, 0)
		);
		loadGLTFModel(platformGroup, "/assets/models/sugar_platform.glb");

		super(
			id,
			scene,
			physics,
			seedManager,
			position,
			size,
			lifeSpan,
			platformGroup
		);
	}
}
