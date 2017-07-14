// Share: html5 canvase method: measureText(txt)
  const numOfNumbers = 7;

  const generateRandomNumber = (max, min) => {
    randomNumber = Math.floor( (Math.random() * (max - min) + min) )
    return randomNumber
  }

  const Number = function(stage) {
    this.value = generateRandomNumber(10, 1)
    // this.img = "./images/cupcake-163593_640.jpg"
    this.x = generateRandomNumber(900,500),
    // console.log(this.x)
    this.y = generateRandomNumber(600,100),
    // console.log(this.y)
    // name = `${game.numbers[i].value}`,
    // this.name = "XXXXXXXXXXXXXXXXXXXXXXXX",
    this.text = this.value
  };

  const Game = function() {
    this.numberOfTurns = 3
    this.over = false
    this.target = 0
    this.numbers = []
  };

  const assignNumbers = () => {
    for (var i = 1; i < numOfNumbers; i++) {
      let num = new Number(stage)

      detectOverlap(num, stage);
      game.numbers.push(num)
    }
    // console.log(game.numbers)
  }

  const detectOverlap = (num, stage) => {
    while (true) {
      for (var i = 0; i < game.numbers.length; i++){
        let numInArray = game.numbers[i]
        let dx = Math.abs(numInArray.x - num.x);
        let dy = Math.abs(numInArray.y - num.y);

          if (dx > 80 && dy > 80) {
            // console.log("Acceptable" + num)

            return num;
          } else {
            let num = new Number(stage)
            detectOverlap(num, stage)
          };
          return false;
      };
      // console.log("First: " + num)
      return num;
    }
  }

  const assignTarget = () => {
    let numOfObjects = game.numbers.length
    // console.log(game)
    let i = generateRandomNumber(numOfObjects-1,1)
    let j = i - 1
    let actualNumValue1 = game.numbers[i].value
    let actualNumValue2 = game.numbers[j].value

    game.target = actualNumValue1 + actualNumValue2
  }

  const youWin = () => {
    document.getElementById('full-screen').innerHTML = "RIGHT ON! <br /><img src='./images/celebrate.gif' width='400' /><br />";
    document.getElementById('full-screen').setAttribute('id', 'success');
    document.getElementById('play-button').classList.remove('hidden');
  }

  const tryAgain = (answer) => {
    console.log(answer)
    if (answer == 'low') {
      text.text("I'm still hungry!");
    } else {
      text.text("I'm too full!");
    }
  }

  const addNumbers = () => {

  }
  const checkForCorrectMath = () => {
    var numbersToAdd = []

    for (var i = 0; i < tempArray.length; i++) {
      numbersToAdd.push(parseInt(tempArray[i]));
    }

    var sum = numbersToAdd.reduce((a,b) => a+b, 0);

    if (game.target === sum) {
      youWin();
    } else {
      var answer = ""

      if (sum < game.target) {
        answer = 'low'
      } else {
        answer = 'high'
      }
      tryAgain(answer);
    }
  }

  document.getElementById("play-button").addEventListener("click", reloadPage);

  function reloadPage() {
    location.reload()
  };
