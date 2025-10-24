import Matter, { Engine } from 'matter-js';
import * as THREE from 'three/webgpu';
import { mapCoords } from '../matter/physics';
import Animation from '../utils/animationManager';
import {
	characterFallingFrames,
	characterIdleFrames,
	characterRunFrames,
	characterEatingFrames,
} from '../static';
import { GameControls } from '../classes/Controls';
import { CollisionWatcher } from '../matter/collisions';
import { useStore } from '../store/globalStore';
import { SoundManager } from '../sounds/soundManager';
import { SOUNDS } from '../sounds/sounds';

const physicsScale = 0.5;
// const physicsTransform = new THREE.Vector2(-window.innerWidth/2, -window.innerHeight/2);

interface animationstates {
	falling: boolean;
	running: boolean;
	eating: boolean;
}

export class Player {
	private static _instance: Player;
	private object: THREE.Mesh;
	private scene: THREE.Scene;
	private body: Matter.Body;
	private animationManager: Animation;
	private controls: GameControls;
	private isRunning: boolean;
	private isright: boolean;
	private isFalling: boolean;
	private collisionWatcher: CollisionWatcher;
	private states: animationstates;
	private eatingDelta: number;
	private engine: Engine;

	public static getInstance(scene: THREE.Scene, body: Matter.Body, engine: Engine): Player {
		if (!Player._instance) {
			Player._instance = new Player(scene, body, engine);
		}
		return Player._instance;
	}

	private constructor(scene: THREE.Scene, body: Matter.Body, engine: Engine) {
		this.states = {
			falling: false,
			running: false,
			eating: false,
		};
		this.engine = engine;
		this.eatingDelta = 0;
		this.scene = scene;
		this.isRunning = false;
		this.isFalling = false;
		this.collisionWatcher = CollisionWatcher.getInstance(body, this.engine);
		this.isright = false;
		this.body = body;
		this.controls = GameControls.getInstance();
		// const width = body.bounds.max.x - body.bounds.min.x;
		// const height = body.bounds.max.y - body.bounds.min.y;
		const width = 0.788530466;
		const height = 1;
		const material = new THREE.MeshBasicMaterial({
			map: null,
			transparent: true,
			side: THREE.DoubleSide,
		});
		this.object = new THREE.Mesh(
			new THREE.PlaneGeometry(width * physicsScale, height * physicsScale),
			material,
		);
		this.scene.add(this.object);
		this.animationManager = new Animation(material);
		this.animationManager.setFrame(0);
		this.animationManager.set(characterIdleFrames);
		this.animationManager.setSpeed(100);
	}

	public getPosition(): THREE.Vector3 {
		return this.object.position;
	}

	public eat() {
		const caffeineLvl = useStore.getState().caffeineLvl;

		if (Math.random() < 0.5) {
			if (caffeineLvl >= 20 && caffeineLvl < 40) {
				SoundManager.getInstance().play(SOUNDS.X2, { volume: 0.4 });
			} else if (caffeineLvl >= 40 && caffeineLvl < 60) {
				SoundManager.getInstance().play(SOUNDS.X4, { volume: 0.4 });
			} else if (caffeineLvl >= 60 && caffeineLvl < 80) {
				SoundManager.getInstance().play(SOUNDS.X6, { volume: 0.4 });
			} else if (caffeineLvl >= 80 && caffeineLvl < 100) {
				SoundManager.getInstance().play(SOUNDS.X8, { volume: 0.4 });
			} else {
				SoundManager.getInstance().play(SOUNDS.X10_1, { volume: 0.4 });
			}
		}

		this.eatingDelta = 0;
		this.states.eating = true;
	}

	public update(deltatime: number): Matter.Body {
		const body = this.body;

		const newPos = mapCoords(body.position, false);
		this.object.position.set(newPos.x, newPos.y + 0.14, 0);

		// this.object.position.set((body.position.x+ physicsTransform.x) * physicsScale, (currentPhysics.position.y + physicsTransform.y) * -physicsScale, 0);
		this.animationManager.update(deltatime);

		const speed = this.controls.getSpeed();

		const lastRunning = this.isRunning;
		const lastRight = this.isright;
		const lastFalling = this.isFalling;

		if (Math.abs(speed.x) < 0.5) {
			this.isRunning = false;
		} else {
			this.isRunning = true;
		}

		if (speed.x > 0 && Math.abs(speed.x) > 0.1) {
			this.isright = true;
		} else if (speed.x < 0 && Math.abs(speed.x) > 0.1) {
			this.isright = false;
		}

		this.isFalling =
			this.collisionWatcher.getCollisions().length <= 1 && this.body.velocity.y > 0.1;

		this.states.running = this.isRunning || lastRunning !== this.isRunning;
		this.states.falling = this.isFalling || lastFalling !== this.isFalling;

		if (this.states.eating) {
			if (this.animationManager.currentFrames !== characterFallingFrames) {
				this.animationManager.setSpeed(5000);
				this.animationManager.set(characterEatingFrames);
				this.animationManager.setFrame(0);
			}
			this.eatingDelta += deltatime;
			if (this.eatingDelta > 100) {
				this.states.eating = false;
			}
		} else if (this.states.falling) {
			if (this.animationManager.currentFrames !== characterFallingFrames) {
				this.animationManager.setSpeed(5000);
				this.animationManager.set(characterFallingFrames);
				this.animationManager.setFrame(0);
			}
		} else if (this.states.running) {
			if (this.animationManager.currentFrames !== characterRunFrames) {
				this.animationManager.setSpeed(100);
				this.animationManager.set(characterRunFrames);
				this.animationManager.setFrame(0);
			}
		} else {
			if (this.animationManager.currentFrames !== characterIdleFrames) {
				this.animationManager.setSpeed(500);
				this.animationManager.set(characterIdleFrames);
				this.animationManager.setFrame(0);
			}
		}

		if (lastRight !== this.isright) {
			if (this.isright) {
				this.object.scale.x = 0.5;
				requestAnimationFrame(() => {
					this.object.rotation.y = 0;
					requestAnimationFrame(() => {
						this.object.scale.x = 1;
					});
				});
			} else {
				this.object.scale.x = 0.5;
				requestAnimationFrame(() => {
					this.object.rotation.y = Math.PI;
					requestAnimationFrame(() => {
						this.object.scale.x = 1;
					});
				});
			}
		}
		return body;
	}
}
