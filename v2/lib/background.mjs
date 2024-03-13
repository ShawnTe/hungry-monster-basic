export const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

export function draw(state) {
  ctx.save();
  // Flip coordinate system upside down
  ctx.translate(0, window.innerHeight);
  ctx.scale(1, -1);
  ctx.scale(state.scale, state.scale);

  // Draw scene
  drawBackground(state);
  drawBuildings(state);

  ctx.restore();
}

export function generateBuilding(index, state) {
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
function drawBackground(state) {
  // Draw sky
  ctx.fillStyle = "#EE9B00";
  ctx.fillStyle = "rgb(255, 140, 0, .5)";
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

function drawBuildings(state) {
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

export default {
  canvas,
  draw,
  generateBuilding,
};
