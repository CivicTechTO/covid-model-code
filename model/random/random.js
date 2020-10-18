
function rand(end)
{
	return Math.floor(end * Math.random());
}

function delta()
{
	return rand(3) - 1;

}

function setState(config)
{
	var state = {};
	state.size = config.size;

	var width = state.size.width;
	var height = state.size.height;

	state.persons = [];

	for (var i = 0; i < config.count; i++) 
	{
		state.persons[i] = {x: rand(width), y: rand(height)};
	}

	return state;
}

function step(state, tDelta) 
{
	for (var i = state.persons.length - 1; i >= 0; i--) 
	{
		state.persons[i].x += delta();
		state.persons[i].y += delta();
	}

	return state;
}

function draw(state)
{
	var canvas = document.getElementById('canvas');

	const context = canvas.getContext('2d');

	context.fillStyle = 'LightBlue';
	context.fillRect(0, 0, width, height);

	context.strokeStyle = 'black';

	for (var i = state.persons.length - 1; i >= 0; i--) 
	{
		context.strokeRect(state.persons[i].x, state.persons[i].y, 1, 1);	
	}

}

function animate(timestamp)
{
	draw(state);

	state = step(state, 0);

	window.requestAnimationFrame(animate);
}

var state = setState(config);

var width = state.size.width;
var height = state.size.height;

var canvas = document.getElementById('canvas');

canvas.width = width;
canvas.height = height;

window.requestAnimationFrame(animate);
