import { Vector3 } from "three";
import { BaseSceneElement } from "../BaseSceneElement";
import * as THREE from "three/webgpu";
import type { PhysicsEngine } from "../../matter/physics";
import type { SeedManager } from "../../three/seedManager";
import { loadGLTFModel } from "../../utils/loadGLTFModel";
import gsap from "gsap";
import type { Seed } from "../../three/seed";
import Matter from "matter-js";

enum AnimationState {
	IDLE,
	ANIMATING,
	COMPLETE,
}

export class CoffeeGrinderPlatform extends BaseSceneElement {
	private grinder_head: THREE.Object3D<THREE.Object3DEventMap> | undefined;
	private grinder_full: THREE.Object3D<THREE.Object3DEventMap> | undefined;
	private modelsLoaded: boolean = false;
	private animationState: AnimationState = AnimationState.IDLE;
	private timeline: gsap.core.Timeline | null = null;
	private seed: Seed | null = null;
	private physicObject: Matter.Body | null = null;

	constructor(
		id: number,
		scene: THREE.Scene,
		position: Vector3,
		physics: PhysicsEngine,
		seedManager: SeedManager,
		size: Vector3,
		lifeSpan: number | null,
		platformGroup: THREE.Group
	) {
		super(
			id,
			scene,
			physics,
			seedManager,
			position,
			size,
			lifeSpan,
			platformGroup
		);

		this.loadModels(platformGroup);
	}

	private async loadModels(platformGroup: THREE.Group) {
		await loadGLTFModel(
			platformGroup,
			"/assets/models/grinder_platform.glb"
		);
		await loadGLTFModel(
			platformGroup,
			"/assets/models/grinder.glb",
			new Vector3(0.1, -18.5, -0.2)
		);

		this.modelsLoaded = true;
		this.storeGriderObjects();
	}

	public addToScene(): void {
		console.log("addToScene", this.id);
		const onComplete = () => (this.seed = this.addSeed());
		super.addToScene(onComplete);
	}

	private storeGriderObjects() {
		this.grinder_full = this.findObjectByName(this.group, "meule_full");
		this.grinder_head = this.findObjectByName(
			this.group,
			"meule_head_controller"
		);
	}

	private findObjectByName(
		parent: THREE.Object3D,
		name: string
	): THREE.Object3D | undefined {
		if (parent.name === name) return parent;

		for (const child of parent.children) {
			const found = this.findObjectByName(child, name);
			if (found) return found;
		}

		return undefined;
	}

	private startAnimating() {
		this.animationState = AnimationState.ANIMATING;

		// Create timeline
		this.timeline = gsap.timeline();

		// Phase 1: Just rotation (2 seconds)
		if (this.grinder_head) {
			this.timeline.to(
				this.grinder_head.rotation,
				{
					y: Math.PI * 2 * 3, // 3 full rotations during warmup
					ease: "power1.in",
					duration: 2,
				},
				0
			);
		}

		if (this.grinder_full && this.grinder_head) {
			console.log("this.grinder_full", this.grinder_full.position.y);

			this.timeline.to(
				this.grinder_full.position,
				{
					y: -3.83,
					ease: "power2.out",
					duration: 1,
					onStart: () => {
						const headPosition = new Vector3().copy(this.position);
						const headSize = new Vector3(0.7, 0.7, 1.9);

						headPosition.y += 0.7;
						console.log("addObject", headPosition);
						this.physicObject = this.physics.addObject(
							headPosition,
							headSize,
							40
						);
						if (this.seed) {
							console.log("removeFromScene - Destroy seed");
							this.seed.destroy();
							this.seed = null;
						}
					},
				},
				"<1s"
			);
		}

		if (this.physicObject != null) {
			// Create a temporary object to animate
			const tempPosition = {
				x: this.physicObject.position.x,
				y: this.physicObject.position.y,
			};

			this.timeline.to(
				tempPosition,
				{
					y: 150,
					ease: "power2.out",
					duration: 1,
					onUpdate: () => {
						if (this.physicObject) {
							Matter.Body.setPosition(this.physicObject, {
								x: tempPosition.x,
								y: tempPosition.y,
							});
						}
					},
				},
				"<"
			);
		}

		// Optional: Add callback when animation completes
		this.timeline.eventCallback("onComplete", () => {
			this.animationState = AnimationState.COMPLETE;
		});
	}

	public removeFromScene(): void {
		// Kill timeline if it exists
		if (this.timeline) {
			this.timeline.kill();
			this.timeline = null;
		}

		if (this.physicObject) this.physics.removeObject(this.physicObject);

		super.removeFromScene();
	}

	public reset(): void {
		super.reset();
		this.animationState = AnimationState.IDLE;

		if (this.timeline) {
			this.timeline.kill();
			this.timeline = null;
		}

		if (this.modelsLoaded) {
			if (this.grinder_head) {
				this.grinder_head.rotation.set(0, 0, 0);
			}
			if (this.grinder_full) {
				this.grinder_full.position.y = -3;
			}
		}
	}

	public update(time: number): void {
		if (!this.isActive || !this.modelsLoaded || !this.lifeSpan) return;
		if (this.timestampAdded === 0) this.timestampAdded = time;

		const timeElapsed = time - this.timestampAdded;
		const progress = timeElapsed / this.lifeSpan;

		// Start animation at 50% of lifespan
		if (progress > 0.5 && this.animationState === AnimationState.IDLE) {
			this.startAnimating();
		}

		// Remove from scene at end of lifespan
		if (progress > 1 && !this.isRemoving) {
			this.removeFromScene();
		}
	}
}
