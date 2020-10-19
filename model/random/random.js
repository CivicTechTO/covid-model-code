
function delta()
{
	return rand(3) - 1;

}

function setState(config)
{
	let state = {};
	state.size = config.size;

	let width = state.size.width;
	let height = state.size.height;

	state.persons = [];

	for (var i = 0; i < config.count; i++) 
	{
		state.persons[i] = {x: rand(width), y: rand(height)};
	}

	return state;
}

function step(state, deltaT) 
{
	for (var i = state.persons.length - 1; i >= 0; i--) 
	{
		state.persons[i].x += delta();
		state.persons[i].y += delta();
	}

	return state;
}

function draw(context, state)
{
	context.fillStyle = 'LightBlue';
	context.fillRect(0, 0, width, height);

	context.strokeStyle = 'black';

	for (var i = state.persons.length - 1; i >= 0; i--) 
	{
		context.strokeRect(state.persons[i].x, state.persons[i].y, 1, 1);	
	}

}


var state = setState(config);

var width = state.size.width;
var height = state.size.height;

var canvas = document.getElementById('canvas');

canvas.width = width;
canvas.height = height;

window.requestAnimationFrame(animate);
