import { Controls } from "./classes/Controls";
import ThreeManager from "./three/threeScene";

function App() {
	const controls = new Controls();

	controls.keyHandlerSetup();

	return <ThreeManager />;
}

export default App;
