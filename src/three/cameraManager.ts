import * as THREE from "three/webgpu";
import { mapCoords, PhysicsEngine } from "../matter/physics";

export class CameraManager {
	private static instance: CameraManager;
	private camera: THREE.PerspectiveCamera;
	private cameraGroup: THREE.Group;
	private physicsEngine: PhysicsEngine;
	private targetPosition: THREE.Vector3;

	private constructor(scene: THREE.Scene) {
		this.camera = new THREE.PerspectiveCamera(
			40,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		this.cameraGroup = new THREE.Group();
		this.cameraGroup.position.set(0, 0, 0);
		scene.add(this.cameraGroup);
		this.camera.position.set(0, 0, 7);
		this.targetPosition = new THREE.Vector3(0, 0, 0);
		this.cameraGroup.add(this.camera);

		window.addEventListener("resize", () => {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
		});
		this.physicsEngine = PhysicsEngine.getInstance();
	}

	public static getInstance(scene: THREE.Scene): CameraManager {
		if (!CameraManager.instance) {
			CameraManager.instance = new CameraManager(scene);
		}
		return CameraManager.instance;
	}

	public getCamera(): THREE.PerspectiveCamera {
		return this.camera;
	}

	public update(deltatime: number): void {
		// this.camera.position.x = Math.sin(time * 0.1) * 0.5;
		// this.camera.position.y = Math.cos(time * 0.1 + 500) * 0.5 + 0.5;
		// this.camera.position.z = 5
		const characterThreePos = mapCoords(
			this.physicsEngine.getPlayer().position,
			false
		);
		const characterThreeVec = new THREE.Vector3(
			characterThreePos.x,
			characterThreePos.y,
			0
		);

		this.targetPosition.lerp(characterThreeVec, 0.001 * deltatime);

		const characterDistanceFromCenter = this.targetPosition.distanceTo(
			new THREE.Vector3(0, 0, 0)
		);

		const lerpCamera = new THREE.Vector3(
			0,
			0,
			7 - characterDistanceFromCenter * 0.5
		).lerp(this.targetPosition, 0.8);
		lerpCamera.z = 7 - characterDistanceFromCenter * 0.5;
		this.camera.position.lerp(lerpCamera, 0.001 * deltatime);
		this.camera.position.lerp(lerpCamera, 0.5);

		this.camera.lookAt(
		  new THREE.Vector3(0, -0.1, 0).lerp(this.targetPosition, 0.5),
		);

		// console.log(mapCoords(this.physicsEngine.getPlayer().position, false));
	}
}
