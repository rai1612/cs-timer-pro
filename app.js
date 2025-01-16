const moves = [
  {
    id: 1,
    src: "./images/B.png",
    title: "B",
  },
  {
    id: 1,
    src: "./images/B'.png",
    title: "B'",
  },
  {
    id: 1,
    src: "./images/B2.png",
    title: "B2",
  },
  {
    id: 2,
    src: "./images/D.png",
    title: "D",
  },
  {
    id: 2,
    src: "./images/D'.png",
    title: "D'",
  },
  {
    id: 2,
    src: "./images/D2.png",
    title: "D2",
  },
  {
    id: 3,
    src: "./images/F.png",
    title: "F",
  },
  {
    id: 3,
    src: "./images/F'.png",
    title: "F'",
  },
  {
    id: 3,
    src: "./images/F2.png",
    title: "F2",
  },
  {
    id: 4,
    src: "./images/L.png",
    title: "L",
  },
  {
    id: 4,
    src: "./images/L'.png",
    title: "L'",
  },
  {
    id: 4,
    src: "./images/L2.png",
    title: "L2",
  },
  {
    id: 5,
    src: "./images/R.png",
    title: "R",
  },
  {
    id: 5,
    src: "./images/R'.png",
    title: "R'",
  },
  {
    id: 5,
    src: "./images/R2.png",
    title: "R2",
  },
  {
    id: 6,
    src: "./images/U.png",
    title: "U",
  },
  {
    id: 6,
    src: "./images/U'.png",
    title: "U'",
  },
  {
    id: 6,
    src: "./images/U2.png",
    title: "U2",
  },
];
// element selectors
const moveContainer = document.querySelectorAll(".move-container");
const time = document.querySelector(".time");
// event listeners
window.addEventListener("DOMContentLoaded", generateAlgorithm);

function generateAlgorithm() {
  let lastRandomMoveId = 0;
  moveContainer.forEach(function (move) {
    let randomMove = moves[Math.floor(Math.random() * moves.length)];
    while (randomMove.id === lastRandomMoveId) {
      randomMove = moves[Math.floor(Math.random() * moves.length)];
    }
    lastRandomMoveId = randomMove.id;
    return (move.innerHTML = `<img src="${randomMove.src}" alt="" class="move-img" />
        <h4>${randomMove.title}</h4>`);
  });
}
const pb = document.querySelector(".pb");
const pw = document.querySelector(".pw");

let solves = [];
let timer = 0.0;
let timerStatus = false;
let myInterval;
let personalBest = 999;
let personalWorst = 0;
function startTimer() {
  myInterval = setInterval(function () {
    timer = Math.round((timer + Number.EPSILON) * 100) / 100;
    time.innerHTML = timer;
    timer += 0.1;
  }, 100);
}
function stopTimer() {
  clearInterval(myInterval);
  timer = Math.round((timer + Number.EPSILON) * 100) / 100;
  time.innerHTML = timer;
  storeSolve(timer);
  getSerialNumber();
  getSolveTime(timer);
  getPb(timer);
  getPw(timer);
  getAo5();
  getAo12();
  generateStats();
  generateAlgorithm();
  timer = 0.0;
}

window.addEventListener("keydown", function (event) {
  const key = event.key;
  if (key === " " && timerStatus === false) {
    time.innerHTML = "00.00";
    time.style.color = "green";
  }
});
window.addEventListener("keyup", function (event) {
  const key = event.key;
  if (key === " " && timerStatus === false) {
    timerStatus = true;
    time.style.color = "black";
    startTimer();
  } else if (key === " " && timerStatus === true) {
    timerStatus = false;
    time.style.color = "red";
    stopTimer();
  }
});

let serialNumber = 0;

const statistics = document.querySelector(".statistics");

let SNo;
let solveTime;
let Ao5;
let Ao12;
const avgOf5 = document.querySelector(".ao5");
const avgOf12 = document.querySelector(".ao12");
function generateStats() {
  const element = document.createElement("div");
  element.classList.add("solve-details");
  element.innerHTML = `<div class="solve">${SNo}</div>
  <div class="solve">${solveTime}</div>
  <div class="solve">${Ao5}</div>
  <div class="solve">${Ao12}</div>`;
  statistics.insertBefore(element, statistics.children[0]);
  avgOf5.innerHTML = Ao5;
  avgOf12.innerHTML = Ao12;
}
function getSerialNumber() {
  serialNumber += 1;
  return (SNo = serialNumber);
}
function getSolveTime(time) {
  return (solveTime = time);
}
function getPb(time) {
  if (time < personalBest) {
    personalBest = time;
    pb.innerHTML = personalBest;
  }
}
function getPw(time) {
  if (time > personalWorst) {
    personalWorst = time;
    pw.innerHTML = personalWorst;
  }
}
function getAo5() {
  let finalSum = parseFloat("0");
  if (solves.length >= 5) {
    let maxTime = 0;
    let minTime = 100;
    for (let i = solves.length - 5; i < solves.length; i++) {
      if (solves[i] > maxTime) {
        maxTime = solves[i];
      }
      if (solves[i] < minTime) {
        minTime = solves[i];
      }
    }
    for (let i = solves.length - 5; i < solves.length; i++) {
      finalSum += parseFloat(solves[i]);
    }
    finalSum -= maxTime + minTime;
  }
  finalSum /= 3;
  finalSum = Math.round((finalSum + Number.EPSILON) * 100) / 100;
  return (Ao5 = finalSum);
}
function getAo12() {
  let finalSum = parseFloat("0");
  if (solves.length >= 12) {
    let maxTime = 0;
    let minTime = 100;
    for (let i = solves.length - 12; i < solves.length; i++) {
      if (solves[i] > maxTime) {
        maxTime = solves[i];
      }
      if (solves[i] < minTime) {
        minTime = solves[i];
      }
    }
    for (let i = solves.length - 12; i < solves.length; i++) {
      finalSum += parseFloat(solves[i]);
    }
    finalSum -= minTime + maxTime;
  }
  finalSum /= 10;
  finalSum = Math.round((finalSum + Number.EPSILON) * 100) / 100;
  return (Ao12 = finalSum);
}
function storeSolve(time) {
  solves.push(time);
}
const resetBtn = document.querySelector(".reset-btn");
resetBtn.addEventListener("click", resetStats);
function resetStats() {
  removeAllChildNodes(statistics);
  avgOf5.innerHTML = 0;
  avgOf12.innerHTML = 0;
  serialNumber = 0;
  solves = [];
  personalBest = 999;
  personalWorst = 0;
  pb.innerHTML = 0;
  pw.innerHTML = 0;
  time.innerHTML = "00.00";
  time.style.color = "black";
}
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
