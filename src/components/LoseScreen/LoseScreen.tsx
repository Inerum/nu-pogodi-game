import "./losescreen.css";

type DrawLoseScreenProps = {
  bestResult?: number;
  currResult?: number;
};

export function LoseScreen({
  bestResult = 0,
  currResult = 0,
}: DrawLoseScreenProps) {
  if (bestResult <= currResult) {
    return (
      <div className="lose-background">
        <div className="zcool-qingke-huangyou-regular lose-text">
          Новый рекорд:
        </div>
        <div className="zcool-qingke-huangyou-regular lose-text">
          {currResult}
        </div>
      </div>
    );
  } else {
    return (
      <div className="lose-background">
        <div className="zcool-qingke-huangyou-regular lose-text">
          Лучший результат в этом режиме: {bestResult}
        </div>
        <div className="zcool-qingke-huangyou-regular lose-text">
          Текущий результат: {currResult}
        </div>
      </div>
    );
  }
}
