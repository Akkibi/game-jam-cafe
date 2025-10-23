import Matter from "matter-js";
import { Visualizer } from "./visualizer";
import { CollisionWatcher } from "./collisions";
import * as THREE from "three/webgpu";
import { GameControls } from "../classes/Controls";
import { useStore } from "../store/globalStore";
import { eventEmitter } from "../utils/eventEmitter";

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
  x: { min: 0, max: window.innerHeight * 1.77 },
  y: { min: 0, max: window.innerHeight },
};
const amplitude = {
  x: (window.innerHeight * 1.77) / 6.8,
  y: window.innerHeight / 3.8,
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

export class PhysicsEngine {
  private static _instance: PhysicsEngine;
  public engine: Matter.Engine;
  private player: Matter.Body;
  private visualizer: Visualizer;
  private collisionWatcher: CollisionWatcher;
  private gamecontrols: GameControls;
  private lastTouch: number;

  private constructor() {
    this.lastTouch = 0;
    this.gamecontrols = GameControls.getInstance();
    this.gamecontrols.keyHandlerSetup();
    this.engine = Matter.Engine.create();
    const scale = window.innerHeight * 0.05;
    this.player = Matter.Bodies.circle(20, -50, scale * 0.5, {
      restitution: 0,
      friction: 0.05,
    });
    this.player.inertia = Infinity;
    // Matter.Body.setAngularVelocity(this.player, 0);

    const colliders = [this.player];
    Matter.World.add(this.engine.world, colliders);
    this.visualizer = Visualizer.getInstance(this.engine);
    this.collisionWatcher = CollisionWatcher.getInstance(
      this.player,
      this.engine,
    );

    eventEmitter.on("restart", () => this.restart.bind(this));
  }

  private restart() {
    console.log("restart");
    Matter.Body.setPosition(this.player, { x: 20, y: -50 });
    Matter.Body.setVelocity(this.player, { x: 0, y: 0 });
  }

  static getInstance(): PhysicsEngine {
    if (!this._instance) this._instance = new PhysicsEngine();
    return this._instance;
  }

  public getPlayer = (): Matter.Body => this.player;

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
    Matter.World.remove(this.engine.world, object);
  }

  public update(deltaTime: number): void {
    Matter.Engine.update(this.engine, deltaTime);
    this.visualizer.update();

    const speed = this.gamecontrols.getSpeed();
    const bodyVelocity = Matter.Body.getVelocity(this.player);
    const isCurrentTouch = this.collisionWatcher.getCollisions().length > 0;
    if (this.collisionWatcher.getCollisions().length > 0) {
      this.lastTouch = Date.now();
      // console.log("speed Touch", this.collisionWatcher.getCollisions());
    }
    const isTouch = isCurrentTouch ? true : this.lastTouch > Date.now() - 100;

    let newVelocityY = bodyVelocity.y;

    if (bodyVelocity.y > 0 && !isTouch) {
      newVelocityY = Math.min(bodyVelocity.y + 0.05 * deltaTime, 25);
    }
    if (speed.y < 0 && isTouch) {
      newVelocityY = speed.y * 1.25;
    }

    const newVelocityX = Math.min(
      Math.max(
        bodyVelocity.x +
          speed.x *
            (isCurrentTouch ? 2 : 1) *
            (0.8 + useStore.getState().caffeineLvl * 0.005),
        -5,
      ),
      5,
    );
    Matter.Body.setVelocity(this.player, {
      x: newVelocityX,
      y: newVelocityY,
    });
    const isTooHigh = this.player.position.y < -50;
    if (
      (isTooHigh && this.player.position.x < 50) ||
      (isTooHigh && this.player.position.x > matterRange.x.max - 50)
    ) {
      Matter.Body.setVelocity(this.player, {
        x: this.player.velocity.x,
        y: 1,
      });
    }
    Matter.Body.setAngularSpeed(this.player, 0);
  }
}
