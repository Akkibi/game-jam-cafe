import { Vector3 } from 'three';
import { BaseSceneElement } from '../BaseSceneElement';
import * as THREE from 'three/webgpu';
import { loadGLTFModel } from '../../utils/loadGLTFModel';
import type { Seed } from '../../three/seed';

export class SimplePlatformCoffee extends BaseSceneElement {
	private seed: Seed | null = null;

	constructor(
		id: number,
		scene: THREE.Scene,
		position: Vector3,
		size: Vector3,
		lifeSpan: number | null,
		platformGroup: THREE.Group,
	) {
		loadGLTFModel(platformGroup, '/assets/models/grinder_platform.glb');

		super(id, scene, position, size, lifeSpan, platformGroup);
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
