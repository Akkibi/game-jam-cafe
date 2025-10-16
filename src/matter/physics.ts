import Matter from "matter-js";
import { Visualizer } from "./visualizer";
import { CollisionWatcher } from "./collisions";
import * as THREE from "three/webgpu";
import { GameControls } from "../classes/Controls";

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

const threeRange = { x: { min: -3.4, max: 3.4 }, y: { min: -1.9, max: 1.9 } }
const matterRange = { x: { min: 0, max: window.innerWidth }, y: { min: 0, max: window.innerHeight } }
const amplitude = { x: window.innerWidth / 6.8, y: window.innerHeight / 3.8 };
export function mapRange(value : number, inMin : number, inMax : number, outMin : number, outMax : number) {
  return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
}

export function mapCoords({ x, y } : Vec2Type, tToM : boolean) : Vec2Type {
  const initial = tToM ? threeRange : matterRange;
  const target = tToM ? matterRange : threeRange;
  return {
    x: mapRange(x, initial.x.min, initial.x.max, target.x.min, target.x.max),
    y: mapRange(y, initial.y.min, initial.y.max, target.y.max, target.y.min) // invert Y if needed
  };
}

export class PhysicsEngine {
  private static _instance: PhysicsEngine;
  private engine: Matter.Engine;
  private player: Matter.Body;
  private box: Matter.Body;
  private visualizer: Visualizer;
  private collisionWatcher: CollisionWatcher;
  private gamecontrols : GameControls;

  private constructor() {
    this.gamecontrols = GameControls.getInstance()
    this.gamecontrols.keyHandlerSetup();
    this.engine = Matter.Engine.create();
    this.player = Matter.Bodies.rectangle(40, 0, 40, 80, { restitution: 0, friction: 0.01 });
    this.player.inertia = Infinity;
    // Matter.Body.setAngularVelocity(this.player, 0);

    this.box = Matter.Bodies.rectangle(150, -100, 40, 40, { restitution: 0.5 });

    const colliders = [this.player, this.box];
    Matter.World.add(this.engine.world, colliders);
    this.bindControls();
    this.visualizer = Visualizer.getInstance(this.engine);
    this.collisionWatcher = CollisionWatcher.getInstance(this.player);
    this.collisionWatcher.addBodies(colliders);
  }

  static getInstance(): PhysicsEngine {
    if (!this._instance) this._instance = new PhysicsEngine();
    return this._instance;
  }

  public getPlayer = (): Matter.Body => this.player;

  public addObject(position: THREE.Vector3, size: THREE.Vector3, moving: boolean = false): Matter.Body {
    const newCoord = mapCoords(position, true);

    // console.log(newCoord, {x: 40, y: 40});
    const object = Matter.Bodies.rectangle(newCoord.x, newCoord.y, size.x * amplitude.x, size.y * amplitude.y, { isStatic: !moving });

    Matter.World.add(this.engine.world, object);
    this.collisionWatcher.addBodies([object]);

    return object;
  }

  public removeObject(object: Matter.Body): void {
    Matter.World.remove(this.engine.world, object);
  }

  private bindControls(): void {
    // document.addEventListener("keydown", (event) => {
    //     const speed = 5;
    //     const body = this.player
    //     const velocity = { x: body.velocity.x, y: body.velocity.y };

    //     console.log(this.collisionWatcher.getCollisions());
    //     if (event.key === 'ArrowUp' && this.collisionWatcher.getCollisions().length > 0) velocity.y = -speed * 2;
    //     if (event.key === 'ArrowDown') velocity.y = speed;
    //     if (event.key === 'ArrowLeft') velocity.x = -speed;
    //     if (event.key === 'ArrowRight') velocity.x = speed;

    //     Matter.Body.setVelocity(body, velocity);
    // });
  }

  public update(deltaTime: number): void {
    Matter.Engine.update(this.engine, deltaTime);
    this.visualizer.update();
    const speed = this.gamecontrols.getSpeed();
    const bodyVelocity = Matter.Body.getVelocity(this.player);
    const newVelocityY = speed.y && (this.collisionWatcher.getCollisions().length > 1) ? speed.y : (bodyVelocity.y > 0 ? bodyVelocity.y -0.1 : bodyVelocity.y ) ;
    const newVelocityX = Math.min(Math.max(bodyVelocity.x + speed.x, -5), 5);
    Matter.Body.setVelocity(this.player, {x: newVelocityX, y: newVelocityY});
    Matter.Body.setAngularSpeed(this.player, 0);

  };
}
