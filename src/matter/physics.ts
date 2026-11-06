import Matter from 'matter-js';
import { Visualizer } from './visualizer';
import { CollisionWatcher } from './collisions';
import * as THREE from 'three/webgpu';
import { GameControls } from '../classes/Controls';
import { useStore } from '../store/globalStore';
import { SoundManager } from '../sounds/soundManager';
import { getRandomSautSound } from '../sounds/sounds';
import { MAX_FRAME_MS, MOVE, PLAYER_RADIUS, SPAWN, STEP_MS, WORLD } from './tuning';

export interface Vec2Type {
	x: number;
	y: number;
}

export interface Range {
	min: number;
	max: number;
}

export interface RangeType {
	x: Range;
	y: Range;
}

const threeRange = { x: { min: -3.4, max: 3.4 }, y: { min: -1.9, max: 1.9 } };
const matterRange = {
	x: { min: 0, max: WORLD.width },
	y: { min: 0, max: WORLD.height },
};
const amplitude = {
	x: WORLD.width / 6.8,
	y: WORLD.height / 3.8,
};
export function mapRange(
	value: number,
	inMin: number,
	inMax: number,
	outMin: number,
	outMax: number,
) {
	return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
}

export function mapCoords({ x, y }: Vec2Type, tToM: boolean): Vec2Type {
	const initial = tToM ? threeRange : matterRange;
	const target = tToM ? matterRange : threeRange;
	return {
		x: mapRange(x, initial.x.min, initial.x.max, target.x.min, target.x.max),
		y: mapRange(y, initial.y.min, initial.y.max, target.y.max, target.y.min), // invert Y if needed
	};
}

// Matter velocities are expressed in px per 1/60s.
const MATTER_VELOCITY_UNIT = 60;
const RISING_THRESHOLD = -20;

const approach = (value: number, target: number, maxDelta: number) =>
	value < target ? Math.min(value + maxDelta, target) : Math.max(value - maxDelta, target);

export class PhysicsEngine {
	private static _instance: PhysicsEngine;
	public engine: Matter.Engine;
	private player: Matter.Body;
	private collisionWatcher: CollisionWatcher;
	private gamecontrols: GameControls;
	private platforms: Set<Matter.Body> = new Set();
	private accumulator = 0;
	private previousPosition: Vec2Type = { ...SPAWN };
	private coyoteMs = 0;
	private jumpBufferMs = 0;
	private isJumpRising = false;

	private constructor() {
		this.gamecontrols = GameControls.getInstance();
		this.gamecontrols.keyHandlerSetup();
		this.engine = Matter.Engine.create();
		this.engine.gravity.scale = 0;
		this.player = Matter.Bodies.circle(SPAWN.x, SPAWN.y, PLAYER_RADIUS, {
			restitution: 0,
			friction: 0,
			frictionStatic: 0,
			frictionAir: 0,
		});
		this.player.inertia = Infinity;

		Matter.World.add(this.engine.world, this.player);
		this.addWalls();
		Visualizer.getInstance(this.engine);
		this.collisionWatcher = CollisionWatcher.getInstance(this.player, this.engine);
	}

	private addWalls() {
		const wallSize = new THREE.Vector3(0.1, 10, 0);
		this.addObject(new THREE.Vector3(-3.4, 0, 0), wallSize);
		this.addObject(new THREE.Vector3(3.4, 0, 0), wallSize);
	}

	public restart() {
		Matter.Composite.clear(this.engine.world, false);
		this.platforms.clear();
		this.collisionWatcher.clear();
		Matter.World.add(this.engine.world, this.player);
		this.addWalls();

		Matter.Body.setPosition(this.player, SPAWN);
		Matter.Body.setVelocity(this.player, { x: 0, y: 0 });
		this.previousPosition = { ...SPAWN };
		this.accumulator = 0;
		this.coyoteMs = 0;
		this.jumpBufferMs = 0;
		this.isJumpRising = false;
		this.gamecontrols.clearJump();
	}

	static getInstance(): PhysicsEngine {
		if (!this._instance) this._instance = new PhysicsEngine();
		return this._instance;
	}

	public getPlayer = (): Matter.Body => this.player;

	public isGrounded = (): boolean => this.collisionWatcher.isGrounded();

	public getRenderPosition(): Vec2Type {
		const alpha = this.accumulator / STEP_MS;
		const { x, y } = this.player.position;
		return {
			x: this.previousPosition.x + (x - this.previousPosition.x) * alpha,
			y: this.previousPosition.y + (y - this.previousPosition.y) * alpha,
		};
	}

	public addObject(
		position: THREE.Vector3,
		size: THREE.Vector3,
		rotation?: number,
		moving: boolean = false,
	): Matter.Body {
		const newCoord = mapCoords(position, true);

		// console.log(newCoord, {x: 40, y: 40});
		const object = Matter.Bodies.rectangle(
			newCoord.x,
			newCoord.y,
			size.x * amplitude.x,
			size.y * amplitude.y,
			{ isStatic: !moving },
		);
		if (rotation) Matter.Body.rotate(object, rotation);

		Matter.World.add(this.engine.world, object);

		return object;
	}

	public addPlatform(position: THREE.Vector3, size: THREE.Vector3): Matter.Body {
		const platform = this.addObject(position, size);
		this.platforms.add(platform);
		return platform;
	}

	public addCircle(
		position: THREE.Vector3,
		radius: number,
		moving: boolean = false,
	): Matter.Body {
		const newCoord = mapCoords(position, true);
		const scaledRadius = radius * ((amplitude.x + amplitude.y) / 2);

		const circle = Matter.Bodies.circle(newCoord.x, newCoord.y, scaledRadius, {
			isStatic: !moving,
		});

		Matter.World.add(this.engine.world, circle);

		return circle;
	}

	public removeObject(object: Matter.Body): void {
		this.platforms.delete(object);
		Matter.World.remove(this.engine.world, object);
	}

	public update(deltaMs: number): void {
		this.accumulator += Math.min(deltaMs, MAX_FRAME_MS);
		while (this.accumulator >= STEP_MS) {
			this.previousPosition.x = this.player.position.x;
			this.previousPosition.y = this.player.position.y;
			this.step();
			this.accumulator -= STEP_MS;
		}
	}

	private step(): void {
		const stepSeconds = STEP_MS / 1000;
		const velocity = Matter.Body.getVelocity(this.player);
		let vx = velocity.x * MATTER_VELOCITY_UNIT;
		let vy = velocity.y * MATTER_VELOCITY_UNIT;

		const grounded = vy > RISING_THRESHOLD && this.collisionWatcher.isGrounded();
		if (grounded) {
			this.coyoteMs = MOVE.coyoteMs;
			this.isJumpRising = false;
		} else {
			this.coyoteMs -= STEP_MS;
		}

		if (this.gamecontrols.consumeJumpPress()) {
			this.jumpBufferMs = MOVE.jumpBufferMs;
		} else {
			this.jumpBufferMs -= STEP_MS;
		}

		const axis = this.gamecontrols.getMoveAxis();
		const caffeine = Math.min(Math.max(useStore.getState().caffeineLvl / 100, 0), 1);
		const targetVx =
			axis * (MOVE.runSpeedMin + (MOVE.runSpeedMax - MOVE.runSpeedMin) * caffeine);
		const isAccelerating =
			axis !== 0 && vx * targetVx >= 0 && Math.abs(targetVx) > Math.abs(vx);
		const accel = grounded ? MOVE.groundAccel : MOVE.airAccel;
		const decel = grounded ? MOVE.groundDecel : MOVE.airDecel;
		vx = approach(vx, targetVx, (isAccelerating ? accel : decel) * stepSeconds);

		if (this.isJumpRising && vy < 0 && !this.gamecontrols.isJumpHeld()) {
			vy *= MOVE.jumpCutMultiplier;
			this.isJumpRising = false;
		}
		const gravity = vy < 0 ? MOVE.riseGravity : MOVE.fallGravity;
		vy = Math.min(vy + gravity * stepSeconds, MOVE.maxFallSpeed);

		if (this.jumpBufferMs > 0 && this.coyoteMs > 0) {
			vy = -MOVE.jumpSpeed;
			this.jumpBufferMs = 0;
			this.coyoteMs = 0;
			this.isJumpRising = true;
			SoundManager.getInstance().play(getRandomSautSound(), { volume: 0.2 });
		}

		const isTooHigh = this.player.position.y < -50;
		if (
			isTooHigh &&
			(this.player.position.x < 50 || this.player.position.x > matterRange.x.max - 50)
		) {
			vy = Math.max(vy, MATTER_VELOCITY_UNIT);
		}

		Matter.Body.setVelocity(this.player, {
			x: vx / MATTER_VELOCITY_UNIT,
			y: vy / MATTER_VELOCITY_UNIT,
		});
		this.updateOneWayPlatforms(vy, stepSeconds);
		Matter.Engine.update(this.engine, STEP_MS);
	}

	// A platform only stops the player when landing on it from above.
	private updateOneWayPlatforms(vy: number, stepSeconds: number): void {
		const feetY = this.player.position.y + PLAYER_RADIUS;
		const tolerance = 4 + Math.max(vy, 0) * stepSeconds;
		this.platforms.forEach((platform) => {
			platform.isSensor = vy < RISING_THRESHOLD || feetY > platform.bounds.min.y + tolerance;
		});
		// Matter copies isSensor when a pair is created, so live contacts need it too.
		for (const pair of this.engine.pairs.list) {
			if (pair.bodyA === this.player && this.platforms.has(pair.bodyB)) {
				pair.isSensor = pair.bodyB.isSensor;
			} else if (pair.bodyB === this.player && this.platforms.has(pair.bodyA)) {
				pair.isSensor = pair.bodyA.isSensor;
			}
		}
	}
}
