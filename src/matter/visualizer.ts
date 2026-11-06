import Matter from 'matter-js';
import { useStore } from '../store/globalStore';
import { WORLD } from './tuning';

// Dev-only physics overlay and cheats: $ toggles the overlay, p pauses, r adds 30000 points.
export class Visualizer {
	private static instance: Visualizer;
	private render: Matter.Render | null = null;
	private canvas: HTMLCanvasElement | null = null;
	private visible = false;
	private engine: Matter.Engine;

	private constructor(engine: Matter.Engine) {
		this.engine = engine;
		if (!import.meta.env.DEV) return;

		document.addEventListener('keydown', (event) => {
			if (event.key === '$') {
				this.toggle();
			}
			if (event.key === 'p') {
				useStore.setState({ isPaused: !useStore.getState().isPaused });
			}
			if (event.key === 'r') {
				useStore.setState({ score: useStore.getState().score + 30000 });
			}
		});
	}

	static getInstance(engine: Matter.Engine): Visualizer {
		if (!Visualizer.instance) {
			Visualizer.instance = new Visualizer(engine);
		}
		return Visualizer.instance;
	}

	private setupCanvas(): void {
		this.canvas = document.createElement('canvas');
		this.canvas.width = WORLD.width;
		this.canvas.height = WORLD.height;
		this.canvas.style.position = 'fixed';
		this.canvas.style.top = '50%';
		this.canvas.style.left = '50%';
		this.canvas.style.border = '1px solid #888';
		this.canvas.style.transform = 'scale(0.25) translate(-50%, -50%)';
		document.body.appendChild(this.canvas);

		this.render = Matter.Render.create({
			engine: this.engine,
			canvas: this.canvas,
			options: {
				width: WORLD.width,
				height: WORLD.height,
				wireframes: true,
				background: '#000000',
			},
		});
	}

	toggle(): void {
		if (!this.render) this.setupCanvas();
		if (!this.canvas || !this.render) return;

		this.visible = !this.visible;
		this.canvas.style.display = this.visible ? 'block' : 'none';
		if (this.visible) Matter.Render.run(this.render);
		else Matter.Render.stop(this.render);
	}
}
