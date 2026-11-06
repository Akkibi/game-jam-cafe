import * as THREE from 'three/webgpu';
import { mapCoords, PhysicsEngine } from '../matter/physics';
import { useStore } from '../store/globalStore';

const CAMERA_PAN = 0.35;
const CAMERA_ZOOM = 0.2;
const CAMERA_LOOK = 0.15;
const CAMERA_FOLLOW_RATE = 0.04;

export class CameraManager {
	private static instance: CameraManager;
	private cameraHandler: THREE.Group;
	private camera: THREE.PerspectiveCamera;
	private cameraGroup: THREE.Group;
	private physicsEngine: PhysicsEngine;
	private targetPosition: THREE.Vector3;
	private cameraLookAtBuffer: THREE.Vector3;
	private characterPosition = new THREE.Vector3();
	private desiredPosition = new THREE.Vector3();

	private constructor(scene: THREE.Scene) {
		this.cameraLookAtBuffer = new THREE.Vector3(0, 0, 0);
		this.camera = new THREE.PerspectiveCamera(
			40,
			window.innerWidth / window.innerHeight,
			0.1,
			1000,
		);
		this.cameraHandler = new THREE.Group();
		this.cameraGroup = new THREE.Group();
		this.cameraGroup.position.set(0, 0, 0);
		scene.add(this.cameraGroup);
		this.cameraHandler.position.set(0, 0, 7);
		this.camera.position.set(0, 0, 0);
		this.camera.rotation.set(Math.PI, 0, Math.PI);
		this.targetPosition = new THREE.Vector3(0, 0, 0);
		this.cameraHandler.add(this.camera);
		this.cameraGroup.add(this.cameraHandler);

		window.addEventListener('resize', () => {
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

	public update(time: number, deltatime: number): void {
		if (useStore.getState().isGameOver) {
			const targetLookAt = new THREE.Vector3(0, -3.5, 0);
			const targetPos = new THREE.Vector3(0, -4, 7);

			this.cameraHandler.lookAt(
				this.cameraLookAtBuffer.lerp(targetLookAt, 0.001 * deltatime),
			);
			this.cameraHandler.position.lerp(targetPos, 0.001 * deltatime);
			return;
		}
		const characterThreePos = mapCoords(this.physicsEngine.getPlayer().position, false);
		this.characterPosition.set(characterThreePos.x, characterThreePos.y, 0);
		this.targetPosition.lerp(this.characterPosition, 0.001 * deltatime);

		// Keep the whole room readable: the camera only leans toward the player.
		const zoomIn = this.targetPosition.length() * CAMERA_ZOOM;
		this.desiredPosition.copy(this.targetPosition).multiplyScalar(CAMERA_PAN);
		this.desiredPosition.z = 7 - zoomIn;
		this.cameraHandler.position.lerp(
			this.desiredPosition,
			1 - Math.exp(-CAMERA_FOLLOW_RATE * deltatime),
		);

		this.cameraLookAtBuffer.set(0, -0.1, 0).lerp(this.targetPosition, CAMERA_LOOK);
		this.cameraHandler.lookAt(this.cameraLookAtBuffer);

		const cameraShakeAmount = Math.max(useStore.getState().caffeineLvl - 70, 0);
		const cameraShakeValue = Math.sin(time * 20) * 0.1;
		this.camera.rotation.z = Math.PI + cameraShakeValue * cameraShakeAmount * 0.002;
	}
}
