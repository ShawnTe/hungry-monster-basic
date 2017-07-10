


/////////////////////////////////////////

  var width = window.innerWidth;
  // var width = 700;
  // var height = 500;
  var height = window.innerHeight;

  stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
  });

  layer = new Konva.Layer();

  var text = new Konva.Text({
    fill : 'black',
    fontSize : 20
  });

  var tempArray = []

  // layer.add(text);

  stage.add(layer);

  var tempLayer = new Konva.Layer();
  stage.add(tempLayer);


const init = () => {
  // playGame(stage);
  game = new Game();
  assignNumbers(stage);
  drawNumbers(layer);
  assignTarget();
  drawTarget(stage, layer);
  layer.draw();
}


// var text = new Konva.Text({
//     fill : 'black'
// });
// layer.add(text);
const drawNumbers = (layer) => {
  let gameNumbers = game.numbers
  // var number;
  var colors = ["blue", "green", "red", "pink", "yellow", "purple", "teal"];
  for(var i = 0; i < gameNumbers.length; i++) {
    let gameNum = gameNumbers[i];
    var number = new Konva.Text({
      x : gameNum.x,
      y : gameNum.y,
      // x : generateRandomNumber(stage.getWidth() - 200) + 100,
      // y : generateRandomNumber(stage.getHeight() -200) + 100,
      // name : gameNum.name,
      name : 'Current number',
      text : gameNum.value,
      fontSize : 80,
      fontFamily : 'Futura',
      fill : colors[i],
      padding : 10,
      shadowOffsetX : 5,
      shadowOffsetY : 5,
      draggable: true,
    });
    layer.add(number);
  }
}

const drawTarget = () => {
  // var group = new Konva.Group({
  //      x: -100,
  //      y: 0,
  //  });


  var name = game.target
  var target = new Konva.Text({
    x : -100,
    y : 0,
    name : 'Target',
    text : name,
    fontSize : 300,
    fontFamily : 'Futura',
    fill : 'purple',
    padding : 100,
    shadowOffsetX : 10,
    shadowOffsetY : 10,
    draggable : false,
    id : 'target-number'
  })
  layer.add(target);


}

/// how to hold this until onload?

document.getElementById("container").addEventListener("click", holdUntilLoad());

function holdUntilLoad()  {
  stage.on("dragstart", function(e){
    console.log("This is the picked up number: " + e.target.text())

    e.target.moveTo(tempLayer);
    text.text('Moving ' + e.target.name());
    layer.draw();
  });
  var previousShape;
  stage.on("dragmove", function(evt){
      var pos = stage.getPointerPosition();
      var shape = layer.getIntersection(pos);
      if (previousShape && shape) {
          if (previousShape !== shape) {
              // leave from old targer
              previousShape.fire('dragleave', {
                  type : 'dragleave',
                  target : previousShape,
                  evt : evt.evt
              }, true);
              // enter new targer
              shape.fire('dragenter', {
                  type : 'dragenter',
                  target : shape,
                  evt : evt.evt
              }, true);
              previousShape = shape;
          } else {
              previousShape.fire('dragover', {
                  type : 'dragover',
                  target : previousShape,
                  evt : evt.evt
              }, true);
          }
      } else if (!previousShape && shape) {
          previousShape = shape;
          shape.fire('dragenter', {
              type : 'dragenter',
              target : shape,
              evt : evt.evt
          }, true);
      } else if (previousShape && !shape) {
          previousShape.fire('dragleave', {
              type : 'dragleave',
              target : previousShape,
              evt : evt.evt
          }, true);
          previousShape = undefined;
      }
  });
  stage.on("dragend", function(e){
      var pos = stage.getPointerPosition();
      var shape = layer.getIntersection(pos);
      if (shape) {
          previousShape.fire('drop', {
              type : 'drop',
              target : previousShape,
              evt : e.evt
          }, true);
      }
      previousShape = undefined;
      e.target.moveTo(layer);
      layer.draw();
      tempLayer.draw();
  });
  stage.on("dragenter", function(e){
      e.target.fill('green');
      text.text('dragenter ' + e.target.name());
      layer.draw();
  });
  stage.on("dragleave", function(e){
      e.target.fill('blue');
      text.text('dragleave ' + e.target.name());
      layer.draw();
      if (e.target.name() == "Target") {
        console.log('SAY YESSSSS AND number: ' )
        // console.log(this )
        // if # is in tempArray, then delete
        let num = parseInt(this.tapStartShape.partialText);
        // console.log(parseInt(num))
        console.log('tempArray: ')
        console.log(tempArray);
        var whazza = tempArray.includes(num)
        console.log(whazza)
        if (tempArray.includes(num)){
          let index = tempArray.indexOf(num)
            tempArray.splice(index, 1);
        } else {
          console.log('tempArray.includes is FALSE')
        }
        console.log(tempArray)
      };
  });
  stage.on("dragover", function(e){
      text.text('dragover ' + e.target.name());
      layer.draw();
  });
  stage.on("drop", function(e){

      if (e.target.attrs.id === "target-number"){
        // console.log("Get event:  " + e.target);
        // console.log("in DROP function - if");
        let equationNumber = parseInt(e.currentTarget.tapStartShape.text());

        tempArray.push(equationNumber);

        if (tempArray.length == 2){
          let num1 = tempArray[0]
          let num2 = tempArray[1]

          checkForCorrectMath(num1,num2);
        } else {
          // console.log('doing nothing because !==2 items in array');
        };
        console.log(tempArray);

      } else {
        // console.log("in DROP function WHYWHY WHY??");
      };

      e.target.fill('red');
      // console.log("Dropped on value:")
      // console.log(e.target.name());
      // console.log(e.target.id());

      // dropped on value
      // var littleNumNum = parseInt(e.target.name())   // this is the number name
      // console.log(littleNumNum)    // need to convert to integer?
      text.text('drop ' + e.target.name());
      layer.draw();
  });
}

init();
