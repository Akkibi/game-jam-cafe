import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import * as THREE from 'three/webgpu';

export async function loadGLTFModel(
  group: THREE.Group,
  url: string,
): Promise<THREE.Group> {
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      gltf => {
        const model = gltf.scene.children;
        group.add(...model);
        resolve(group);
      },
      undefined,
      error => reject(error)
    );
  });
}
