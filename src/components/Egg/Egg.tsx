import "./egg.css";
import { images } from "../../config.json";

type EggProps = {
  positionIndex: number;
  laneIndex: number;
};

export function Egg({ positionIndex, laneIndex }: EggProps) {
  const eggClass = "egg " + "pos" + laneIndex + "-" + positionIndex;

  return (
    <div className={eggClass}>
      <img src={images.egg.egg} alt="egg" />
    </div>
  );
}

type BrokenEggProps = {
  positionIndex: number;
};

export function BrokenEgg({ positionIndex }: BrokenEggProps) {
  const brokenEggClass = "egg " + "broken-pos" + positionIndex;

  return (
    <div className={brokenEggClass}>
      <img src={images.egg["broken-egg"]} alt="broken-egg" />
    </div>
  );
}
