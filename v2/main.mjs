// if topNum / focusNum (floor) < 3
// "there aren't many options. Can you make the top number higher?"

import Messages from "./lib/messages.mjs";
import Utils from "./lib/utils.mjs";

const { generateRandomNumber } = Utils();
const { successMessages, tooHighMessages, tooLowMessages, chooseMessage } =
  Messages();

let state = {};

const canvas = document.querySelector("#game");

const gearEl = document.querySelector("#main-screen-gear");
const settingsEl = document.querySelector("#settings-container");
const problemEl = document.querySelector("#problem-box");

const gridEl = document.querySelector("#calc-container");

// problem
const num1El = document.querySelector("#num1");
const operationEl = document.querySelector("#operation");
const num2El = document.querySelector("#num2");
const num3El = document.querySelector("#total");

const clearBtnEl = document.querySelector(".clear");
const feedbackEl = document.querySelector(".feedback");
const playAgainEl = document.querySelector("#play-again-container");

const form = document.querySelector("#form");
form.addEventListener("submit", onFormSubmit);

// SETTINGS FORM submission
function onFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());
  state.playerName = data.fname ? data.fname : state.playerName;

  state.focusNumber = data.focusNumber ? data.focusNumber : state.focusNumber;

  state.operation = data.operator ? data.operator : state.operation;

  state.topNumber = data.topNumber ? data.topNumber : state.topNumber;

  state.problemType = data.problemType ? data.problemType : state.problemType;

  // settingsEl.classList.add('hide');
  const questionEl = document.querySelector(".question");
  questionEl.classList.remove("question");

  closeSettings();
  playAgain();
}

// PLAY AGAIN
playAgainEl.addEventListener("click", () => {
  feedbackEl.classList.remove("success");
  feedbackEl.textContent = "";

  hideHappyMonster();
  playAgainEl.style.visibility = "hidden";

  playAgain();
});

function playAgain() {
  state.inputAnswer = "";
  gridEl.style.visibility = "visible";

  // gridEl.style.position = "absolute";
  if (document.querySelector(".success-image")) {
    hideHappyMonster();
  }
  if (document.querySelector(".hungry-image")) {
    hideHappyMonster();
  }
  draw();
  takeTurn();
}
export const getInput = (event) => {
  feedbackEl.textContent = "";
  feedbackEl.classList.removeAll;
  state.inputAnswer += +event.target.value;
  const questionEl = document.querySelector(".question");
  questionEl.textContent = String(state.inputAnswer);
};
window.getInput = getInput;

clearBtnEl.addEventListener("click", () => {
  feedbackEl.textContent = "";
  feedbackEl.classList.removeAll;
  const questionEl = document.querySelector(".question");
  const currentGuess = questionEl.textContent;

  // lastNumberRemoved = currentGuess.slice(0, -1);
  questionEl.textContent = "";
  state.inputAnswer = "";
  if (!questionEl.textContent) {
    if (state.problemType === "missing") {
      num2El.textContent = "?";
      num2El.classList.add("question");
    } else if (state.problemType === "endResult") {
      num3El.textContent = "?";
      num3El.classList.add("question");
    }
  }
});

function showSuccess() {
  hideHungryMonster();
  showHappyMonster();
  feedbackEl.textContent = `${chooseMessage(successMessages)}${
    state.playerName ? ", " + state.playerName : ""
  }!!!!`;
  feedbackEl.classList.add("success");

  gridEl.style.visibility = "hidden";
  playAgainEl.style.visibility = "visible";

  state.inputAnswer = "";
}

function tooHigh() {
  // if answer incorrect, offer a low or high hint
  feedbackEl.textContent = chooseMessage(tooHighMessages);
  feedbackEl.classList.add("try-again");
}

function tooLow() {
  // if answer incorrect, offer a low or high hint
  feedbackEl.textContent = chooseMessage(tooLowMessages);
  feedbackEl.classList.add("try-again");
}

export const checkAnswer = () => {
  feedbackEl.textContent = "";
  feedbackEl.classList.removeAll;

  if (Number(state.inputAnswer) === state.problemAnswer) {
    showSuccess();
  } else if (Number(state.inputAnswer) > state.problemAnswer) {
    tooHigh();
  } else if (Number(state.inputAnswer) < state.problemAnswer) {
    tooLow();
  }
};
window.checkAnswer = checkAnswer;

canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
const ctx = canvas.getContext("2d");

newGame();

function newGame() {
  // reset game state
  state = {
    phase: "hungry", // hungry | celebrating
    buildings: [],
    playerName: "",
    focusNumber: 2,
    topNumber: 20,
    operation: "addition", // addition | subtraction | multiplication | division
    problemType: "endResult", // missing | endResult

    problemNum1: null,
    problemNum2: null,
    problemTotal: null,
    problemAnswer: null,

    inputAnswer: "",

    scale: 1,
  };

  // Generate buildings
  for (let i = 0; i < 5; i++) {
    generateBuilding(i);
  }

  playAgainEl.style.visibility = "hidden";
  settingsEl.style.visibility = "hidden";

  draw();
  takeTurn();
}
function calculateScale() {
  const lastBuilding = state.buildings.at(-1);
  const totalWitdhOfTheCity = lastBuilding.x + lastBuilding.width;

  state.scale = document.documentElement.clientWidth / totalWitdhOfTheCity;
}

function draw() {
  ctx.save();
  // Flip coordinate system upside down
  ctx.translate(0, window.innerHeight);
  ctx.scale(1, -1);
  ctx.scale(state.scale, state.scale);

  // Draw scene
  drawBackground();
  drawBuildings();
  showHungryMonster();

  ctx.restore();
}

function generateBuilding(index) {
  const previousBuilding = state.buildings[index - 1];

  const x = previousBuilding
    ? previousBuilding.x + previousBuilding.width + 4
    : -50;

  const minWidth = 320;
  const maxWidth = 425;
  const width = minWidth + Math.random() * (maxWidth - minWidth);

  const buildingWithMonster = index === 1;

  const minHeight = 100;
  const maxHeight = 350;
  const minHeightMonster = 320;
  const maxHeightMonster = 410;

  const height = buildingWithMonster
    ? minHeightMonster + Math.random() * (maxHeightMonster - minHeightMonster)
    : minHeight + Math.random() * (maxHeight - minHeight);

  const lightsOn = [];
  for (let i = 0; i < 250; i++) {
    const light = Math.random() <= 0.33 ? true : false;
    lightsOn.push(light);
  }

  state.buildings.push({ x, width, height, lightsOn });
}

// Draw functions
function drawBackground() {
  // Draw sky
  ctx.fillStyle = "#EE9B00";
  ctx.fillRect(
    0,
    0,
    document.documentElement.clientWidth / state.scale,
    document.documentElement.clientHeight / state.scale
  );

  //Draw moon
  ctx.fillStyle = "#CA6702";
  ctx.beginPath();
  ctx.arc(300, 750, 60, 0, 2 * Math.PI);
  ctx.fill();
}

function drawBuildings() {
  state.buildings.forEach((building) => {
    ctx.fillStyle = "#001219";
    ctx.fillRect(building.x, 0, building.width, building.height);

    // Draw windows
    const windowWidth = 10;
    const windowHeight = 12;
    const gap = 15;
    const numberOfFloors = Math.ceil(
      (building.height - gap) / (windowHeight + gap)
    );
    const numberOfRoomsPerFloor = Math.floor(
      (building.width - gap) / (windowWidth + gap)
    );

    for (let floor = 0; floor < numberOfFloors; floor++) {
      for (let room = 0; room < numberOfRoomsPerFloor; room++) {
        if (building.lightsOn[floor * numberOfRoomsPerFloor + room]) {
          ctx.save();

          ctx.translate(building.x + gap, building.height - gap);
          ctx.scale(1, -1);

          const x = room * (windowWidth + gap);
          const y = floor * (windowHeight + gap);

          ctx.fillStyle = "#E9d8A6";
          ctx.fillRect(x, y, windowWidth, windowHeight);

          ctx.restore();
        }
      }
    }
  });
}

function showHappyMonster() {
  const happyMonsterImage = document.createElement("img"); // Use DOM HTMLImageElement
  // happyMonsterImage.setAttribute("id", "temp-success-image");
  // happyMonsterImage.srcset =
  // "./images/happy-monster-240w.gif, ./images/happy-monster-310w.gif 1.5x, ./images/happy-monster-481w.gif 2x";
  happyMonsterImage.src = "./images/happy-monster-481w.gif";
  document.querySelector("#happy-monster-box").appendChild(happyMonsterImage);
  happyMonsterImage.classList.add("success-image");
}

function hideHappyMonster() {
  const imgNode = document.querySelector("#happy-monster-box");
  if (imgNode.hasChildNodes()) {
    imgNode.removeChild(imgNode.firstChild);
  }
}

function showHungryMonster() {
  const hungryMonsterImage = document.createElement("img"); // Use DOM HTMLImageElement
  hungryMonsterImage.src = "./images/hungry-monster-481w.png";
  document.querySelector("#hungry-monster-box").appendChild(hungryMonsterImage);
  hungryMonsterImage.classList.add("hungry-image");
}

function hideHungryMonster() {
  const imgNode = document.querySelector("#hungry-monster-box");
  if (imgNode.hasChildNodes()) {
    console.log(imgNode.firstElementChild);
    imgNode.removeChild(imgNode.firstElementChild);
  }
}

function displayMultiplicationAndAdditionProblem(numbers, operation) {
  operationEl.textContent = operation;

  if (state.problemType === "endResult") {
    state.problemAnswer = numbers.total;

    num3El.textContent = "?";
    num3El.classList.add("question");

    num1El.textContent = numbers.num1;
    num2El.textContent = numbers.num2;
  } else {
    // "missing"
    state.problemAnswer = numbers.num2;

    num3El.textContent = numbers.total;

    num2El.textContent = "?";
    num2El.classList.add("question");

    num1El.textContent = numbers.num1;
  }
}

function displaySubtractionAndDivisionProblem(numbers, operation) {
  num1El.textContent = numbers.total;
  operationEl.textContent = operation;

  if (state.problemType === "endResult") {
    state.problemAnswer = numbers.num2;

    num3El.textContent = "?";
    num3El.classList.add("question");

    num2El.textContent = numbers.focusNum;
  } else {
    // problemType = missing
    state.problemAnswer = numbers.num2;

    num2El.textContent = "?";
    num2El.classList.add("question");

    num3El.textContent = numbers.focusNum;
  }
}

function getMultipicationNumbers() {
  // set num1 (get random # if not present)
  const num1 = Number(
    state.focusNumber ? state.focusNumber : generateRandomNumber(2, 10)
  );

  const maxNum2 = Math.ceil(state.topNumber / num1);
  // num2 is random between or equal to 2 and maxNum2
  const num2 = Number(generateRandomNumber(2, maxNum2));
  const total = num1 * num2;
  state.problemNum1 = num1;
  state.problemNum2 = num2;
  state.problemTotal = total;
  return { num1, num2, total };
}

function getAdditionNumbers() {
  // set num1 (get random # if not present)
  const num1 = Number(
    state.focusNumber ? state.focusNumber : generateRandomNumber(2, 10)
  ); // 8

  const maxNum2 = Math.ceil(state.topNumber - num1); // 20 - 8 = 12

  // num2 is random between or equal to 2 and maxNum2
  const num2 = Number(generateRandomNumber(2, maxNum2));
  const total = num1 + num2;

  state.problemNum1 = num1;
  state.problemNum2 = num2;
  state.problemTotal = total;

  return { num1, num2, total };
}

function getSubtractionNumbers() {
  // set num1 (get random # if not present)
  const focusNum = Number(
    state.focusNumber ? state.focusNumber : generateRandomNumber(2, 10)
  ); // 8

  const maxNum2 = Math.ceil(state.topNumber - focusNum); // 20 - 8 = 12
  // num2 is random between or equal to 2 and maxNum2
  const num2 = Number(generateRandomNumber(2, maxNum2));
  const total = focusNum + num2;

  state.problemNum1 = focusNum;
  state.problemNum2 = num2;
  state.problemTotal = total;

  return { focusNum, num2, total };
}

function getDivisionNumbers() {
  // set num1 (get random # if not present)
  const focusNum = Number(
    state.focusNumber ? state.focusNumber : generateRandomNumber(2, 10)
  ); // 8

  const maxNum2 = Math.ceil(state.topNumber / focusNum); // 20 - 8 = 12
  // num2 is random between or equal to 2 and maxNum2
  const num2 = Number(generateRandomNumber(2, maxNum2));
  const total = focusNum * num2;

  state.problemNum1 = focusNum;
  state.problemNum2 = num2;
  state.problemTotal = total;

  return { focusNum, num2, total };
}

function takeTurn() {
  let numbers = {};
  switch (state.operation) {
    case "addition":
      numbers = getAdditionNumbers();
      displayMultiplicationAndAdditionProblem(numbers, "+");
      break;
    case "subtraction":
      numbers = getSubtractionNumbers();
      displaySubtractionAndDivisionProblem(numbers, "-");
      break;
    case "multiplication":
      numbers = getMultipicationNumbers();
      displayMultiplicationAndAdditionProblem(numbers, "*");
      break;
    case "division":
      numbers = getDivisionNumbers();
      displaySubtractionAndDivisionProblem(numbers, "/");
      break;
  }
}

const openSettings = () => {
  console.log("in openSettings");
  if (document.querySelector(".success-image")) {
    hideHappyMonster();
  }
  if (document.querySelector(".hungry-image")) {
    hideHungryMonster();
  }
  gearEl.style.visibility = "hidden";
  gridEl.style.visibility = "hidden";
  playAgainEl.style.visibility = "hidden";
  problemEl.style.visibility = "hidden";
  feedbackEl.textContent = "";

  settingsEl.style.visibility = "visible";
  document.querySelector("#fname").focus();
  document.querySelector("#fname").textContent = state.fname;
  document.querySelector("#focus-number").textContent = state.focusNumber;
  document.querySelector("#top-number").textContent = state.topNumber;
};

const closeSettings = () => {
  gearEl.style.visibility = "visible";
  gridEl.style.visibility = "visible";
  problemEl.style.visibility = "visible";
  settingsEl.style.visibility = "hidden";

  // gearEl.classList.remove("hide");
  // settingsEl.classList.add("hide");
  // gridEl.style.position = "absolute";
  // problemEl.classList.remove("hide");
};

gearEl.addEventListener("click", openSettings);

window.addEventListener("resize", () => {
  canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight;
  calculateScale();
  draw();
});
