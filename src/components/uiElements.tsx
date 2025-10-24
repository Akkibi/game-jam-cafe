// import BlocksDebug from "./BlocksDebug";
import Controls from "./controls";
import End from "./end";
import EndButtons from "./endButtons";
import MultBar from "./multBar";
import Score from "./score";
import Start from "./start";

const UiElements = () => {
	return (
		<>
			{/* <BlocksDebug /> */}
			<Score />
			<MultBar />
			<Start />
			<Controls />
			<EndButtons />
			<End />
		</>
	);
};

export default UiElements;
