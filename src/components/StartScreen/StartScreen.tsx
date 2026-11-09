import { useState } from "react";
import "./startscreen.css";
import gameConfig from "../../config.json";

type DrawStartScreenProps = {
  bestResult?: number;
  showCartoon?: boolean;
  setShowCartoon?: (value: boolean) => void;
};

export function StartScreen({
  bestResult = 0,
  showCartoon = false,
  setShowCartoon,
}: DrawStartScreenProps) {
  if (bestResult >= 100) {
    return (
      <div className="start-background">
        {showCartoon && (
          <video
            className="cartoon"
            src={gameConfig.video.cartoon.replace(".png", ".mp4")}
            controls
            autoPlay
            onEnded={() => {
              if (setShowCartoon) {
                setShowCartoon(false);
              }
            }}
          />
        )}
        <div className="start-text-container">
          <div className="zcool-qingke-huangyou-regular start-text">
            Нажмите на клавишу для выбора режима
          </div>
          <button
            className="cartoon-btn"
            onClick={() => {
              if (setShowCartoon) {
                setShowCartoon(true);
              }
            }}
          >
            <div
              className="zcool-qingke-huangyou-regular start-text"
              title="Нажми на меня!"
            >
              Мультфильм разблокирован!
            </div>
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="start-background">
        <div className="start-text-container">
          <div className="zcool-qingke-huangyou-regular start-text">
            Нажмите на клавишу для выбора режима
          </div>
          <button className="cartoon-btn">
            <div
              className="zcool-qingke-huangyou-regular start-text"
              title="Наберите 100 очков в любом режиме для разблокировки."
            >
              Мультфильм заблокирован.
            </div>
          </button>
        </div>
      </div>
    );
  }
}
