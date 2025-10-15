import { Detector, Body, Collision } from "matter-js";

export class CollisionWatcher {
  private static instance: CollisionWatcher;
  private detector: Matter.Detector;
  private character: Body;
  private watchedBodies: Body[];
  private collisions: Body[];

  private constructor(character: Body) {
    this.character = character;
    this.watchedBodies = [];
    this.collisions = [];
    this.detector = Detector.create();
    // Add the character and watched bodies to the detector
    Detector.setBodies(this.detector, [this.character, ...this.watchedBodies]);
  }

  static getInstance(character: Body): CollisionWatcher {
    if (!CollisionWatcher.instance) {
      CollisionWatcher.instance = new CollisionWatcher(character);
    }
    return CollisionWatcher.instance;
  }

  public addBodies(bodies: Body[]): void {
    this.watchedBodies.push(...bodies);
    // Update the detector with the new bodies
    Detector.setBodies(this.detector, [this.character, ...this.watchedBodies]);
  }

  private updateCollisions(character: Body, bodies: Body[], detector: Detector): void {
    this.collisions = []; // Clear previous collisions

    // Update the detector's pairs. This is crucial for detecting new collisions.
    // Matter.js Detector works by updating its internal list of potential collision pairs.
    Detector.setBodies(detector, [character, ...bodies]);
    const collisions: Collision[] = Detector.collisions(detector);

    for (const collision of collisions) {
      // Check if the character is involved in the collision
      if (collision.bodyA === character && bodies.includes(collision.bodyB)) {
        this.collisions.push(collision.bodyB);
      } else if (collision.bodyB === character && bodies.includes(collision.bodyA)) {
        this.collisions.push(collision.bodyA);
      }
    }
  }

  public getCollisions(): Body[] {
    this.updateCollisions(this.character, this.watchedBodies, this.detector);
    return this.collisions;
  }
}
