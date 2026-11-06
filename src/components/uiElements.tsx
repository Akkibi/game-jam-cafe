// import BlocksDebug from "./BlocksDebug";
import Controls from './controls';
import End from './end';
import EndButtons from './endButtons';
import MultBar from './multBar';
import RotatePopup from './rotatePopup';
import Score from './score';
import Start from './start';
import TouchControls from './touchControls';
import { isTouchDevice } from '../utils/device';
import { useStore } from '../store/globalStore';

const UiElements = () => {
	const hasEnteredLandscape = useStore((s) => s.hasEnteredLandscape);

	return (
		<>
			{/* <BlocksDebug /> */}
			{hasEnteredLandscape && (
				<>
					<Score />
					<MultBar />
					<Start />
					{!isTouchDevice && <Controls />}
					<EndButtons />
					<End />
					<TouchControls />
				</>
			)}
			<RotatePopup />
		</>
	);
};

export default UiElements;
