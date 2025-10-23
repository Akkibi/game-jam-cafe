import * as THREE from "three/webgpu";
import { Vector3 } from "three";
import type { PhysicsEngine } from "../../matter/physics";
import type { SeedManager } from "../../three/seedManager";
import type { BaseSceneElement } from "../BaseSceneElement";
import { SteamWandPlatform } from "./SteamWandPlatform";
import { CoffeeGrinderPlatform } from "./CoffeeGrinderPlatform";
import { SimplePlatformCoffee } from "./SimplePlatformCoffee";
import { SimplePlatform } from "./SimplePlatform";
import type { SoundManager } from "../../sounds/soundManager";

export function createGamePlatform(
	id: number,
	scene: THREE.Scene,
	position: Vector3,
	physics: PhysicsEngine,
	seedManager: SeedManager,
	soundManager: SoundManager,
	size: Vector3,
	lifeSpan: number | null,
	type: string = "pc"
): BaseSceneElement {
	// Define colors for each platform type
	let newPlatform: BaseSceneElement;
	switch (type) {
		case "pc":
			newPlatform = new SimplePlatformCoffee(
				id,
				scene,
				position,
				physics,
				seedManager,
				soundManager,
				size,
				lifeSpan,
				new THREE.Group()
			);
			break;
		case "pv":
			newPlatform = new SteamWandPlatform(
				id,
				scene,
				position,
				physics,
				seedManager,
				soundManager,

				size,
				lifeSpan,
				new THREE.Group()
			);
			break;
		case "pcg":
			newPlatform = new CoffeeGrinderPlatform(
				id,
				scene,
				position,
				physics,
				seedManager,
				soundManager,

				size,
				lifeSpan,
				new THREE.Group()
			);
			break;
		default:
			newPlatform = new SimplePlatform(
				id,
				scene,
				position,
				physics,
				seedManager,
				soundManager,

				size,
				lifeSpan,
				new THREE.Group()
			);
	}

	return newPlatform;
}
