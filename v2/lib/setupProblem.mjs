import Utils from "./utils.mjs";

const { generateRandomNumber } = Utils();

function getMultipicationNumbers(state) {
  // set num1 (get random # if not present)
  const num1 = Number(
    state.focusNumber ? state.focusNumber : generateRandomNumber(2, 10)
  );

  const maxNum2 = Math.ceil(state.topNumber / num1);
  // num2 is random between or equal to 2 and maxNum
  const num2 = Number(generateRandomNumber(2, maxNum2));
  const total = num1 * num2;
  state.problemNum1 = num1;
  state.problemNum2 = num2;
  state.problemTotal = total;
  return { num1, num2, total };
}

function getAdditionNumbers(state) {
  // set num1 (get random # if not present)
  const num1 = Number(
    state.focusNumber ? state.focusNumber : generateRandomNumber(2, 10)
  ); // 8

  const maxNum2 = Math.ceil(state.topNumber - num1); // 20 - 8 = 12

  // num2 is random between or equal to 2 and maxNum
  const num2 = Number(generateRandomNumber(2, maxNum2));
  const total = num1 + num2;

  state.problemNum1 = num1;
  state.problemNum2 = num2;
  state.problemTotal = total;

  return { num1, num2, total };
}

function getSubtractionNumbers(state) {
  // set num1 (get random # if not present)
  const focusNum = Number(
    state.focusNumber ? state.focusNumber : generateRandomNumber(2, 10)
  ); // 8

  const maxNum2 = Math.ceil(state.topNumber - focusNum); // 20 - 8 = 12
  // num2 is random between or equal to 2 and maxNum
  const num2 = Number(generateRandomNumber(2, maxNum2));
  const total = focusNum + num2;

  state.problemNum1 = focusNum;
  state.problemNum2 = num2;
  state.problemTotal = total;

  return { focusNum, num2, total };
}

function getDivisionNumbers(state) {
  // set num1 (get random # if not present)
  const focusNum = Number(
    state.focusNumber ? state.focusNumber : generateRandomNumber(2, 10)
  ); // 8

  const maxNum2 = Math.ceil(state.topNumber / focusNum); // 20 - 8 = 12
  // num2 is random between or equal to 2 and maxNum
  const num2 = Number(generateRandomNumber(2, maxNum2));
  const total = focusNum * num2;

  state.problemNum1 = focusNum;
  state.problemNum2 = num2;
  state.problemTotal = total;

  return { focusNum, num2, total };
}

export default {
  getMultipicationNumbers,
  getAdditionNumbers,
  getSubtractionNumbers,
  getDivisionNumbers,
};
