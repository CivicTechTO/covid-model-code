

const canvas = document.getElementById('canvas');

var C = makeConstants();

var state = new TestbedState(config, canvas.width, canvas.height);
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


let context = canvas.getContext('2d');

//state.draw(context);

window.requestAnimationFrame(animate);

// for (var i = 2000; i >= 0; i--) 
// {
// 	state.step(FRAME);
// }
