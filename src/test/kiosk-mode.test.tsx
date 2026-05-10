import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useState } from "react";

function KioskHarness() {
  const [on, setOn] = useState(false);
  return (
    <div data-testid="root" className={on ? "kiosk-mode" : ""} data-kiosk={on ? "on" : "off"}>
      <button
        aria-pressed={on}
        aria-label={on ? "Desativar modo recepção" : "Ativar modo recepção"}
        onClick={() => setOn((v) => !v)}
      >
        {on ? "Sair" : "Recepção"}
      </button>
      <main>conteúdo</main>
    </div>
  );
}

describe("Modo Recepção (kiosk)", () => {
  beforeEach(() => localStorage.clear());

  it("começa desligado", () => {
    render(<KioskHarness />);
    const root = screen.getByTestId("root");
    expect(root).not.toHaveClass("kiosk-mode");
    expect(root).toHaveAttribute("data-kiosk", "off");
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  });

  it("ativa kiosk-mode ao clicar", () => {
    render(<KioskHarness />);
    fireEvent.click(screen.getByRole("button"));
    const root = screen.getByTestId("root");
    expect(root).toHaveClass("kiosk-mode");
    expect(root).toHaveAttribute("data-kiosk", "on");
  });

  it("alterna de volta para desligado", () => {
    render(<KioskHarness />);
    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(screen.getByTestId("root")).not.toHaveClass("kiosk-mode");
  });
});