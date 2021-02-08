

const canvas = document.getElementById('canvas');

var C = makeConstants();

var state = new TownState(config, canvas.width, canvas.height);
state.fill(config);

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

// for (var i = 2000; i >= 0; i--) 
// {
// 	state.step(FRAME);
// }
