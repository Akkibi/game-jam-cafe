import * as THREE from 'three';
import { loadTexture } from './loadTexture';

type AnimationType = string[] | null;

class Animation {
	private material: THREE.MeshBasicMaterial;
	public speed: number; // in ms
	private deltatime: number = 0;
	private currentIndex: number = 0;
	public currentFrames: string[] | null;
	private loop: Array<THREE.Texture> = [];

	constructor(material: THREE.MeshBasicMaterial) {
		this.speed = 100;
		this.material = material;
		this.currentFrames = null;
		// Keeps map non-null so swapping frames never rebuilds the material.
		const placeholder = new THREE.DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1);
		placeholder.needsUpdate = true;
		this.material.map = placeholder;
	}

	public setSpeed = (speed: number) => {
		this.speed = speed;
	};

	public setFrame = (frame: number) => {
		this.currentIndex = frame;
		this.deltatime = Infinity;
	};

	public set = async (animData: AnimationType) => {
		this.currentFrames = animData;
		const loop = await Promise.all((animData ?? []).map(loadTexture));
		// A newer animation was requested while this one was loading.
		if (this.currentFrames !== animData) return;

		loop.forEach((texture) => (texture.colorSpace = THREE.SRGBColorSpace));
		this.currentIndex = 0;
		this.loop = loop;
	};

	public update = (deltatime: number) => {
		this.deltatime += deltatime;
		if (this.deltatime < this.speed) return;
		this.deltatime = 0;

		if (this.loop.length > 0) {
			this.material.map = this.loop[this.currentIndex];

			this.currentIndex++;
			if (this.currentIndex >= this.loop.length) {
				this.currentIndex = 0;
			}
		}
	};
}

export default Animation;
