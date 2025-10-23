import Controls from "./controls";
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
    </>
  );
};

export default UiElements;
