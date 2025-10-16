import Axis from "axis-api";
import { useStore } from "../store/globalStore";
import type { Vec2Type } from "../matter/physics";


export class GameControls {
  private static instance: GameControls;
  private gamepadSpeed: Vec2Type = {x: 0, y: 0};
  private keysPressed : boolean[] = [false, false, false];
  private moveSpeed: number;

	private constructor() {
    this.moveSpeed = window.innerHeight * 0.0006;
    console.log("this.gamepadSpeed",this.gamepadSpeed);
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

	public getSpeed = () => {
	  const speed = {x: this.gamepadSpeed.x, y: this.gamepadSpeed.y};
	  if (this.keysPressed[0]){
			this.keysPressed[0] = false;
			this.gamepadSpeed.y = 0;
	  }
		return speed;
	}

	public static getInstance(): GameControls {
        if (!GameControls.instance) {
            GameControls.instance = new GameControls();
        }
        return GameControls.instance;
    }


	public handleInputGamepad(e : Axis.GamepadEmulatorEvent) {
		// Now this will correctly receive events from both joysticks
    // console.log(e);
		if (e.id === 1) {
			// console.log(
			// 	"Joystick 1 (Left):",
			// 	speed * e.position.x,
			// 	speed * e.position.y
			// );
			// console.log(this.gamepadSpeed);
			this.gamepadSpeed.x = this.moveSpeed * e.position.x;
			this.gamepadSpeed.y = this.moveSpeed * e.position.y;
		}

		// if (e.id === 2) {
		// 	const speed = 50;
		// 	console.log(
		// 		"Joystick 2 (Right):",
		// 		speed * e.position.x,
		// 		speed * e.position.y
		// 	);
		// }
	}

	public handleInputKeyboard(event: KeyboardEvent) {
		const gameState = useStore.getState();
		if (gameState.game_status === "game_over") return;
		console.log(this.gamepadSpeed, event, event.key);

		switch (event.key) {
			// case "i":
			//   this.keysPressed[0] = true;
			// 	console.log("Move player up");
			// 	break;
			// case "s":
			//   this.keysPressed[2] = true;
			// 	console.log("Move player down");
			// 	break;
			case "a":
			this.keysPressed[1] = true;
				console.log("Move player left");
				break;
			case "x":
			this.keysPressed[2] = true;
				console.log("Move player right");
				break;
      case "i":
      this.keysPressed[0] = true;
        break;
			default:
				break;
		}
		this.updateKeySpeed();
	};

	public handleRemoveInputKeyboard(event: KeyboardEvent) {
		switch (event.key) {
			// case "i":
			// this.keysPressed[0] = false;
			// 	console.log("Move player up");
			// 	break;
			// case "s":
			// this.keysPressed[2] = false;
			// 	console.log("Move player down");
			// 	break;
			case "a":
			this.keysPressed[1] = false;
				console.log("Move player left");
				break;
			case "x":
			this.keysPressed[2] = false;
				console.log("Move player right");
				break;
			default:
				break;
		}
		this.updateKeySpeed();
	};

	private updateKeySpeed() {
		this.gamepadSpeed.x = this.keysPressed[1] && !this.keysPressed[2] ? -this.moveSpeed : (!this.keysPressed[1] && this.keysPressed[2])? this.moveSpeed : 0;
		if (this.keysPressed[0]){
			this.gamepadSpeed.y = -this.moveSpeed * 20;
			console.log("Move player up");
		}
	}

	public keyHandlerSetup() {
		Axis.addEventListener("keydown", this.handleInputKeyboard.bind(this));
		Axis.addEventListener("keyup", this.handleRemoveInputKeyboard.bind(this));
		Axis.addEventListener("joystick:move", this.handleInputGamepad.bind(this));
		Axis.addEventListener("joystick:button", this.handleInputKeyboard.bind(this));
	}
}
