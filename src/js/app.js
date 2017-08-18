// Try Modernizr
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
	console.log("Playing")
	var Numbers = require('./numbers')
	var gameSetUp = require('./gameSetUp')
	var KonvaGame = require('./konva-game')

} else {
	console.log("Not a mobile device")
  document.getElementById('full-screen').innerHTML = "<p>Run Hungry Monster on a mobile device, or in Chrome Dev Tools with mobile simulator</p>";
  document.getElementById('full-screen').setAttribute('class', 'wrong-device');
}

document.getElementById("play-button").addEventListener("click", reloadPage);

function reloadPage() {
  location.reload()
};
