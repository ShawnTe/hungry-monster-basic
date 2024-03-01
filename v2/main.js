// import { takeTurn } from "./play.js";
let state = {};

const canvas = document.querySelector('#game');

const gearEl = document.querySelector('#main-screen-gear');
const settingsEl = document.querySelector('.settings-container');
const problemEl = document.querySelector('.number-problem-container');
const gridEl = document.querySelector('#numbers-container');

// problem
const num1El = document.querySelector('#num1');
const operationEl = document.querySelector('#operation');
const num2El = document.querySelector('#num2');
const num3El = document.querySelector('#total');

const clearBtnEl = document.querySelector('.clear');
const feedbackEl = document.querySelector('.feedback');
const playAgainEl = document.querySelector('.playAgain');

const form = document.querySelector('#form');
form.addEventListener('submit', onFormSubmit);

// Settings Form
function onFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());
  console.log('data: ', data);
  state.playerName = data.fname ? data.fname : state.playerName;

  state.focusNumber = data.focusNumber ? data.focusNumber : state.focusNumber;

  state.operation = data.operator ? data.operator : state.operation;

  state.topNumber = data.topNumber ? data.topNumber : state.topNumber;
  console.log('state in form capture: ', state);

  state.problemType = data.problemType ? data.problemType : state.problemType;

  // settingsEl.classList.add('hide');
  const questionEl = document.querySelector('.question');
  questionEl.classList.remove('question');

  closeSettings();
  playAgain();
}

// PLAY AGAIN
playAgainEl.addEventListener('click', () => {
  feedbackEl.classList.remove('success');
  feedbackEl.textContent = '';

  document.querySelector('.success-image').classList.add('hide');
  playAgainEl.classList.add('hide');
  playAgain();
});

function playAgain() {
  state.phase = 'hungry';
  state.inputAnswer = '';
  gridEl.style.position = 'absolute';
  if (document.querySelector('#temp-success-image')) {
    document.querySelector('#temp-success-image').remove();
  }
  if (document.querySelector('#temp-hungry-image')) {
    document.querySelector('#temp-hungry-image').remove();
  }
  draw();
  takeTurn();
}
function getInput(event) {
  feedbackEl.textContent = '';
  feedbackEl.classList.removeAll;
  state.inputAnswer += +event.target.value;
  const questionEl = document.querySelector('.question');
  questionEl.textContent = String(state.inputAnswer);
}

clearBtnEl.addEventListener('click', () => {
  feedbackEl.textContent = '';
  feedbackEl.classList.removeAll;
  const questionEl = document.querySelector('.question');
  const currentGuess = questionEl.textContent;

  lastNumberRemoved = currentGuess.slice(0, -1);
  questionEl.textContent = lastNumberRemoved;
  state.inputAnswer = lastNumberRemoved;
  if (!questionEl.textContent) {
    if (state.problemType === 'missing') {
      num2El.textContent = '?';
      num2El.classList.add('question');
    } else if (state.problemType === 'endResult') {
      // console.log('end result IN IT!!');
      num3El.textContent = '?';
      num3El.classList.add('question');
    }
  }
});

function showSuccess() {
  if (document.querySelector('#temp-hungry-image')) {
    document.querySelector('#temp-hungry-image').remove();
  }

  feedbackEl.textContent = `YOU GOT IT${
    state.playerName ? ', ' + state.playerName : ''
  }!!!!`;
  feedbackEl.classList.add('success');

  gridEl.style.position = 'unset';
  playAgainEl.classList.remove('hide');

  state.phase = 'celebrating';
  state.inputAnswer = '';
  // drawSuccess();
  hideMonster();
  const happyyMonsterImage = document.createElement('img'); // Use DOM HTMLImageElement
  happyyMonsterImage.setAttribute('id', 'temp-success-image');
  happyyMonsterImage.srcset="happy-monster-240w.gif, happy-monster-310w.gif 1.5x, happy-monster-481w.gif 2x"
  happyyMonsterImage.src = './images/happy-monster-481w.gif';
  // happyyMonsterImage.src = './images/happy-monster.gif';
  document.body.appendChild(happyyMonsterImage);
  happyyMonsterImage.classList.add('success-image');
}

function tooHigh() {
  // if answer incorrect, offer a low or high hint
  feedbackEl.textContent = 'Ohhh, not so much';
  feedbackEl.classList.add('try-again');
}

function tooLow() {
  // if answer incorrect, offer a low or high hint
  feedbackEl.textContent = 'More! More!';
  feedbackEl.classList.add('try-again');
}

function checkAnswer() {
  feedbackEl.textContent = '';
  feedbackEl.classList.removeAll;
  // console.log('Number(state.inputAnswer): ', Number(state.inputAnswer));
  if (state.problemType === 'endResult') {
    if (Number(state.inputAnswer) === state.problemTotal) {
      showSuccess();
    } else if (Number(state.inputAnswer) > state.problemTotal) {
      tooHigh();
    } else if (Number(state.inputAnswer) < state.problemTotal) {
      tooLow();
    }
  }
  // console.log('Number(state.problemNum2): ', Number(state.problemNum2));
  if (state.problemType === 'missing') {
    // console.log('In missing');
    if (Number(state.inputAnswer) === state.problemNum2) {
      // console.log('in missing SUCCESS');
      showSuccess();
    } else if (Number(state.inputAnswer) > state.problemNum2) {
      tooHigh();
    } else if (Number(state.inputAnswer) < state.problemNum2) {
      tooLow();
    }
  }
}

canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
const ctx = canvas.getContext('2d');

newGame();

function newGame() {
  // reset game state
  state = {
    phase: 'hungry', // hungry | celebrating
    buildings: [],
    playerName: '',
    focusNumber: '',
    topNumber: 50,
    operation: 'addition', // addition | subtraction | multiplication | division
    problemType: 'endResult', // missing | endResult

    problemNum1: null,
    problemNum2: null,
    problemTotal: null,

    inputAnswer: '',

    scale: 1,
  };

  // Generate buildings
  for (let i = 0; i < 5; i++) {
    generateBuilding(i);
  }

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
  drawMonster();
  // drawNumbers();

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
  ctx.fillStyle = '#EE9B00';
  ctx.fillRect(
    0,
    0,
    document.documentElement.clientWidth / state.scale,
    document.documentElement.clientHeight / state.scale
  );

  //Draw moon
  ctx.fillStyle = '#CA6702';
  ctx.beginPath();
  ctx.arc(300, 750, 60, 0, 2 * Math.PI);
  ctx.fill();
}

function drawBuildings() {
  state.buildings.forEach((building) => {
    ctx.fillStyle = '#001219';
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

          ctx.fillStyle = '#E9d8A6';
          ctx.fillRect(x, y, windowWidth, windowHeight);

          ctx.restore();
        }
      }
    }
  });
}

function drawMonster() {
  ctx.save();

  const building = state.buildings.at(1);

  ctx.translate(building.x + building.width / 2, building.height);

  drawMonsterBody();
  drawMonsterLeftArm();
  drawMonsterRightArm();
  drawMonsterEyes();
  drawMonsterMouth();

  ctx.restore();
}

// function drawMonster() {
//   const hungryMonsterImage = document.createElement('img'); // Use DOM HTMLImageElement
//   hungryMonsterImage.setAttribute('id', 'temp-hungry-image');
//   // hungryMonsterImage.srcset = './images/hungry-monster.png';
//   hungryMonsterImage.srcset="hungry-monster-240w.png, hungry-monster-310w.png 1.5x, hungry-monster-481w.png 2x"
//   hungryMonsterImage.src = './images/hungry-monster-481w.png';
//   document.body.appendChild(hungryMonsterImage);
//   hungryMonsterImage.classList.add('hungry-image');
// }

function hideMonster() {
  ctx.save();

  ctx.translate(0, window.innerHeight);
  ctx.scale(1, -1);
  ctx.scale(state.scale, state.scale);

  const building = state.buildings.at(1);
  ctx.translate(building.x + building.width / 2, building.height);

  ctx.fillStyle = '#EE9B00';
  ctx.beginPath();
  ctx.moveTo(-162, 0);
  ctx.lineTo(-162, 271);
  ctx.lineTo(162, 271);
  ctx.lineTo(162, 0);

  ctx.fill();

  ctx.restore();
}

function drawMonsterBody() {
  ctx.fillStyle = 'DarkCyan';

  ctx.beginPath();
  ctx.moveTo(0, 35);
  ctx.lineTo(-7, 0);
  ctx.lineTo(-40, 0);
  ctx.lineTo(-40, 18);
  ctx.lineTo(-20, 22);

  ctx.lineTo(-61, 237);
  ctx.lineTo(-52, 267);
  ctx.lineTo(-40, 247);
  ctx.lineTo(-40, 240);
  ctx.lineTo(40, 240);
  ctx.lineTo(40, 247);
  ctx.lineTo(52, 270);
  ctx.lineTo(61, 237);

  ctx.lineTo(20, 22);
  ctx.lineTo(40, 18);
  ctx.lineTo(40, 0);
  ctx.lineTo(7, 0);
  ctx.fill();

  // ctx.fillStyle = "pink";
  ctx.beginPath();
  ctx.ellipse(0, 140, 94, 110, 0, 0, 2 * Math.PI);

  // ctx.arc(0, 140, 110, 0, 2 * Math.PI);
  ctx.fill();
}

function drawMonsterRightArm() {
  ctx.strokeStyle = 'DarkCyan';
  ctx.lineWidth = 16;

  if (state.phase === 'celebrating') {
    // arm
    ctx.beginPath();
    ctx.moveTo(83, 170);
    // quadraticCurveTo(cpx, cpy, end-x, end-y);
    ctx.quadraticCurveTo(110, 185, 108, 210);

    ctx.stroke();

    // paw
    ctx.beginPath();
    // ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle);
    ctx.ellipse(114, 210, 6, 12, -45, 0, 2 * Math.PI);
    ctx.ellipse(106, 218, 6, 12, -60, 0, 2 * Math.PI);
    ctx.ellipse(96, 214, 6, 12, 20, 0, 2 * Math.PI);
  } else {
    // arm
    ctx.beginPath();
    ctx.moveTo(83, 170);
    // quadraticCurveTo(cpx, cpy, end-x, end-y);
    ctx.quadraticCurveTo(110, 185, 118, 130);

    ctx.stroke();

    // paw
    ctx.beginPath();
    // ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle);
    ctx.ellipse(124, 130, 6, 12, 45, 0, 2 * Math.PI);
    ctx.ellipse(110, 125, 6, 12, -60, 0, 2 * Math.PI);
    ctx.ellipse(119, 120, 6, 12, 0, 0, 2 * Math.PI);
  }

  ctx.fill();
}

function drawMonsterLeftArm() {
  ctx.strokeStyle = 'DarkCyan';
  ctx.lineWidth = 16;

  if (state.phase === 'celebrating') {
    // arm
    ctx.beginPath();
    ctx.moveTo(-83, 170);
    // quadraticCurveTo(cpx, cpy, end-x, end-y);
    ctx.quadraticCurveTo(-110, 185, -108, 210);

    ctx.stroke();

    // paw
    ctx.beginPath();
    // ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle);
    ctx.ellipse(-118, 214, 6, 12, 45, 0, 2 * Math.PI);
    ctx.ellipse(-106, 218, 6, 12, 60, 0, 2 * Math.PI);
    ctx.ellipse(-96, 214, 6, 12, -20, 0, 2 * Math.PI);
  } else {
    // arm
    ctx.beginPath();
    ctx.moveTo(-83, 170);
    // quadraticCurveTo(cpx, cpy, end-x, end-y);
    ctx.quadraticCurveTo(-110, 185, -118, 130);

    ctx.stroke();

    // paw
    ctx.beginPath();
    // ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle);
    ctx.ellipse(-124, 130, 6, 12, -45, 0, 2 * Math.PI);
    ctx.ellipse(-110, 125, 6, 12, 60, 0, 2 * Math.PI);
    ctx.ellipse(-119, 120, 6, 12, 0, 0, 2 * Math.PI);
  }

  ctx.fill();
}

function drawMonsterEyes() {
  ctx.save();
  ctx.fillStyle = 'white';
  ctx.scale(1, -1);

  ctx.beginPath();
  if (state.phase === 'celebrating') {
    // whites round
    ctx.arc(45, -160, 30, 0, 2 * Math.PI, false);
    ctx.arc(-45, -160, 30, 0, 2 * Math.PI, false);
  } else {
    // arc(x, y, radius, startAngle, endAngle, counterclockwise)
    // whites half moon
    ctx.arc(45, -160, 30, 0, Math.PI, false);
    ctx.arc(-45, -160, 30, 0, Math.PI, false);
  }
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = 'blue';

  if (state.phase === 'celebrating') {
    // pupils big
    // ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle);
    ctx.ellipse(45, -160, 12, 20, 0, 0, 2 * Math.PI);
    ctx.ellipse(-45, -160, 12, 20, 0, 0, 2 * Math.PI);
  } else {
    // pupils small
    ctx.arc(45, -156, 10, 0, 2 * Math.PI, false);
    ctx.arc(-45, -156, 10, 0, 2 * Math.PI, false);
  }

  ctx.fill();
  ctx.restore();

  ctx.beginPath();
  ctx.fillStyle = 'blue';

  ctx.moveTo(-83, 170);
  // quadraticCurveTo(cpx, cpy, end-x, end-y);

  ctx.quadraticCurveTo(110, 185, 108, 210);
}

function drawMonsterMouth() {
  ctx.strokeStyle = 'Crimson';
  ctx.fillStyle = 'PaleGoldenrod';

  ctx.lineWidth = 8;

  ctx.beginPath();
  if (state.phase === 'celebrating') {
    // lips smile
    ctx.moveTo(-50, 100);

    ctx.bezierCurveTo(-30, 120, 30, 100, 50, 100);
    ctx.bezierCurveTo(35, 50, -35, 40, -50, 100);
    ctx.fill();
  } else {
    // lips sad
    ctx.moveTo(-40, 80);
    ctx.bezierCurveTo(0, 100, 20, 90, 40, 85);
  }

  ctx.stroke();
}

function add(num1, num2) {
  return num1 + num2;
}

function subtract(num1, num2) {
  return num1 - num2;
}

function multiply(num1, num2) {
  return num1 * num2;
}

function divide(num1, num2) {
  return num1 / num2;
}

function displayMultiplicationAndAdditionProblem(numbers, operation) {
  operationEl.textContent = operation;

  if (state.problemType === 'endResult') {
    num3El.textContent = '?';
    num3El.classList.add('question');

    num1El.textContent = numbers.num1;
    num2El.textContent = numbers.num2;
  } else {
    // "missing"
    num3El.textContent = numbers.total;

    num2El.textContent = '?';
    num2El.classList.add('question');

    num1El.textContent = numbers.num1;
  }
}

function displaySubtractionAndDivisionProblem(numbers, operation) {
  num1El.textContent = numbers.total;
  operationEl.textContent = operation;

  if (state.problemType === 'endResult') {
    num3El.textContent = '?';
    num3El.classList.add('question');

    num2El.textContent = numbers.num1;
  } else {
    // problemType = missing
    num2El.textContent = '?';
    num2El.classList.add('question');

    num3El.textContent = isFocusNumber(numbers.num1)
      ? numbers.num1
      : numbers.num2;
  }
}

function getRandomNumber(minNum, maxNum) {
  const result = Math.floor(minNum + Math.random() * (maxNum - minNum));
  return result;
}

function getMultipicationNumbers() {
  // set num1 (get random # if not present)
  // console.log('state.focusNumber: ', state.focusNumber);
  const num1 = Number(
    state.focusNumber ? state.focusNumber : getRandomNumber(2, 10)
  );

  const maxNum2 = Math.ceil(state.topNumber / num1);
  // num2 is random between or equal to 2 and maxNum2
  const num2 = Number(getRandomNumber(2, maxNum2));
  const total = num1 * num2;
  // console.log('getMultipicationNumbers: ', { num1, num2, total });
  state.problemNum1 = num1;
  state.problemNum2 = num2;
  state.problemTotal = total;
  return { num1, num2, total };
}

function getAdditionNumbers() {
  // set num1 (get random # if not present)
  const num1 = Number(
    state.focusNumber ? state.focusNumber : getRandomNumber(2, 10)
  ); // 8

  const maxNum2 = Math.ceil(state.topNumber - num1); // 20 - 8 = 12

  // num2 is random between or equal to 2 and maxNum2
  const num2 = Number(getRandomNumber(2, maxNum2));
  const total = num1 + num2;

  // console.log('getAdditionNumbers: ', { num1, num2, total });

  state.problemNum1 = num1;
  state.problemNum2 = num2;
  state.problemTotal = total;

  return { num1, num2, total };
}

function getSubtractionNumbers() {
  // set num1 (get random # if not present)
  const num1 = Number(
    state.focusNumber ? state.focusNumber : getRandomNumber(2, 10)
  ); // 8

  const maxNum2 = Math.ceil(state.topNumber - num1); // 20 - 8 = 12
  // num2 is random between or equal to 2 and maxNum2
  const num2 = Number(getRandomNumber(2, maxNum2));
  const total = num1 + num2;

  // console.log('getSubtractionNumbers: ', { num1, num2, total });

  state.problemNum1 = total;
  state.problemNum2 = num1;
  state.problemTotal = num2;

  return { num1, num2, total };
}

function getDivisionNumbers() {
  // set num1 (get random # if not present)
  const num1 = Number(
    state.focusNumber ? state.focusNumber : getRandomNumber(2, 10)
  ); // 8

  const maxNum2 = Math.ceil(state.topNumber / num1); // 20 - 8 = 12
  // num2 is random between or equal to 2 and maxNum2
  const num2 = Number(getRandomNumber(2, maxNum2));
  const total = num1 * num2;

  // console.log('getSubtractionNumbers: ', { num1, num2, total });

  state.problemNum1 = total;
  state.problemNum2 = num1;
  state.problemTotal = num2;

  return { num1, num2, total };
}

function setProblem(numbers) {
  if (state.operation === 'subtraction') {
    if (state.problemType === 'endResult') {
      if (isFocusNumber(numbers.num1)) {
        num2New = numbers.num1;
        num3New = numbers.num2;
      } else {
        num2New = numbers.num2;
        num3New = numbers.num1;
      }
      // return { num1: numbers.total, num2: num2New, total: num3New };
      state.problemNum1 = numebrs.total;
      state.problemNum2 = num3New;
      state.problemTotal = num3New;
    }

    if (state.problemType === 'missing') {
      if (isFocusNumber(numbers.num1)) {
        totalNew = numbers.num1;
        num2New = numbers.num2;
      } else {
        totalNew = numbers.num2;
        num2New = numbers.num1;
      }
      return { num1: total, num2: num2New, total: totalNew };
    }
  }
}

function isFocusNumber(num) {
  return num === state.focusNumber;
}

function totalField(total) {
  if (state.problemType === 'missing') {
    num3El.textContent = total;
  } else {
    console.log('In total');
    num3El.textContent = '?';
    num3El.classList.add('question');
  }
}

// if topNum / focusNum (floor) < 3
// "there aren't many options. Can you make the top number higher?"
function displayProblem(numbers, operation) {
  num1Field(numbers.num1);
  operationField(operation);
  num2Field(numbers.num2);
  totalField(numbers.total);
}

function takeTurn() {
  let numbers = {};
  switch (state.operation) {
    case 'addition':
      numbers = getAdditionNumbers();
      displayMultiplicationAndAdditionProblem(numbers, '+');
      break;
    case 'subtraction':
      numbers = getSubtractionNumbers();
      displaySubtractionAndDivisionProblem(numbers, '-');
      break;
    case 'multiplication':
      numbers = getMultipicationNumbers();
      displayMultiplicationAndAdditionProblem(numbers, '*');
      break;
    case 'division':
      numbers = getDivisionNumbers();
      displaySubtractionAndDivisionProblem(numbers, '/');
      break;
  }
}

const openSettings = () => {
  if (document.querySelector('#temp-success-image')) {
    document.querySelector('#temp-success-image').remove();
  } 
  if (document.querySelector('#temp-hungry-image')) {
    document.querySelector('#temp-hungry-image').remove();
  }
  gridEl.style.position = 'unset';
  problemEl.classList.add('hide');
  document.querySelector('#main-screen-gear').classList.add('hide');
  settingsEl.classList.remove('hide');
  feedbackEl.textContent = '';
  playAgainEl.classList.add('hide');

  document.querySelector('#fname').textContent = state.fname;
  document.querySelector('#focus-number').textContent = state.focusNumber;
  document.querySelector('#top-number').textContent = state.topNumber;
};

const closeSettings = () => {
  gearEl.classList.remove('hide');
  settingsEl.classList.add('hide');
  gridEl.style.position = 'absolute';
  problemEl.classList.remove('hide');
};

document
  .querySelector('#main-screen-gear')
  .addEventListener('click', openSettings);

window.addEventListener('resize', () => {
  canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight;
  calculateScale();
  draw();
});

// module.exports = {
//   add,
//   subtract,
//   multiply,
//   divide,
// };
