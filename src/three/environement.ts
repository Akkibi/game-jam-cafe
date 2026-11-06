import * as THREE from 'three/webgpu';
import { loadGLTFModel } from '../utils/loadGLTFModel';

export class Environement {
	private static instance: Environement;
	private scene: THREE.Scene;
	private instanceGroup: THREE.Group;

	private constructor(scene: THREE.Scene) {
		this.scene = scene;
		this.instanceGroup = new THREE.Group();
		this.scene.add(this.instanceGroup);
		loadGLTFModel(this.instanceGroup, '/assets/bounds/bounds.glb');

		this.createElevatorPlane();
	}

	private createElevatorPlane() {
		// Create a plane geometry for the elevator effect
		const geometry = new THREE.PlaneGeometry(0.8, 0.8);

		// Load texture for the elevator frames
		const textureLoader = new THREE.TextureLoader();
		const texture = textureLoader.load('/assets/elevator.png');

		// Create a material with transparency for elevator effect
		const material = new THREE.MeshBasicMaterial({
			map: texture,
			// color: "red",
			transparent: true,
			side: THREE.DoubleSide,
		});

		const mesh = new THREE.Mesh(geometry, material);

		// Position the plane under the steam wand
		mesh.position.set(-3.38, 2, -0.3);
		mesh.rotation.set(0, Math.PI * 0.5, 0);

		this.scene.add(mesh);
	}

	public static getInstance(scene: THREE.Scene): Environement {
		if (!Environement.instance) {
			Environement.instance = new Environement(scene);
		}
		return Environement.instance;
	}
}
