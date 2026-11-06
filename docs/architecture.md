# Architecture

See also [gameplay-tuning](gameplay-tuning.md).

## Game loop

`SceneManager.animate` (`src/three/scene.ts`) runs on the GSAP ticker, in this order:

1. `PhysicsEngine.update`: only when not paused.
2. `GameEngine.update`, `SeedManager.update`, `Player.update`: when not paused and during the countdown (`isRestarting`).
3. `CameraManager.update`, then render.

## Modules

- `src/matter/`: physics, collisions, tuning. `Visualizer` is the dev-only overlay.
- `src/game_engine/`: `Blocks` is the level data, `GameEngine` schedules one block per `location`.
- `src/classes/`: `GameBlock` staggers its platforms, `BaseSceneElement` handles a platform's lifecycle, `Controls` handles input.
- `src/three/`: scene, camera, player, seeds, environment.
- `src/components/`: React HUD, driven by the Zustand store (`src/store/globalStore.tsx`).

## World coordinates

Physics runs in a fixed virtual world (`WORLD` in `src/matter/tuning.ts`), never in window pixels. `mapCoords` converts to Three.js units (x -3.4 to 3.4, y -1.9 to 1.9).

## Asset caches

- `src/utils/loadGLTFModel.ts`: parses each GLB once, then returns clones sharing geometry and materials.
- `src/utils/loadTexture.ts`: one texture per URL. Shared textures must not be disposed by their users.

Swap `material.map` without `needsUpdate`, and keep `map` non-null: a swap does not need a material rebuild.
