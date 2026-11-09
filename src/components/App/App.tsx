import { useState, useEffect, useRef } from "react";
import "./app.css";
import { DrawButtonsMove } from "../Buttons/ButtonMove/ButtonMove";
import { DrawButtonsGame } from "../Buttons/ButtonGame/ButtonGame";
import { DrawTimer } from "../Buttons/Timer/Timer";
import { DrawWolf } from "../Wolf/Wolf";
import { Egg, BrokenEgg } from "../Egg/Egg";
import {
  playSound,
  pauseSound,
  reroll,
  useFormattedTime,
} from "../Effects/Effects";
import { LoseScreen } from "../LoseScreen/LoseScreen";
import { StartScreen } from "../StartScreen/StartScreen";
import gameConfig from "../../config.json";

type ActiveEgg = {
  id: number;
  lane: number;
  step: number;
};

type GameState = {
  eggs: ActiveEgg[];
  brokenEggs: number;
  caughtEggs: number;
};

export function App() {
  const { sounds, images, lanePositions, gameModes } = gameConfig;

  const currClickSound = useRef(0);
  const bgAudio = useRef<HTMLAudioElement | null>(null);

  const [showTime, setShowTime] = useState(false);
  const [time, setTime] = useState(new Date());
  const formattedTime = useFormattedTime(time, setTime);

  const [showCartoon, setShowCartoon] = useState(false);
  const [soundMake, setSoundMake] = useState(false);

  const bestAResult = useRef(0);
  const bestBResult = useRef(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string | null>(
    gameModes.A.name,
  );

  const [isMoveLocked, setIsMoveLocked] = useState(false);
  const [wolfX, setWolfX] = useState(-1);
  const [wolfY, setWolfY] = useState(-1);
  const wolfPosition = useRef({ x: -1, y: -1 });
  const currWolfSound = useRef(0);

  const [eggTimeout, setEggTimeout] = useState(gameModes.A.timeout);
  const nextEggId = useRef(0);
  const [gameState, setGameState] = useState<GameState>({
    eggs: [],
    brokenEggs: 0,
    caughtEggs: 0,
  });

  const handleMakeSound = () => {
    setSoundMake(true);
    setTimeout(() => {
      setSoundMake(false);
    }, 500);
  };

  const checkGameOver = () => {
    if (gameOver) {
      if (bgAudio.current) {
        pauseSound(bgAudio.current);
      }
      bgAudio.current = playSound(sounds.music.lose, true, 1);
      return true;
    }
    return false;
  };

  const checkGameStarted = () => {
    if (!gameStarted) {
      if (bgAudio.current) {
        pauseSound(bgAudio.current);
      }
      bgAudio.current = playSound(sounds.music.start, true, 1);
      return false;
    }
    return true;
  };

  const handleRestart = () => {
    setGameOver(false);
    setGameState({ eggs: [], brokenEggs: 0, caughtEggs: 0 });
    setWolfX(-1);
    setWolfY(-1);
    setIsMoveLocked(false);
    setGameStarted(false);
    setShowCartoon(false);
    pauseSound(bgAudio.current);
    bgAudio.current = playSound(sounds.music.gameBg, true, 0.5);
    nextEggId.current = 0;
    wolfPosition.current = { x: -1, y: -1 };
    currClickSound.current = reroll(sounds.clicks.length, 0);
    currWolfSound.current = reroll(sounds.wolf.length, 0);
  };

  const handleGameSelect = (button: string) => {
    if (!bgAudio.current) {
      bgAudio.current = playSound(sounds.music.gameBg, true, 0.5);
    }
    const mode = button === "A" ? gameModes.A : gameModes.B;
    setSelectedGame(mode.name);
    setEggTimeout(mode.timeout);
    handleRestart();
    setGameStarted(true);
  };

  const handleMove = (direction: string) => {
    if (isMoveLocked) return;

    let changed = false;
    let newX = wolfX;
    let newY = wolfY;

    switch (direction) {
      case "buttonDownRight":
        newX = 1;
        newY = 1;
        changed = true;
        break;
      case "buttonUpRight":
        newX = 1;
        newY = -1;
        changed = true;
        break;
      case "buttonUpLeft":
        newX = -1;
        newY = -1;
        changed = true;
        break;
      case "buttonDownLeft":
        newX = -1;
        newY = 1;
        changed = true;
        break;

      case "ArrowLeft":
      case "KeyA":
        newX = -1;
        changed = true;
        break;
      case "ArrowRight":
      case "KeyD":
        newX = 1;
        changed = true;
        break;
      case "ArrowUp":
      case "KeyW":
        newY = -1;
        changed = true;
        break;
      case "ArrowDown":
      case "KeyS":
        newY = 1;
        changed = true;
        break;
    }

    if (changed) {
      setWolfX(newX);
      setWolfY(newY);
      wolfPosition.current = { x: newX, y: newY };

      setIsMoveLocked(true);
      setTimeout(() => {
        setIsMoveLocked(false);
      }, 150);
    }
  };

  useEffect(() => {
    if (showCartoon && bgAudio.current) {
      pauseSound(bgAudio.current);
    }
  }, [showCartoon]);

  useEffect(() => {
    if (gameOver) {
      const timer = setTimeout(() => {
        setGameOver(false);
        setGameStarted(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [gameOver, gameStarted]);

  useEffect(() => {
    bgAudio.current = playSound(sounds.music.start, true, 0.5);
    return () => {
      if (bgAudio.current) {
        pauseSound(bgAudio.current);
      }
    };
  }, []);

  useEffect(() => {
    if (checkGameOver()) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      handleMove(event.code);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMoveLocked, wolfX, wolfY]);

  useEffect(() => {
    if (!checkGameStarted() || checkGameOver()) return;
    const interval = setInterval(() => {
      const { x, y } = wolfPosition.current;

      const newEgg: ActiveEgg = {
        id: ++nextEggId.current,
        lane: Math.floor(Math.random() * lanePositions.length),
        step: 1,
      };

      let totalBroken = 0;
      let caughtAnyEggs = false;
      let brokeAnyEggs = false;

      setGameState((prev) => {
        let newlyBroken = 0;
        let newlyCaught = 0;

        const remainingEggs = prev.eggs
          .map((egg) => ({
            ...egg,
            step: egg.step + 1,
          }))
          .filter((egg) => {
            if (egg.step < 6) return true;

            const target = lanePositions[egg.lane];
            const caught = x === target.x && y === target.y;

            if (!caught) {
              newlyBroken++;
            } else {
              newlyCaught++;
            }

            return false;
          });

        if (newlyCaught) caughtAnyEggs = true;
        if (newlyBroken) brokeAnyEggs = true;

        totalBroken = newlyBroken + prev.brokenEggs;
        const totalCaught = newlyCaught + prev.caughtEggs;

        if (totalBroken >= 3) {
          if (eggTimeout === gameModes.A.timeout) {
            bestAResult.current = Math.max(bestAResult.current, totalCaught);
          } else {
            bestBResult.current = Math.max(bestBResult.current, totalCaught);
          }
          setGameOver(true);
        }

        return {
          eggs: [...remainingEggs, newEgg],
          brokenEggs: totalBroken,
          caughtEggs: totalCaught,
        };
      });

      if (caughtAnyEggs) {
        playSound(sounds.wolf[currWolfSound.current], false, 0.1);
        currWolfSound.current = reroll(sounds.wolf.length, 0);
        handleMakeSound();
      }
      if (brokeAnyEggs) {
        playSound(sounds.brokenEggs[totalBroken - 1], false, 0.1);
        handleMakeSound();
      }
    }, eggTimeout);

    return () => clearInterval(interval);
  }, [eggTimeout, gameOver, gameStarted]);

  const triggerClickSound = () => {
    playSound(sounds.clicks[currClickSound.current], false, 0.8);
    currClickSound.current = reroll(sounds.clicks.length, 0);
  };

  return (
    <div
      className="game-container"
      onPointerDown={(e) => {
        if (e.pointerType === "touch") {
          e.preventDefault();
        }
      }}
    >
      <div
        onPointerDown={(e) => {
          e.preventDefault();
          triggerClickSound();
          setShowTime(!showTime);
        }}
      >
        <DrawTimer onClick={() => {}} />
      </div>

      <div onPointerDown={(e) => e.preventDefault()}>
        <DrawButtonsGame
          onButtonClick={(btn) => {
            handleGameSelect(btn);
            triggerClickSound();
          }}
        />
      </div>

      <div onPointerDown={(e) => e.preventDefault()}>
        <DrawButtonsMove
          onDirectionClick={(dir) => {
            handleMove(dir);
            triggerClickSound();
          }}
        />
      </div>

      {!gameStarted && (
        <StartScreen
          showCartoon={showCartoon}
          setShowCartoon={setShowCartoon}
          bestResult={bestAResult.current}
        />
      )}

      {!gameOver && gameStarted && <DrawWolf x={wolfX} y={wolfY} />}

      {!gameOver &&
        gameStarted &&
        gameState.eggs.map((egg) => (
          <Egg key={egg.id} positionIndex={egg.step} laneIndex={egg.lane} />
        ))}
      {!gameOver &&
        gameStarted &&
        Array.from({ length: gameState.brokenEggs }).map((_, index) => (
          <BrokenEgg key={index} positionIndex={index} />
        ))}
      {gameOver && gameStarted && (
        <LoseScreen
          bestResult={
            eggTimeout === gameModes.A.timeout
              ? bestAResult.current
              : bestBResult.current
          }
          currResult={gameState.caughtEggs}
        />
      )}

      {gameStarted && !gameOver && selectedGame && (
        <div className="selected-game font">{selectedGame}</div>
      )}
      <div className="zcool-qingke-huangyou-regular caught-eggs">
        {gameStarted && !gameOver && gameState.caughtEggs}
      </div>

      {(!gameStarted || gameOver) && !showCartoon && showTime && (
        <div className="zcool-qingke-huangyou-regular time-container">
          {formattedTime}
        </div>
      )}

      <img
        src={images.console.background}
        alt="background"
        className="background"
      />
      <img src={images.console.overlay} alt="overlay" className="overlay" />
      {showTime && (
        <div>
          <img
            src={images.light["light-big"]}
            alt="lighbig-time"
            className="lightbig-timer"
          />
          <img
            src={images.light["light-small"]}
            alt="lightsmall-time"
            className="lightsmall-timer"
          />
        </div>
      )}
      {soundMake && (
        <div>
          <img
            src={images.light["light-big"]}
            alt="lighbig-sound"
            className="lightbig-sound"
          />
          <img
            src={images.light["light-small"]}
            alt="lightsmall-sound"
            className="lightsmall-sound"
          />
        </div>
      )}
    </div>
  );
}
