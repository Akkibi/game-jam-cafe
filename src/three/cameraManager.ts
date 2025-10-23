import * as THREE from "three/webgpu";
import { mapCoords, PhysicsEngine } from "../matter/physics";
import { useStore } from "../store/globalStore";

export class CameraManager {
  private static instance: CameraManager;
  private cameraHandler: THREE.Group;
  private camera: THREE.PerspectiveCamera;
  private cameraGroup: THREE.Group;
  private physicsEngine: PhysicsEngine;
  private targetPosition: THREE.Vector3;

  private constructor(scene: THREE.Scene) {
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

  public update(time: number, deltatime: number): void {
    // this.cameraHandler.position.x = Math.sin(time * 0.1) * 0.5;
    // this.cameraHandler.position.y = Math.cos(time * 0.1 + 500) * 0.5 + 0.5;
    // this.cameraHandler.position.z = 5
    const characterThreePos = mapCoords(
      this.physicsEngine.getPlayer().position,
      false,
    );
    const characterThreeVec = new THREE.Vector3(
      characterThreePos.x,
      characterThreePos.y,
      0,
    );

    this.targetPosition.lerp(characterThreeVec, 0.001 * deltatime);

    const characterDistanceFromCenter = this.targetPosition.distanceTo(
      new THREE.Vector3(0, 0, 0),
    );

    const lerpCamera = new THREE.Vector3(
      0,
      0,
      7 - characterDistanceFromCenter * 0.5,
    ).lerp(this.targetPosition, 0.8);
    lerpCamera.z = 7 - characterDistanceFromCenter * 0.5;
    // this.cameraHandler.position.lerp(lerpCamera, 0.001 * deltatime);
    this.cameraHandler.position.lerp(lerpCamera, 0.5);

    this.cameraHandler.lookAt(
      new THREE.Vector3(0, -0.1, 0).lerp(this.targetPosition, 0.5),
    );

    // console.log(mapCoords(this.physicsEngine.getPlayer().position, false));
    const cameraShakeAmount = Math.max(useStore.getState().caffeineLvl - 70, 0);
    const cameraShakeValue = Math.sin(time * 20) * 0.1;
    this.camera.rotation.z =
      Math.PI + cameraShakeValue * cameraShakeAmount * 0.002;
  }
}
