// if topNum / focusNum (floor) < 3
// "there aren't many options. Can you make the top number higher?"

import Messages from "./lib/messages.mjs";
import background from "./lib/background.mjs";
import problem from "./lib/setupProblem.mjs";

const { successMessages, tooHighMessages, tooLowMessages, chooseMessage } =
  Messages();

const gearEl = document.querySelector("#main-screen-gear");
const feedbackEl = document.querySelector("#feedback-box");
const playAgainEl = document.querySelector("#play-again-container");

const gridEl = document.querySelector("#calc-container");
const clearBtnEl = document.querySelector(".clear");

const settingsEl = document.querySelector("#settings-container");
const form = document.querySelector("#form");
form.addEventListener("submit", onFormSubmit);

const problemEl = document.querySelector("#problem-box");
const num1El = document.querySelector("#num1");
const operationEl = document.querySelector("#operation");
const num2El = document.querySelector("#num2");
const num3El = document.querySelector("#total");

const OPERATION_SYMBOLS = {
  addition: "+",
  subtraction: "-",
  multiplication: "*",
  division: "/",
};

let state = {};

// SETTINGS FORM submission
function onFormSubmit(event) {
  event.preventDefault();

  const settingsFormData = new FormData(event.target);
  const data = Object.fromEntries(settingsFormData.entries());

  state.playerName = data.fname ? data.fname : state.playerName;
  state.focusNumber = data.focusNumber ? data.focusNumber : state.focusNumber;
  state.operation = data.operator ? data.operator : state.operation;
  state.topNumber = data.topNumber ? data.topNumber : state.topNumber;
  state.problemType = data.problemType ? data.problemType : state.problemType;

  const questionEl = document.querySelector(".question");
  questionEl.classList.remove("question");

  closeSettings();
  playAgain();
}

// PLAY AGAIN
playAgainEl.addEventListener("click", () => {
  playAgainEl.style.visibility = "hidden";
  playAgain();
});

function playAgain() {
  state.inputAnswer = "";
  gridEl.style.visibility = "visible";
  clearFeedbackMessage();

  if (document.querySelector(".success-image")) {
    hideHappyMonster();
  }
  if (document.querySelector(".hungry-image")) {
    hideHappyMonster();
  }
  background.draw(state);
  showHungryMonster();
  setupProblem();
}

export const getInput = (event) => {
  clearFeedbackMessage();
  state.inputAnswer += +event.target.value;
  const questionEl = document.querySelector(".question");
  questionEl.textContent = String(state.inputAnswer);
};
window.getInput = getInput;

clearBtnEl.addEventListener("click", () => {
  clearFeedbackMessage();
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

function clearFeedbackMessage() {
  feedbackEl.textContent = "";
  feedbackEl.classList.remove("try-again", "success");
}

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

function showIncorrectMessage(messageType) {
  feedbackEl.textContent = chooseMessage(messageType);
  feedbackEl.classList.add("try-again");
}

export const checkAnswer = () => {
  clearFeedbackMessage();

  if (Number(state.inputAnswer) === state.problemAnswer) {
    showSuccess();
  } else if (Number(state.inputAnswer) > state.problemAnswer) {
    showIncorrectMessage(tooHighMessages);
  } else if (Number(state.inputAnswer) < state.problemAnswer) {
    showIncorrectMessage(tooLowMessages);
  }
};
window.checkAnswer = checkAnswer;

newGame();

function newGame() {
  // reset game state
  state = {
    // phase: "hungry", // hungry | celebrating
    buildings: [],
    scale: 1,

    // player preferences
    playerName: "",
    focusNumber: 2,
    topNumber: 20,
    operation: "addition", // addition | subtraction | multiplication | division
    problemType: "endResult", // missing | endResult

    // current problem
    problemNum1: null,
    problemNum2: null,
    problemTotal: null,
    problemAnswer: null,

    inputAnswer: "",
  };

  // Generate buildings
  for (let i = 0; i < 5; i++) {
    background.generateBuilding(i, state);
  }

  playAgainEl.style.visibility = "hidden";
  settingsEl.style.visibility = "hidden";
  showHungryMonster();

  background.draw(state);
  setupProblem(state);
}

function showHappyMonster() {
  const happyMonsterImage = document.createElement("img"); // Use DOM HTMLImageElement
  // happyMonsterImage.setAttribute("id", "temp-success-image");
  happyMonsterImage.srcset =
    "./images/happy-monster-240w.gif, ./images/happy-monster-310w.gif 1.5x, ./images/happy-monster-481w.gif 2x";
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
    imgNode.removeChild(imgNode.firstElementChild);
  }
}

const openSettings = () => {
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
  clearFeedbackMessage();

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
};

function displayMultiplicationAndAdditionProblem(numbers) {
  operationEl.textContent = OPERATION_SYMBOLS[state.operation];

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

function displaySubtractionAndDivisionProblem(numbers) {
  num1El.textContent = numbers.total;
  operationEl.textContent = OPERATION_SYMBOLS[state.operation];

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

function setupProblem() {
  let numbers = {};
  switch (state.operation) {
    case "addition":
      numbers = problem.getAdditionNumbers(state);
      displayMultiplicationAndAdditionProblem(numbers);
      break;
    case "subtraction":
      numbers = problem.getSubtractionNumbers(state);
      displaySubtractionAndDivisionProblem(numbers);
      break;
    case "multiplication":
      numbers = problem.getMultipicationNumbers(state);
      displayMultiplicationAndAdditionProblem(numbers);
      break;
    case "division":
      numbers = problem.getDivisionNumbers(state);
      displaySubtractionAndDivisionProblem(numbers);
      break;
  }
}

gearEl.addEventListener("click", openSettings);

function calculateScale() {
  const lastBuilding = state.buildings.at(-1);
  const totalWitdhOfTheCity = lastBuilding.x + lastBuilding.width;

  state.scale = document.documentElement.clientWidth / totalWitdhOfTheCity;
}

window.addEventListener("resize", () => {
  background.canvas.width = document.documentElement.clientWidth;
  background.canvas.height = document.documentElement.clientHeight;
  calculateScale();
  background.draw(state);
});
