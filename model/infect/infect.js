

const canvas = document.getElementById('canvas');

var C = makeConstants();
var state = new TownState(makeConfig(), canvas.width, canvas.height);
state.fill();
state.initialize();

state.debugDraw = true;

state.week[0].startShift();

function start()
{
	state.run = true;

	window.requestAnimationFrame(animate);
}

function stop() 
{
	state.run = false;
}

window.requestAnimationFrame(animate);

// let context = canvas.getContext('2d');
//draw(context);

// state.step();

// setSteps(1000);

// for (var i = 100000; i >= 0; i--) 
// {
// 	state.step(FRAME);
// }
