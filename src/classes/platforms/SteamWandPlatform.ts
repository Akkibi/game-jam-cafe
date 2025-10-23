import { Vector3 } from "three";
import { BaseSceneElement } from "../BaseSceneElement";
import * as THREE from "three/webgpu";
import type { PhysicsEngine } from "../../matter/physics";
import type { SeedManager } from "../../three/seedManager";
import { loadGLTFModel } from "../../utils/loadGLTFModel";
import gsap from "gsap";
import Matter from "matter-js";
import type { SoundManager } from "../../sounds/soundManager";
import { SOUNDS } from "../../sounds/sounds";

enum AnimationState {
	IDLE,
	FIRST_STEAM,
	WAITING,
	SECOND_STEAM,
	COMPLETE,
}

export class SteamWandPlatform extends BaseSceneElement {
	private steamPlane: THREE.Mesh | undefined;
	private modelsLoaded: boolean = false;
	private animationState: AnimationState = AnimationState.IDLE;
	private timeline: gsap.core.Timeline | null = null;
	private physicObject: Matter.Body | null = null;
	private steamFrames: THREE.Texture[] = [];
	private currentFrame: number = 0;
	private frameInterval: number | null = null;
	private steamCount: number = 0;

	constructor(
		id: number,
		scene: THREE.Scene,
		position: Vector3,
		physics: PhysicsEngine,
		seedManager: SeedManager,
		soundManager: SoundManager,
		size: Vector3,
		lifeSpan: number | null,
		platformGroup: THREE.Group
	) {
		super(
			id,
			scene,
			physics,
			seedManager,
			soundManager,
			position,
			size,
			lifeSpan,
			platformGroup
		);

		this.loadModels(platformGroup);
		this.createSteamPlane(platformGroup);
	}

	private async loadModels(platformGroup: THREE.Group) {
		await loadGLTFModel(
			platformGroup,
			"/assets/models/steamwand.glb",
			new Vector3(0, -0.2, 0)
		);
		await loadGLTFModel(platformGroup, "/assets/models/sugar_platform.glb");

		// Load steam frame textures
		const textureLoader = new THREE.TextureLoader();
		const frameCount = 8; // Adjust based on how many frames you have

		for (let i = 0; i < frameCount; i++) {
			const texture = textureLoader.load(
				`/assets/sprites/steam/steam_${i}.png`
			);
			this.steamFrames.push(texture);
		}

		this.modelsLoaded = true;
	}

	public addToScene(): void {
		this.createSteamPlane(this.group);
		super.addToScene();
	}

	private createSteamPlane(platformGroup: THREE.Group) {
		// Create a plane geometry for the steam effect
		const geometry = new THREE.PlaneGeometry(2, 2);

		// Load texture for the steam frames
		const textureLoader = new THREE.TextureLoader();
		const texture = textureLoader.load("/assets/sprites/steam/steam_0.png");

		// Create a material with transparency for steam effect
		const material = new THREE.MeshBasicMaterial({
			map: texture,
			transparent: true,
			opacity: 0,
			side: THREE.DoubleSide,
		});

		this.steamPlane = new THREE.Mesh(geometry, material);

		// Position the plane under the steam wand
		this.steamPlane.position.set(0.1, -0.2, 0);

		platformGroup.add(this.steamPlane);
	}

	private startAnimating() {
		this.steamCount++;

		if (this.steamCount === 1) {
			this.animationState = AnimationState.FIRST_STEAM;
		} else if (this.steamCount === 2) {
			this.animationState = AnimationState.SECOND_STEAM;
		}

		// Start frame animation
		this.startFrameAnimation();

		// Create timeline
		this.timeline = gsap.timeline();

		if (
			this.steamPlane &&
			this.steamPlane.material instanceof THREE.MeshBasicMaterial
		) {
			// Phase 1: Steam starts appearing (fade in)
			this.timeline.to(
				this.steamPlane.material,
				{
					opacity: 1,
					ease: "power2.in",
					duration: 0.3,
				},
				0
			);

			// Only create physics on second steam
			if (this.steamCount === 2) {
				// Phase 2: Create physics object to push character
				this.timeline.add(() => {
					const headPosition = new Vector3().copy(this.position);
					const headSize = new Vector3(0.7, 0.7, 1.9);

					headPosition.y += 0.7;
					this.physicObject = this.physics.addObject(
						headPosition,
						headSize,
						40
					);
				}, 0.3);

				// Phase 3: Push physics object upward
				if (this.physicObject != null) {
					const tempPosition = {
						x: this.physicObject.position.x,
						y: this.physicObject.position.y,
					};

					this.timeline.to(
						tempPosition,
						{
							y: 150,
							ease: "power2.out",
							duration: 1.5,
							onUpdate: () => {
								if (this.physicObject) {
									Matter.Body.setPosition(this.physicObject, {
										x: tempPosition.x,
										y: tempPosition.y,
									});
								}
							},
						},
						"<0.3"
					);
				}
			}

			// Phase 4: Steam fades out
			const fadeOutDelay = this.steamCount === 1 ? 0.5 : 1;
			this.timeline.to(
				this.steamPlane.material,
				{
					opacity: 0,
					ease: "power2.out",
					duration: 0.5,
				},
				`+=${fadeOutDelay}`
			);
		}

		// Animation complete callback
		this.timeline.eventCallback("onComplete", () => {
			this.stopFrameAnimation();

			if (this.steamCount === 1) {
				// Wait a bit before second steam
				this.animationState = AnimationState.WAITING;
				setTimeout(() => {
					if (this.isActive) {
						this.startAnimating();
					}
				}, 800); // 800ms pause between steams
			} else {
				this.animationState = AnimationState.COMPLETE;
			}
		});
	}

	private startFrameAnimation() {
		if (this.frameInterval || this.steamFrames.length === 0) return;

		this.currentFrame = 0;
		const fps = 8; // Adjust frame rate as needed
		const frameDelay = 1000 / fps;

		this.frameInterval = setInterval(() => {
			if (
				this.steamPlane &&
				this.steamPlane.material instanceof THREE.MeshBasicMaterial
			) {
				this.currentFrame =
					(this.currentFrame + 1) % this.steamFrames.length;
				this.steamPlane.material.map =
					this.steamFrames[this.currentFrame];
				this.steamPlane.material.needsUpdate = true;
			}
		}, frameDelay);
	}

	private stopFrameAnimation() {
		if (this.frameInterval) {
			clearInterval(this.frameInterval);
			this.frameInterval = null;
		}
	}

	public removeFromScene(): void {
		// Stop frame animation
		this.stopFrameAnimation();

		// Kill timeline if it exists
		if (this.timeline) {
			this.timeline.kill();
			this.timeline = null;
		}

		if (this.physicObject) this.physics.removeObject(this.physicObject);

		// Remove steam plane from scene
		if (this.steamPlane) {
			this.group.remove(this.steamPlane);
			if (this.steamPlane.geometry) this.steamPlane.geometry.dispose();
			if (this.steamPlane.material instanceof THREE.Material) {
				// if (this.steamPlane.material)
				// 	this.steamPlane.material.map.dispose();
				this.steamPlane.material.dispose();
			}
			this.steamPlane = undefined;
		}

		super.removeFromScene();
	}

	public reset(): void {
		super.reset();
		this.animationState = AnimationState.IDLE;
		this.steamCount = 0;
		this.stopFrameAnimation();

		if (this.timeline) {
			this.timeline.kill();
			this.timeline = null;
		}

		if (this.modelsLoaded && this.steamPlane) {
			// Reset steam plane
			this.steamPlane.position.set(0.1, -0.2, 0);
			this.currentFrame = 0;

			if (this.steamPlane.material instanceof THREE.MeshBasicMaterial) {
				this.steamPlane.material.opacity = 0;
				if (this.steamFrames.length > 0) {
					this.steamPlane.material.map = this.steamFrames[0];
					this.steamPlane.material.needsUpdate = true;
				}
			}
		}
	}

	public update(time: number): void {
		if (!this.isActive || !this.modelsLoaded || !this.lifeSpan) return;
		if (this.timestampAdded === 0) this.timestampAdded = time;

		const timeElapsed = time - this.timestampAdded;
		const progress = timeElapsed / this.lifeSpan;

		// Start first steam animation at 50% of lifespan
		if (progress > 0.7 && this.animationState === AnimationState.IDLE) {
			this.startTrembling();
		}

		// // Start trembling after both steams complete (at 80% like normal platforms)
		if (progress > 0.8 && this.animationState === AnimationState.IDLE) {
			this.soundManager.play(SOUNDS.STEAM);
			this.startAnimating();
		}

		// Remove from scene at end of lifespan
		if (progress > 1 && !this.isRemoving) {
			this.removeFromScene();
		}
	}
}
