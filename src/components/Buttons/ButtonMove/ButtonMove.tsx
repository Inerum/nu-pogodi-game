import { useState } from "react";
import "./buttonmove.css";
import { images } from "../../../config.json";

type DrawButtonsMoveProps = {
  onDirectionClick: (direction: string) => void;
};

export function DrawButtonsMove({ onDirectionClick }: DrawButtonsMoveProps) {
  return (
    <div>
      <DrawButtonMove
        buttonClassName="button button-down-right"
        name="buttonDownRight"
        onClick={() => onDirectionClick("buttonDownRight")}
      />
      <DrawButtonMove
        buttonClassName="button button-up-left"
        name="buttonUpLeft"
        onClick={() => onDirectionClick("buttonUpLeft")}
      />
      <DrawButtonMove
        buttonClassName="button button-down-left"
        name="buttonDownLeft"
        onClick={() => onDirectionClick("buttonDownLeft")}
      />
      <DrawButtonMove
        buttonClassName="button button-up-right"
        name="buttonUpRight"
        onClick={() => onDirectionClick("buttonUpRight")}
      />
    </div>
  );
}

type DrawButtonMoveProps = {
  buttonClassName?: string;
  name?: string;
  onClick: () => void;
};

function DrawButtonMove({
  buttonClassName = "button button-down-right",
  name = "buttonDownRight",
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
      <img src={images.buttons["button-move"]} alt={name} />
    </button>
  );
}
