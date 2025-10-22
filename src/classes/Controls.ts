import Axis from "axis-api";
import { useStore } from "../store/globalStore";
import type { Vec2Type } from "../matter/physics";

export class GameControls {
	private static instance: GameControls;
	private gamepadSpeed: Vec2Type = { x: 0, y: 0 };
	private keysPressed: { [key: string]: boolean } = {
		i: false, // For jump
		a: false, // For left
		x: false, // For right
		s: false, // For down (though not used in your current logic)
	};
	private moveSpeed: number;
	private jumpSpeed: number;

	private constructor() {
		this.moveSpeed = window.innerHeight * 0.0006;
		this.jumpSpeed = -this.moveSpeed * 20; // Ensure jump is an upward force
		// console.log("GameControls initialized");

		// Map Keyboard Keys to Axis Machine Buttons from group 1
		Axis.registerKeys("q", "a", 1); // keyboard key "q" to button "a" from group 1
		Axis.registerKeys("d", "x", 1); // keyboard key "d" to button "x" from group 1
		Axis.registerKeys("z", "i", 1); // keyboard key "z" to button "i" from group 1 (Jump)
		Axis.registerKeys("s", "s", 1); // keyboard key "s" to button "s" from group 1
		Axis.registerKeys(" ", "w", 1); // keyboard key Space to button "w" from group 1

		// Map Keyboard Keys to Axis Machine Buttons from group 2
		Axis.registerKeys("ArrowLeft", "a", 2); // keyboard key "ArrowLeft" to button "a" from group 2
		Axis.registerKeys("ArrowRight", "x", 2); // keyboard key "ArrowRight" to button "x" from group 2
		Axis.registerKeys("ArrowUp", "i", 2); // keyboard key "ArrowUp" to button "i" from group 2
		Axis.registerKeys("ArrowDown", "s", 2); // keyboard key "ArrowDown" to button "s" from group 2
		Axis.registerKeys("Enter", "w", 2); // keyboard key "Enter" to button "w" from group 2

		// Create a gamepad emulator for the first connected controller (index 0)
		const gamepadEmulator = Axis.createGamepadEmulator(0);

		// --- Gamepad Button Mapping (Xbox Controller) ---
		// Assuming standard Xbox button mapping:
		// A = 0, B = 1, X = 2, Y = 3
		Axis.registerGamepadEmulatorKeys(gamepadEmulator, 0, "a", 1); // Gamepad button 0 (A on Xbox) -> Axis 'a'
		Axis.registerGamepadEmulatorKeys(gamepadEmulator, 1, "x", 1); // Gamepad button 1 (B on Xbox) -> Axis 'x'
		Axis.registerGamepadEmulatorKeys(gamepadEmulator, 2, "i", 1); // Gamepad button 2 (X on Xbox) -> Axis 'i' (Jump)
		Axis.registerGamepadEmulatorKeys(gamepadEmulator, 3, "s", 1); // Gamepad button 3 (Y on Xbox) -> Axis 's'

		// --- Joystick Mapping ---
		Axis.joystick1.setGamepadEmulatorJoystick(gamepadEmulator, 0); // Left stick (index 0) to Axis joystick 1
		Axis.joystick2.setGamepadEmulatorJoystick(gamepadEmulator, 1); // Right stick (index 1) to Axis joystick 2

		// Function to update the gamepad state each frame
		const updateGamepad = () => {
			gamepadEmulator.update();
			requestAnimationFrame(updateGamepad);
		};
		updateGamepad();
	}

	public getSpeed = (): Vec2Type => {
		const speed = { x: this.gamepadSpeed.x, y: this.gamepadSpeed.y };

		// Reset vertical speed only if it was from a jump.
		// This makes `keysPressed['i']` act as a trigger, not a constant force.
		if (this.keysPressed["i"]) {
			this.keysPressed["i"] = false; // Consume the jump
			this.gamepadSpeed.y = 0; // Reset after applying the initial jump force
		}

		return speed;
	};

	public static getInstance(): GameControls {
		if (!GameControls.instance) {
			GameControls.instance = new GameControls();
		}
		return GameControls.instance;
	}

	// Handles continuous joystick input
	public handleInputGamepad(e: { id: number; position: Vec2Type }) {
		if (e.id === 1) {
			// Assuming player 1 uses joystick 1
			this.gamepadSpeed.x = this.moveSpeed * e.position.x;
			// Vertical movement from joystick (if needed, otherwise leave to jump button)
			// this.gamepadSpeed.y = this.moveSpeed * e.position.y;
		}
	}

	// Handles button presses (keyboard or mapped gamepad buttons)
	public handleInputKeydown(e: { key: string; id: number }) {
		const gameState = useStore.getState();
		if (gameState.game_status === "game_over") return;

		// console.log("Keydown event:", e.key, "Source ID:", e.id);

		switch (e.key) {
			case "a": // Left
				this.keysPressed["a"] = true;
				break;
			case "x": // Right
				this.keysPressed["x"] = true;
				break;
			case "i": // Jump
				// Only apply jump force if not currently jumping or if your game allows mid-air jumps
				if (
					this.gamepadSpeed.y === 0 ||
					/* allow double jump logic */ false
				) {
					this.keysPressed["i"] = true;
					this.gamepadSpeed.y = this.jumpSpeed; // Apply immediate upward velocity
					// console.log("Jump initiated with key 'i'");
				}
				break;
			// case "s": // Down
			//     this.keysPressed['s'] = true;
			//     break;
			default:
				break;
		}
		this.updateCombinedSpeed(); // Update horizontal speed based on button states
	}

	// Handles button releases (keyboard or mapped gamepad buttons)
	public handleInputKeyup(e: { key: string; id: number }) {
		// console.log("Keyup event:", e.key, "Source ID:", e.id);

		switch (e.key) {
			case "a": // Left
				this.keysPressed["a"] = false;
				break;
			case "x": // Right
				this.keysPressed["x"] = false;
				break;
			// For 'i' (jump), we don't necessarily set keysPressed['i'] to false here
			// because the jump itself is an impulse, not a continuous hold.
			// The `getSpeed` function now handles consuming the jump flag.
			// case "s": // Down
			//     this.keysPressed['s'] = false;
			//     break;
			default:
				break;
		}
		this.updateCombinedSpeed(); // Update horizontal speed based on button states
	}

	// Updates horizontal movement based on button presses (for keyboard and gamepad mapped buttons)
	private updateCombinedSpeed() {
		if (this.keysPressed["a"] && !this.keysPressed["x"]) {
			this.gamepadSpeed.x = -this.moveSpeed;
		} else if (!this.keysPressed["a"] && this.keysPressed["x"]) {
			this.gamepadSpeed.x = this.moveSpeed;
		} else {
			this.gamepadSpeed.x = 0; // Stop horizontal movement if no direction or both directions are pressed
		}
		// Note: vertical speed is directly set on jump, not continuously updated here for buttons
	}

	public keyHandlerSetup() {
		Axis.addEventListener("keydown", this.handleInputKeydown.bind(this));
		Axis.addEventListener("keyup", this.handleInputKeyup.bind(this));
		Axis.addEventListener(
			"joystick:move",
			this.handleInputGamepad.bind(this)
		);
		// Removed the non-existent "joystick:button" listener
	}
}
