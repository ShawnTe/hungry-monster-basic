// Try Modernizr
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
	console.log("Playing")
	var gameSetUp = require('./gameSetUp')
	var KonvaGame = require('./konvaGame')

} else {
	console.log("Not a mobile device")
  document.getElementById('full-screen').innerHTML = "<p>Run Hungry Monster:</p><ul><li>in lansdcape mode</li><li>on a mobile device</li><li>OR in Chrome Dev Tools with mobile simulator</li></ul>";
  document.getElementById('full-screen').setAttribute('class', 'wrong-device');
}

document.getElementById("play-button").addEventListener("click", reloadPage);

function reloadPage() {
  location.reload()
};
