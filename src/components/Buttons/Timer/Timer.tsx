import { useState } from "react";
import "./timer.css";
import { images } from "../../../config.json";

type DrawTimerProps = {
  onClick: () => void;
};

export function DrawTimer({ onClick }: DrawTimerProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    onClick();
    setTimeout(() => {
      setIsPressed(false);
    }, 200);
  };

  const fullClassName = `timer ${isPressed ? "pressed" : "unpressed"}`;

  return (
    <button className={fullClassName} onClick={handleClick}>
      <img src={images.buttons["button-game"]} alt="timer" />
    </button>
  );
}
