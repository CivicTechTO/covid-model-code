

const canvas = document.getElementById('canvas');

var state = new InfectState(config, canvas.width, canvas.height);
state.fill(config);

state.week[0].startShift();

// let context = canvas.getContext('2d');

// state.draw(context);

window.requestAnimationFrame(animate);

// for (var i = 2000; i >= 0; i--) 
// {
// 	state.step(FRAME);
// }
