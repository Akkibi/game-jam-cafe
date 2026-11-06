# Gameplay tuning

See also [architecture](architecture.md). All values live in `src/matter/tuning.ts`.

## Movement

The player controller in `PhysicsEngine.step` runs at a fixed 120 Hz. Rendering interpolates between steps.

| Constant | Effect |
| --- | --- |
| `runSpeedMin`, `runSpeedMax` | Top speed at 0 and 100 caffeine |
| `groundAccel`, `groundDecel` | Grip on the ground, stopping distance |
| `airAccel`, `airDecel` | Air control, momentum kept in the air |
| `jumpSpeed`, `riseGravity` | Jump height is `jumpSpeed² / (2 × riseGravity)`, 400 px (about 1.5 units) |
| `fallGravity`, `maxFallSpeed` | How fast the player comes down |
| `jumpCutMultiplier` | Short hop when the jump button is released early |
| `coyoteMs`, `jumpBufferMs` | Jump forgiveness after leaving a ledge, and before landing |
| `SLOW_MOTION_SCALE` | Time scale during the multiplier banner |

## Platforms

Platforms are one-way: the player jumps up through them and lands on top. `updateOneWayPlatforms` switches them to sensors each step. Walls stay solid and do not allow jumping, because only a surface under the player counts as ground.

## Controls

| Action | Keyboard | Gamepad | Axis button |
| --- | --- | --- | --- |
| Left | Q, A, Left arrow | Stick, D-pad, X | `a` |
| Right | D, Right arrow | Stick, D-pad, B | `x` |
| Jump | Z, W, Space, Up arrow | A | `i` |

On the end screen, `a` restarts and `i` continues.

## Respawn flow

Falling below `WORLD.height × 1.5` calls `SceneManager.restart`:

- Score at or below 30000: reset, then replay the countdown (1.5× faster on retries).
- Score above 30000: the end screen appears.

Blocks spawn during the countdown, because a platform's collider only appears 1.5 s after activation. The countdown must stay longer than that.
