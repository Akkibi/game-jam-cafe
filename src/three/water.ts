import * as THREE from 'three/webgpu';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import fragmentFloorShader from './shaders/water-floor.frag';
import fragmentFallShader from './shaders/water-fall.frag';
import vertexFallShader from './shaders/water-fall.vert';
import vertexFloorShader from './shaders/water-floor.vert';
// singleton class that imports a water mesh from a gltf file
// imports frag and vert shaders from shaders folder
export class Water {
	private static instance: Water;
	private waterFallMaterial: THREE.ShaderMaterial | null = null;
	private waterFloorMaterial: THREE.ShaderMaterial | null = null;
	private scene: THREE.Scene;

	private constructor(scene: THREE.Scene) {
		this.scene = scene;
		this.loadWaterMesh();
	}

	public static getInstance(scene: THREE.Scene): Water {
		if (!Water.instance) {
			Water.instance = new Water(scene);
		}
		return Water.instance;
	}

	public update(time: number) {
		// console.log(time)
		if (!this.waterFallMaterial || !this.waterFloorMaterial) return;

		this.waterFallMaterial.uniforms.u_time.value = time;
		this.waterFloorMaterial.uniforms.u_time.value = time;
	}

	private async loadWaterMesh() {
		const loader = new GLTFLoader();
		const gltf = await loader.loadAsync('/assets/water.glb');
		gltf.scene.scale.multiplyScalar(0.3);
		gltf.scene.position.y = -0.5;
		this.scene.add(gltf.scene);
		gltf.scene.children.forEach((child) => {
			if (child.name === 'fall') {
				this.waterFallMaterial = new THREE.ShaderMaterial({
					vertexShader: vertexFallShader,
					fragmentShader: fragmentFallShader,
					uniforms: {
						u_time: { value: 0 },
					},
				});
				(child as THREE.Mesh).material = this.waterFallMaterial;
			} else if (child.name === 'floor') {
				this.waterFloorMaterial = new THREE.ShaderMaterial({
					vertexShader: vertexFloorShader,
					fragmentShader: fragmentFloorShader,
					uniforms: {
						u_time: { value: 0 },
					},
				});
				(child as THREE.Mesh).material = this.waterFloorMaterial;
			} else {
				(child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
					color: 0xaa5500,
				});
			}
		});
	}
}
