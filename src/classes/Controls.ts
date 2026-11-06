import Axis from 'axis-api';
import { useStore } from '../store/globalStore';
import type { Vec2Type } from '../matter/physics';
import { SceneManager } from '../three/scene';
export class GameControls {
	private static instance: GameControls;
	private stickX = 0;
	private leftHeld = false;
	private rightHeld = false;
	private jumpHeld = false;
	private jumpQueued = false;

	private constructor() {
		// Keyboard: AZERTY (ZQD), QWERTY (WAD) and arrows, group 1 and 2 of the Axis buttons.
		Axis.registerKeys(['q', 'Q', 'a', 'A'], 'a', 1);
		Axis.registerKeys(['d', 'D'], 'x', 1);
		Axis.registerKeys(['z', 'Z', 'w', 'W', ' '], 'i', 1);
		Axis.registerKeys(['s', 'S'], 's', 1);

		Axis.registerKeys('ArrowLeft', 'a', 2);
		Axis.registerKeys('ArrowRight', 'x', 2);
		Axis.registerKeys('ArrowUp', 'i', 2);
		Axis.registerKeys('ArrowDown', 's', 2);
		Axis.registerKeys('Enter', 'w', 2);

		// Gamepad (standard mapping): A jumps, stick or D-pad moves, X and B stay on a and x for the menus.
		const gamepadEmulator = Axis.createGamepadEmulator(0);
		Axis.registerGamepadEmulatorKeys(gamepadEmulator, 0, 'i', 1);
		Axis.registerGamepadEmulatorKeys(gamepadEmulator, [2, 14], 'a', 1);
		Axis.registerGamepadEmulatorKeys(gamepadEmulator, [1, 15], 'x', 1);
		Axis.registerGamepadEmulatorKeys(gamepadEmulator, 3, 's', 1);

		Axis.joystick1.setGamepadEmulatorJoystick(gamepadEmulator, 0);
		Axis.joystick2.setGamepadEmulatorJoystick(gamepadEmulator, 1);

		const updateGamepad = () => {
			gamepadEmulator.update();
			requestAnimationFrame(updateGamepad);
		};
		updateGamepad();

		window.addEventListener('blur', () => {
			this.leftHeld = false;
			this.rightHeld = false;
			this.jumpHeld = false;
		});
	}

	public static getInstance(): GameControls {
		if (!GameControls.instance) {
			GameControls.instance = new GameControls();
		}
		return GameControls.instance;
	}

	public getMoveAxis(): number {
		if (this.leftHeld !== this.rightHeld) return this.leftHeld ? -1 : 1;
		return this.leftHeld ? 0 : this.stickX;
	}

	public isJumpHeld(): boolean {
		return this.jumpHeld;
	}

	public consumeJumpPress(): boolean {
		const queued = this.jumpQueued;
		this.jumpQueued = false;
		return queued;
	}

	public clearJump(): void {
		this.jumpQueued = false;
	}

	public handleInputGamepad(e: { id: number; position: Vec2Type }) {
		if (e.id === 1) this.stickX = e.position.x;
	}

	public handleInputKeydown(e: { key: string; id: number }) {
		switch (e.key) {
			case 'a':
				if (this.leftHeld) break;
				this.leftHeld = true;
				if (useStore.getState().isGameOver) {
					useStore.setState({ score: 0 });
					SceneManager.getInstance(null).restart();
					useStore.setState({ restartButton: true });
				}
				break;
			case 'x':
				this.rightHeld = true;
				break;
			case 'i':
				// Keyboards repeat keydown while held: only a new press counts.
				if (this.jumpHeld) break;
				this.jumpHeld = true;
				this.jumpQueued = true;
				if (useStore.getState().isGameOver) {
					useStore.setState({ isEndAnimationPlaying: true });
					useStore.setState({ nextButton: true });
				}
				break;
			default:
				break;
		}
	}

	public handleInputKeyup(e: { key: string; id: number }) {
		switch (e.key) {
			case 'a':
				this.leftHeld = false;
				break;
			case 'x':
				this.rightHeld = false;
				break;
			case 'i':
				this.jumpHeld = false;
				break;
			default:
				break;
		}
	}

	public keyHandlerSetup() {
		Axis.addEventListener('keydown', this.handleInputKeydown.bind(this));
		Axis.addEventListener('keyup', this.handleInputKeyup.bind(this));
		Axis.addEventListener('joystick:move', this.handleInputGamepad.bind(this));
	}
}
