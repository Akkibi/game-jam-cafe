import { Vector3 } from 'three';
import { BaseSceneElement } from '../BaseSceneElement';
import * as THREE from 'three/webgpu';
import { PhysicsEngine } from '../../matter/physics';
import { loadGLTFModel } from '../../utils/loadGLTFModel';
import gsap from 'gsap';
import type { Seed } from '../../three/seed';
import Matter from 'matter-js';
import { SoundManager } from '../../sounds/soundManager';
import { SOUNDS } from '../../sounds/sounds';

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
	private tremblingTween: gsap.core.Tween | null = null;

	constructor(
		id: number,
		scene: THREE.Scene,
		position: Vector3,
		size: Vector3,
		lifeSpan: number | null,
		platformGroup: THREE.Group,
	) {
		super(id, scene, position, size, lifeSpan, platformGroup);

		this.loadModels(platformGroup);
	}

	private async loadModels(platformGroup: THREE.Group) {
		await loadGLTFModel(platformGroup, '/assets/models/grinder_platform.glb');
		await loadGLTFModel(platformGroup, '/assets/models/grinder.glb');

		this.modelsLoaded = true;
		this.storeGriderObjects();
	}

	public addToScene(): void {
		const onComplete = () => (this.seed = this.addSeed());
		super.addToScene(onComplete);
	}

	private storeGriderObjects() {
		this.grinder_full = this.findObjectByName(this.group, 'meule_full');
		this.grinder_head = this.findObjectByName(this.group, 'meule_head_controller');
	}

	private findObjectByName(parent: THREE.Object3D, name: string): THREE.Object3D | undefined {
		if (parent.name === name) return parent;

		for (const child of parent.children) {
			const found = this.findObjectByName(child, name);
			if (found) return found;
		}

		return undefined;
	}

	public startTrembling() {
		// Prevent starting the animation if it's already running
		if (this.tremblingTween) return;

		// Create a looping (yoyo) animation for the trembling effect
		this.tremblingTween = gsap.to(this.group.position, {
			x: this.position.x + 0.05, // Shake amount
			duration: 0.05,
			ease: 'power1.inOut',
			yoyo: true, // Animate back and forth
			repeat: -1, // Repeat indefinitely
		});
	}

	private startAnimating() {
		this.animationState = AnimationState.ANIMATING;

		// Create timeline
		this.timeline = gsap.timeline();

		SoundManager.getInstance().play(SOUNDS.GRINDER, { volume: 0.1 });

		// Phase 1: Just rotation (2 seconds)
		if (this.grinder_head) {
			this.timeline.to(
				this.grinder_head.rotation,
				{
					y: Math.PI * 2 * 3, // 3 full rotations during warmup
					ease: 'power1.in',
					duration: 2,
				},
				0,
			);
		}

		if (this.grinder_full && this.grinder_head) {
			this.timeline.to(
				this.grinder_full.position,
				{
					y: -3.83,
					ease: 'power2.out',
					duration: 1,
					onStart: () => {
						if (this.seed) {
							this.seed.destroy();
							this.seed = null;
						}
					},
				},
				'<1s',
			);
		}

		if (this.physicObject != null) {
			const tempPosition = {
				x: this.physicObject.position.x,
				y: this.physicObject.position.y,
			};

			this.timeline.to(
				tempPosition,
				{
					y: 150,
					ease: 'power2.out',
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
				'<',
			);
		}

		// Optional: Add callback when animation completes
		this.timeline.eventCallback('onComplete', () => {
			this.animationState = AnimationState.COMPLETE;
		});
	}

	public removeFromScene(): void {
		// Kill timelines and tweens if they exist
		if (this.timeline) {
			this.timeline.kill();
			this.timeline = null;
		}
		if (this.tremblingTween) {
			this.tremblingTween.kill();
			this.tremblingTween = null;
			// Ensure the platform is at its original position
			this.group.position.x = this.position.x;
		}

		if (this.physicObject) PhysicsEngine.getInstance().removeObject(this.physicObject);

		super.removeFromScene();
	}

	public reset(): void {
		super.reset();
		this.animationState = AnimationState.IDLE;

		if (this.timeline) {
			this.timeline.kill();
			this.timeline = null;
		}
		if (this.tremblingTween) {
			this.tremblingTween.kill();
			this.tremblingTween = null;
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

		// Start main grinding animation at 50% of lifespan
		if (progress > 0.5 && this.animationState === AnimationState.IDLE) {
			this.startAnimating();
		}

		// Start trembling at 70% and let it continue until removed
		if (progress > 0.7 && !this.tremblingTween) {
			this.startTrembling();
		}

		// Remove from scene at end of lifespan
		if (progress > 1 && !this.isRemoving) {
			this.removeFromScene();
		}
	}
}
