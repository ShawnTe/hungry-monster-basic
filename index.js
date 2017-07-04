// Share: html5 canvase method: measureText(txt)
  const numOfNumbers = 6;

  const generateRandomNumber = (max, min) => {
    randomNumber = Math.floor( (Math.random() * (max - min) + min) )
    return randomNumber
  }

  const Number = function(stage) {
    this.value = generateRandomNumber(10, 1)
    this.img = "./images/cupcake-163593_640.jpg"
    this.x = generateRandomNumber(900,400),
    // console.log(this.x)
    this.y = generateRandomNumber(600,0),
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

  const assignNumbers = (stage) => {
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

          if (dx > 50 && dy > 50) {
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

  const checkForCorrectMath = (num1, num2) => {
    console.log("IN CHECK MATH FUNCTION")
    console.log(num1)
    console.log(num2)

    num1 = parseInt(num1);
    num2 = parseInt(num2);

    if (game.target === num1 + num2) {
      document.getElementById('full-screen').innerHTML = "<br />RIGHT<br />ON! <br /><img src='./images/celebrate.gif' width='400' />";
      document.getElementById('full-screen').setAttribute('id', 'success');

    } else {
      console.log("Drag a number out and try again")
      document.getElementById('h1').innerHTML = "Drag at least one number out and try again";


    }
  }
