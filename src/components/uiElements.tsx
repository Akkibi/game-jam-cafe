import Controls from "./controls";
import EndButtons from "./endButtons";
import MultBar from "./multBar";
import Score from "./score";
import Start from "./start";

const UiElements = () => {
  return (
    <>
      <Score />
      <MultBar />
      <Start />
      <Controls />
      <EndButtons />
    </>
  );
};

export default UiElements;
