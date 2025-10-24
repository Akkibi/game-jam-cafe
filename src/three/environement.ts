import * as THREE from 'three/webgpu';
import { loadGLTFModel } from '../utils/loadGLTFModel';
import { PhysicsEngine } from '../matter/physics';

export class Environement {
	private static instance: Environement;
	private scene: THREE.Scene;
	private instanceGroup: THREE.Group;
	private physicsEngine: PhysicsEngine;

	private constructor(scene: THREE.Scene) {
		this.scene = scene;
		this.instanceGroup = new THREE.Group();
		this.scene.add(this.instanceGroup);
		this.physicsEngine = PhysicsEngine.getInstance();
		loadGLTFModel(this.instanceGroup, '/assets/bounds/bounds.glb');

		this.createElevatorPlane();
		const wall1Position = new THREE.Vector3(-3.4, 0, 0);
		const wall1Scale = new THREE.Vector3(0.1, 10, 0);
		const wall2Position = new THREE.Vector3(3.4, 0, 0);
		// const wall3Position = new THREE.Vector3(0, 1.9, 0);
		// const wall3Scale = new THREE.Vector3(4.1, 0.11, 0);
		this.physicsEngine.addObject(wall1Position, wall1Scale);
		this.physicsEngine.addObject(wall2Position, wall1Scale);
		// this.physicsEngine.addObject(wall3Position, wall3Scale);

		const boxPosition = new THREE.Vector3(0, -1, 0);
		const boxScale = new THREE.Vector3(0.1, 0.1, 0.1);
		this.physicsEngine.addObject(boxPosition, boxScale, 0, true);
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
