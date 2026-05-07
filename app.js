const movesByFace = {
  U: [
    { src: "./images/U.png", title: "U" },
    { src: "./images/U'.png", title: "U'" },
    { src: "./images/U2.png", title: "U2" },
  ],
  D: [
    { src: "./images/D.png", title: "D" },
    { src: "./images/D'.png", title: "D'" },
    { src: "./images/D2.png", title: "D2" },
  ],
  L: [
    { src: "./images/L.png", title: "L" },
    { src: "./images/L'.png", title: "L'" },
    { src: "./images/L2.png", title: "L2" },
  ],
  R: [
    { src: "./images/R.png", title: "R" },
    { src: "./images/R'.png", title: "R'" },
    { src: "./images/R2.png", title: "R2" },
  ],
  F: [
    { src: "./images/F.png", title: "F" },
    { src: "./images/F'.png", title: "F'" },
    { src: "./images/F2.png", title: "F2" },
  ],
  B: [
    { src: "./images/B.png", title: "B" },
    { src: "./images/B'.png", title: "B'" },
    { src: "./images/B2.png", title: "B2" },
  ],
};
const faceAxis = {
  U: "UD",
  D: "UD",
  L: "LR",
  R: "LR",
  F: "FB",
  B: "FB",
};
const faces = Object.keys(movesByFace);
const SCRAMBLE_LENGTH = 20;
// element selectors
const moveContainer = document.querySelectorAll(".move-container");
const time = document.querySelector(".time");
function generateScrambleSequence(length) {
  const scramble = [];
  let previousFace = null;
  let previousAxis = null;

  for (let i = 0; i < length; i++) {
    const candidateFaces = faces.filter(function (face) {
      return face !== previousFace && faceAxis[face] !== previousAxis;
    });
    const pickedFace =
      candidateFaces[Math.floor(Math.random() * candidateFaces.length)];
    const variants = movesByFace[pickedFace];
    const pickedMove = variants[Math.floor(Math.random() * variants.length)];

    scramble.push(pickedMove);
    previousFace = pickedFace;
    previousAxis = faceAxis[pickedFace];
  }

  return scramble;
}

function generateAlgorithm() {
  const scramble = generateScrambleSequence(SCRAMBLE_LENGTH);
  moveContainer.forEach(function (move, index) {
    const currentMove = scramble[index];
    if (!currentMove) {
      move.innerHTML = "";
      return;
    }
    move.innerHTML = `<img src="${currentMove.src}" alt="${currentMove.title}" class="move-img" />
      <h4>${currentMove.title}</h4>`;
  });
}
const pb = document.querySelector(".pb");
const pw = document.querySelector(".pw");
const statistics = document.querySelector(".statistics");
const avgOf5 = document.querySelector(".ao5");
const avgOf12 = document.querySelector(".ao12");
const EMPTY_TIME_VALUE = "--:--.--";
const STORAGE_KEY = "cs-timer-pro-state-v1";

let solvesCs = [];
let timerStatus = false;
let animationFrameId = 0;
let timerStartMs = 0;
let elapsedCs = 0;
let lastRenderedCs = -1;

window.addEventListener("DOMContentLoaded", initializeApp);

function initializeApp() {
  generateAlgorithm();
  loadState();
  time.textContent = formatTimerDisplay(0, 2);
  renderStatsBoard();
}

function padTwoDigits(value) {
  return String(value).padStart(2, "0");
}

function formatElapsed(totalCentiseconds, decimalPlaces = 2) {
  const safeCentiseconds = Math.max(0, Math.floor(totalCentiseconds));
  const centiseconds = safeCentiseconds % 100;
  const decimalPart =
    decimalPlaces === 1 ? String(Math.floor(centiseconds / 10)) : padTwoDigits(centiseconds);
  const totalSeconds = Math.floor(safeCentiseconds / 100);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);

  if (hours > 0) {
    return `${padTwoDigits(hours)}:${padTwoDigits(minutes)}:${padTwoDigits(
      seconds
    )}.${decimalPart}`;
  }

  return `${padTwoDigits(minutes)}:${padTwoDigits(seconds)}.${decimalPart}`;
}

function formatTimerDisplay(totalCentiseconds, decimalPlaces = 2) {
  const safeCentiseconds = Math.max(0, Math.floor(totalCentiseconds));
  const centiseconds = safeCentiseconds % 100;
  const decimalPart =
    decimalPlaces === 1 ? String(Math.floor(centiseconds / 10)) : padTwoDigits(centiseconds);
  const totalSeconds = Math.floor(safeCentiseconds / 100);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);

  if (hours > 0) {
    return `${hours}:${padTwoDigits(minutes)}:${padTwoDigits(seconds)}.${decimalPart}`;
  }
  if (totalMinutes > 0) {
    return `${totalMinutes}:${padTwoDigits(seconds)}.${decimalPart}`;
  }
  return `${totalSeconds}.${decimalPart}`;
}

function calculateAverageFromSlice(times) {
  const maxTime = Math.max(...times);
  const minTime = Math.min(...times);
  const sum = times.reduce((acc, current) => acc + current, 0);
  return Math.round((sum - maxTime - minTime) / (times.length - 2));
}

function calculateAverageAt(index, windowSize) {
  if (index + 1 < windowSize) {
    return null;
  }
  const slice = solvesCs.slice(index - windowSize + 1, index + 1);
  return calculateAverageFromSlice(slice);
}

function updateRunningTime() {
  const currentCs = Math.floor((performance.now() - timerStartMs) / 10);
  if (currentCs !== lastRenderedCs) {
    elapsedCs = currentCs;
    lastRenderedCs = currentCs;
    time.textContent = formatTimerDisplay(elapsedCs, 1);
  }
  if (timerStatus) {
    animationFrameId = requestAnimationFrame(updateRunningTime);
  }
}

function startTimer() {
  cancelAnimationFrame(animationFrameId);
  timerStartMs = performance.now();
  elapsedCs = 0;
  lastRenderedCs = -1;
  updateRunningTime();
}

function stopTimer() {
  cancelAnimationFrame(animationFrameId);
  elapsedCs = Math.floor((performance.now() - timerStartMs) / 10);
  time.textContent = formatTimerDisplay(elapsedCs, 2);
  solvesCs.push(elapsedCs);
  saveState();
  renderStatsBoard();
  generateAlgorithm();
}

window.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    event.preventDefault();
    if (!timerStatus && !event.repeat) {
      time.textContent = formatTimerDisplay(0, 1);
      time.style.color = "green";
    }
  }
});

window.addEventListener("keyup", function (event) {
  if (event.code === "Space") {
    event.preventDefault();
    if (!timerStatus) {
      timerStatus = true;
      time.style.color = "black";
      startTimer();
    } else {
      timerStatus = false;
      time.style.color = "red";
      stopTimer();
    }
  }
});

function renderSummaryStats() {
  if (solvesCs.length === 0) {
    pb.textContent = EMPTY_TIME_VALUE;
    pw.textContent = EMPTY_TIME_VALUE;
    avgOf5.textContent = EMPTY_TIME_VALUE;
    avgOf12.textContent = EMPTY_TIME_VALUE;
    return;
  }

  const personalBest = Math.min(...solvesCs);
  const personalWorst = Math.max(...solvesCs);
  const ao5Value =
    solvesCs.length >= 5
      ? calculateAverageFromSlice(solvesCs.slice(solvesCs.length - 5))
      : null;
  const ao12Value =
    solvesCs.length >= 12
      ? calculateAverageFromSlice(solvesCs.slice(solvesCs.length - 12))
      : null;

  pb.textContent = formatElapsed(personalBest);
  pw.textContent = formatElapsed(personalWorst);
  avgOf5.textContent = ao5Value === null ? EMPTY_TIME_VALUE : formatElapsed(ao5Value);
  avgOf12.textContent =
    ao12Value === null ? EMPTY_TIME_VALUE : formatElapsed(ao12Value);
}

function renderSolveRows() {
  removeAllChildNodes(statistics);

  for (let i = solvesCs.length - 1; i >= 0; i--) {
    const ao5AtSolve = calculateAverageAt(i, 5);
    const ao12AtSolve = calculateAverageAt(i, 12);
    const element = document.createElement("div");
    element.classList.add("solve-details");
    element.innerHTML = `<div class="solve">${i + 1}</div>
    <div class="solve">${formatElapsed(solvesCs[i])}</div>
    <div class="solve">${
      ao5AtSolve === null ? EMPTY_TIME_VALUE : formatElapsed(ao5AtSolve)
    }</div>
    <div class="solve">${
      ao12AtSolve === null ? EMPTY_TIME_VALUE : formatElapsed(ao12AtSolve)
    }</div>`;
    statistics.appendChild(element);
  }
}

function renderStatsBoard() {
  renderSummaryStats();
  renderSolveRows();
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      solvesCs,
    })
  );
}

function loadState() {
  const rawState = localStorage.getItem(STORAGE_KEY);
  if (!rawState) {
    return;
  }
  let parsedState;
  try {
    parsedState = JSON.parse(rawState);
  } catch (error) {
    console.error("Invalid localStorage timer state. Resetting saved data.", error);
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  if (!Array.isArray(parsedState.solvesCs)) {
    return;
  }
  solvesCs = parsedState.solvesCs.filter(function (value) {
    return Number.isInteger(value) && value >= 0;
  });
}

const resetBtn = document.querySelector(".reset-btn");
resetBtn.addEventListener("click", resetStats);
function resetStats() {
  cancelAnimationFrame(animationFrameId);
  timerStatus = false;
  elapsedCs = 0;
  lastRenderedCs = -1;
  solvesCs = [];
  localStorage.removeItem(STORAGE_KEY);
  removeAllChildNodes(statistics);
  pb.textContent = EMPTY_TIME_VALUE;
  pw.textContent = EMPTY_TIME_VALUE;
  avgOf5.textContent = EMPTY_TIME_VALUE;
  avgOf12.textContent = EMPTY_TIME_VALUE;
  time.textContent = formatTimerDisplay(0, 2);
  time.style.color = "black";
  resetBtn.blur();
  generateAlgorithm();
}
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
