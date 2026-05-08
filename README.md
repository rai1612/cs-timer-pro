# CS Timer Pro

A simple, keyboard-first 3x3 cubing timer with accurate stopwatch timing, scramble generation, session persistence, and core solve stats.

## Features

- **Spacebar timer flow**
  - Hold/press `Space` to arm (timer turns green)
  - Release `Space` to start
  - Press `Space` again to stop
- **Accurate timing**
  - Internally tracked in centiseconds using `performance.now()`
  - Running display uses a lighter precision view for readability
  - Final solve values are stored/rendered at two-decimal precision
- **Dynamic timer display**
  - `< 1 minute`: `S.T` (running) / `S.CS` (stopped)
  - `< 1 hour`: `M:SS.T` / `M:SS.CS`
  - `>= 1 hour`: `H:MM:SS.T` / `H:MM:SS.CS`
- **Scramble generation (20 moves)**
  - Uses faces `U D L R F B` with modifiers ``, `'`, `2`
  - Avoids consecutive same-face moves
  - Avoids consecutive same-axis moves (`U/D`, `L/R`, `F/B`)
- **Stats tracking**
  - PB (Personal Best)
  - PW (Personal Worst)
  - Ao5 (average of 5, best/worst removed)
  - Ao12 (average of 12, best/worst removed)
  - Per-solve rows include solve number, time, Ao5, Ao12
- **Persistence**
  - Solves and derived stats are restored from `localStorage`
  - Data persists across reloads/sessions until reset
- **Reset Session**
  - Clears solve history, stats, and persisted data

## Tech

- Vanilla HTML/CSS/JavaScript
- No build step required

## Run locally

1. Clone the repository
2. Open `index.html` in a browser

## Notes

- This project currently uses a constrained random-move scramble generator suitable for everyday practice.
- Official WCA competition scrambles use random-state generation (e.g., TNoodle), which is a stricter standard.
