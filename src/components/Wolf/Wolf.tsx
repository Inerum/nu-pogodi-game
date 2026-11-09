import "./wolf.css";
import { images } from "../../config.json";

type WolfProps = {
  x?: number;
  y?: number;
};

export function DrawWolf({ x, y }: WolfProps) {
  const { wolf } = images;

  if (x === -1 && y === -1) {
    return (
      <div>
        <img className="wolf-left" src={wolf["wolf-left"]} alt="wolf-left" />
        <img className="arms-left-up" src={wolf.arms} alt="arms-left-up" />
      </div>
    );
  } else if (x === -1 && y === 1) {
    return (
      <div>
        <img className="wolf-left" src={wolf["wolf-left"]} alt="wolf-left" />
        <img className="arms-left-down" src={wolf.arms} alt="arms-left-down" />
      </div>
    );
  } else if (x === 1 && y === -1) {
    return (
      <div>
        <img className="wolf-right" src={wolf["wolf-right"]} alt="wolf-right" />
        <img className="arms-right-up" src={wolf.arms} alt="arms-right-up" />
      </div>
    );
  } else {
    return (
      <div>
        <img className="wolf-right" src={wolf["wolf-right"]} alt="wolf-right" />
        <img
          className="arms-right-down"
          src={wolf.arms}
          alt="arms-right-down"
        />
      </div>
    );
  }
}
