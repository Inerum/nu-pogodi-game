import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { DrawTimer } from "./Buttons/Timer/Timer";

describe("Компонент DrawTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("рендерит кнопку с правильным классом и изображением", () => {
    render(<DrawTimer onClick={() => {}} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("timer");
    expect(button).toHaveClass("unpressed");

    const img = screen.getByAltText("timer");
    expect(img).toBeInTheDocument();
  });

  it("вызывает переданную функцию onClick при клике", () => {
    const handleClick = vi.fn();
    render(<DrawTimer onClick={handleClick} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("меняет класс на 'pressed' при клике и возвращает 'unpressed' через 200мс", () => {
    render(<DrawTimer onClick={() => {}} />);

    const button = screen.getByRole("button");

    expect(button).toHaveClass("unpressed");
    fireEvent.click(button);

    expect(button).toHaveClass("pressed");
    expect(button).not.toHaveClass("unpressed");

    vi.advanceTimersByTime(200);

    expect(button).not.toHaveClass("pressed");
    expect(button).toHaveClass("unpressed");
  });
});
