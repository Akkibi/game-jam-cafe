import { Engine, World, Bodies, Body } from "matter-js";

export class PhysicsEngine {
  private static _instance: PhysicsEngine;
  private engine: Engine;
  private player: Body;
  private box: Body;
  private floor: Body;

  private constructor() {
    this.engine = Engine.create();

    this.player = Bodies.rectangle(0, 0, 40, 40, { restitution: 0.2 });
    this.box = Bodies.rectangle(100, -100, 40, 40, { restitution: 0.1 });
    this.floor = Bodies.rectangle(0, 300, 400, 40, { isStatic: true });

    World.add(this.engine.world, [this.player, this.box, this.floor]);
    this.bindControls();
  }

  static getInstance(): PhysicsEngine {
    if (!this._instance) this._instance = new PhysicsEngine();
    return this._instance;
  }

  private bindControls(): void {
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        Body.applyForce(
          this.player,
          this.player.position,
          { x: 0, y: -0.05 } // vertical impulse
        );
      }
    });
  }

  public update(deltaTime :number): void {
      Engine.update(this.engine, deltaTime);
  };
}
