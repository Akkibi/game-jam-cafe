import Axis from "axis-api";
import { useStore } from "../store/globalStore";

export class Controls {
	constructor() {
		// Map Keyboard Keys to Axis Machine Buttons from group 1
		Axis.registerKeys("q", "a", 1); // keyboard key "q" to button "a" from group 1
		Axis.registerKeys("d", "x", 1); // keyboard key "d" to button "x" from group 1
		Axis.registerKeys("z", "i", 1); // keyboard key "z" to button "i" from group 1
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

		// --- Gamepad Button Mapping ---
		// Map Gamepad buttons to Axis machine buttons for group 1
		Axis.registerGamepadEmulatorKeys(gamepadEmulator, 0, "a", 1); // Gamepad button 0 (e.g., A on Xbox, X on PS4)
		Axis.registerGamepadEmulatorKeys(gamepadEmulator, 1, "x", 1); // Gamepad button 1 (e.g., B on Xbox, Square on PS4)
		Axis.registerGamepadEmulatorKeys(gamepadEmulator, 2, "i", 1); // Gamepad button 2 (e.g., X on Xbox, Circle on PS4)
		Axis.registerGamepadEmulatorKeys(gamepadEmulator, 3, "s", 1); // Gamepad button 3 (e.g., Y on Xbox, Triangle on PS4)

		// --- Joystick Mapping ---
		// Map the controller's left stick (index 0) to the machine's first joystick
		Axis.joystick1.setGamepadEmulatorJoystick(gamepadEmulator, 0);

		// ADDED: Map the controller's right stick (index 1) to the machine's second joystick
		Axis.joystick2.setGamepadEmulatorJoystick(gamepadEmulator, 1);

		// Function to update the gamepad state each frame
		function update() {
			gamepadEmulator.update();
			requestAnimationFrame(update);
		}

		update();
	}

	public handleInputGamepad(e) {
		// Now this will correctly receive events from both joysticks
		if (e.id === 1) {
			const speed = 50;
			console.log(
				"Joystick 1 (Left):",
				speed * e.position.x,
				speed * e.position.y
			);
		}

		if (e.id === 2) {
			const speed = 50;
			console.log(
				"Joystick 2 (Right):",
				speed * e.position.x,
				speed * e.position.y
			);
		}
	}

	public handleInputKeyboard(event: KeyboardEvent) {
		const gameState = useStore.getState();
		if (gameState.game_status === "game_over") return;

		console.log(event.type, event.key);

		switch (event.key) {
			case "ArrowUp":
				console.log("Move player up");
				break;
			case "ArrowDown":
				console.log("Move player down");
				break;
			case "ArrowLeft":
				console.log("Move player left");
				break;
			case "ArrowRight":
				console.log("Move player right");
				break;
			case "a":
				console.log("A pressed");
				break;
			case "d":
				console.log("D pressed");
				break;
			case " ":
				console.log("Space pressed");
				break;
			default:
				break;
		}
	}

	public keyHandlerSetup() {
		Axis.addEventListener("keydown", this.handleInputKeyboard);
		Axis.addEventListener("keyup", this.handleInputKeyboard);
		Axis.addEventListener("joystick:move", this.handleInputGamepad);
	}
}
