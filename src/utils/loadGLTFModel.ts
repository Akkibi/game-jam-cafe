import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three/webgpu';

const loader = new GLTFLoader();
const cache = new Map<string, Promise<GLTF>>();

function loadOnce(url: string): Promise<GLTF> {
	let gltf = cache.get(url);
	if (!gltf) {
		gltf = loader.loadAsync(url);
		gltf.catch(() => cache.delete(url));
		cache.set(url, gltf);
	}
	return gltf;
}

export function preloadModels(urls: string[]): void {
	urls.forEach((url) => {
		loadOnce(url).catch((error) => console.error(`Failed to load ${url}`, error));
	});
}

// Clones share geometry and materials, so spawning a platform costs no parsing or GPU upload.
export async function loadGLTFModel(
	group: THREE.Group,
	url: string,
	positionCorrection?: THREE.Vector3,
): Promise<THREE.Group> {
	const gltf = await loadOnce(url);
	const model = [...gltf.scene.clone(true).children];
	if (positionCorrection != null) {
		model.forEach((m) => m.position.add(positionCorrection));
	}
	group.add(...model);
	return group;
}
