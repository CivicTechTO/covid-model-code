

const canvas = document.getElementById('canvas');

var C = makeConstants();
var state = new GameState(makeConfig(), canvas.width, canvas.height);
state.fill();
state.initialize();

state.debugDraw = false;
state.countDraw = false;
state.debugCount = 0;

state.week[0].startShift();

draw();

// window.requestAnimationFrame(animate);

// let context = canvas.getContext('2d');
//draw(context);

// state.step();

// setSteps(1000);

// for (var i = 100000; i >= 0; i--) 
// {
// 	state.step(FRAME);
// }
