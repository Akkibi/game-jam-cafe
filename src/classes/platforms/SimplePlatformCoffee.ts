import { Vector3 } from "three";
import { BaseSceneElement } from "../BaseSceneElement";
import * as THREE from "three/webgpu";
import type { PhysicsEngine } from "../../matter/physics";
import type { SeedManager } from "../../three/seedManager";
import { loadGLTFModel } from "../../utils/loadGLTFModel";
import type { Seed } from "../../three/seed";
import type { SoundManager } from "../../sounds/soundManager";

export class SimplePlatformCoffee extends BaseSceneElement {
	private seed: Seed | null = null;

	constructor(
		id: number,
		scene: THREE.Scene,
		position: Vector3,
		physics: PhysicsEngine,
		seedManager: SeedManager,
		soundManager: SoundManager,
		size: Vector3,
		lifeSpan: number | null,
		platformGroup: THREE.Group
	) {
		loadGLTFModel(platformGroup, "/assets/models/grinder_platform.glb");

		super(
			id,
			scene,
			physics,
			seedManager,
			soundManager,
			position,
			size,
			lifeSpan,
			platformGroup
		);
	}

	public addToScene(): void {
		const onComplete = () => {
			this.seed = this.addSeed();
		};

		super.addToScene(onComplete);
	}

	public removeFromScene(): void {
		this.seed?.destroy();
		this.seed = null;

		super.removeFromScene();
	}
}
