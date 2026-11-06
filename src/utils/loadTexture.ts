import * as THREE from 'three/webgpu';

type CachedTexture = { texture: THREE.Texture; ready: Promise<THREE.Texture> };

const loader = new THREE.TextureLoader();
const cache = new Map<string, CachedTexture>();

function loadOnce(src: string): CachedTexture {
	let entry = cache.get(src);
	if (!entry) {
		let texture!: THREE.Texture;
		const ready = new Promise<THREE.Texture>((resolve, reject) => {
			texture = loader.load(src, resolve, undefined, reject);
		});
		entry = { texture, ready };
		cache.set(src, entry);
	}
	return entry;
}

export const getTexture = (src: string): THREE.Texture => loadOnce(src).texture;

export const loadTexture = (src: string): Promise<THREE.Texture> => loadOnce(src).ready;
