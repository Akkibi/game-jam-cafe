# Mathieu a un grain !

Coffee-themed 2D arcade platformer: stay on the platforms that drop into the machine and eat coffee beans to raise your caffeine and score multiplier. Three.js (WebGPU) rendering, Matter.js physics, React UI, Axis arcade input.

## Docs

- [docs/architecture.md](docs/architecture.md): game loop, singletons, world coordinates, asset caches
- [docs/gameplay-tuning.md](docs/gameplay-tuning.md): movement constants, controls, one-way platforms, respawn flow
- [docs/mobile.md](docs/mobile.md): touch controls, landscape hold

## Commands

- `yarn dev`: dev server (`--host 127.0.0.1`)
- `npx tsc -b --noEmit`: type-check
- `yarn lint`: lint
- `yarn build`: production build
