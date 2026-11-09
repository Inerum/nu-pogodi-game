import { useState } from "react";
import "./buttongame.css";
import { images } from "../../../config.json";

type DrawButtonsGameProps = {
  onButtonClick: (buttonName: string) => void;
};

export function DrawButtonsGame({ onButtonClick }: DrawButtonsGameProps) {
  return (
    <div>
      <DrawButtonGame
        buttonClassName="button buttonA"
        name="buttonDownRight"
        onClick={() => onButtonClick("A")}
      />
      <DrawButtonGame
        buttonClassName="button buttonB"
        name="buttonUpLeft"
        onClick={() => onButtonClick("B")}
      />
    </div>
  );
}

type DrawButtonMoveProps = {
  buttonClassName?: string;
  name?: string;
  onClick: () => void;
};

function DrawButtonGame({
  buttonClassName = "button buttonA",
  name = "buttonA",
  onClick,
}: DrawButtonMoveProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    onClick();
    setTimeout(() => {
      setIsPressed(false);
    }, 200);
  };

  const fullClassName = `${buttonClassName} ${isPressed ? "pressed" : "unpressed"}`;

  return (
    <button className={fullClassName} onClick={handleClick}>
      <img src={images.buttons["button-game"]} alt={name} />
    </button>
  );
}
