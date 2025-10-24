import { Vector3 } from 'three';
import { BaseSceneElement } from '../BaseSceneElement';
import * as THREE from 'three/webgpu';
import { loadGLTFModel } from '../../utils/loadGLTFModel';

export class SimplePlatform extends BaseSceneElement {
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
}
