// has a list of seeds
// updates them all every frame
// has a public function deleteSeed(id)
// has a public function addSeed(position, id)
import { useStore } from "../store/globalStore";
import * as THREE from "three/webgpu";
import { Seed } from "./seed";
import { Player } from "./player";
import { SoundManager } from "../sounds/soundManager";
import { getRandomMangerSound } from "../sounds/sounds";

export class SeedManager {
	private static instance: SeedManager;
	private seeds: Seed[];
	private player: Player;
	private scene: THREE.Scene;

	constructor(player: Player, scene: THREE.Scene) {
		this.seeds = [];
		this.player = player;
		this.scene = scene;
	}

	public restart() {
		// console.log("seeds before restart: ", this.seeds.length);
		// Iterate backwards to safely remove from scene
		while (this.seeds.length > 0) {
			const seed = this.seeds.pop(); // Remove from array
			if (seed) {
				this.scene.remove(seed.group);
			}
		}
		// console.log("seeds after restart: ", this.seeds.length);
	}

	public static getInstance(player: Player, scene: THREE.Scene): SeedManager {
		if (!SeedManager.instance) {
			SeedManager.instance = new SeedManager(player, scene);
		}
		return SeedManager.instance;
	}

	public addSeed(position: THREE.Vector3) {
		const seed = new Seed(position, this.seeds, this.scene);
		this.seeds.push(seed);
		// console.log("seeds: ", this.seeds);
		return seed;
	}

	public update(time: number) {
		this.seeds.forEach((seed) => seed.update(time));
		this.seeds.forEach((seed) => {
			if (seed.position.distanceTo(this.player.getPosition()) < 0.3) {
				seed.destroy();
				if (useStore.getState().caffeineLvl + 20 >= 100) {
					useStore.setState({ caffeineLvl: 100 });
				} else {
					useStore.setState({
						caffeineLvl: useStore.getState().caffeineLvl + 10,
					});
				}
				this.player.eat();
				SoundManager.getInstance().play(getRandomMangerSound(), {
					volume: 0.2,
				});
			}
		});
	}
}
