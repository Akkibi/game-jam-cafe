import { Vector3 } from "three";
import { BaseSceneElement } from "../BaseSceneElement";
import * as THREE from "three/webgpu";
import type { PhysicsEngine } from "../../matter/physics";
import type { SeedManager } from "../../three/seedManager";
import { loadGLTFModel } from "../../utils/loadGLTFModel";

export class CoffeeGrinderPlatform extends BaseSceneElement {
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
		loadGLTFModel(platformGroup, "/assets/models/grinder_platform.glb");
		loadGLTFModel(
			platformGroup,
			"/assets/models/grinder.glb",
			new Vector3(0.1, -18.5, -0.2)
		);

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

	public addToScene(): void {
		super.addToScene();
		this.addSeed();
	}
}
