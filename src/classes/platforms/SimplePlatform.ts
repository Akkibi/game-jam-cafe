import { Vector3 } from 'three';
import { BaseSceneElement } from '../BaseSceneElement';
import * as THREE from 'three/webgpu';
import type { PhysicsEngine } from '../../matter/physics';
import type { SeedManager } from '../../three/seedManager';
import { loadGLTFModel } from '../../utils/loadGLTFModel';
import type { SoundManager } from '../../sounds/soundManager';

export class SimplePlatform extends BaseSceneElement {
  constructor(
    id: number,
    scene: THREE.Scene,
    position: Vector3,
    physics: PhysicsEngine,
    seedManager: SeedManager,
    soundManager: SoundManager,
    size: Vector3,
    lifeSpan: number | null,
    platformGroup: THREE.Group,
  ) {
    loadGLTFModel(platformGroup, '/assets/models/grinder_platform.glb');

    super(id, scene, physics, seedManager, soundManager, position, size, lifeSpan, platformGroup);
  }
}
