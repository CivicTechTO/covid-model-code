
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

	state.personList = [];

	for (var i = 0; i < config.count; i++) 
	{
		state.personList[i] = {x: rand(width), y: rand(height)};
	}

	return state;
}

function step(state, deltaT) 
{
	for (var i = state.personList.length - 1; i >= 0; i--) 
	{
		state.personList[i].x += delta();
		state.personList[i].y += delta();
	}

	return state;
}

function draw(context, state)
{
	context.fillStyle = 'LightBlue';
	context.fillRect(0, 0, width, height);

	context.strokeStyle = 'black';

	for (var i = state.personList.length - 1; i >= 0; i--) 
	{
		context.strokeRect(state.personList[i].x, state.personList[i].y, factorX, factorY);
	}

}


var state = setState(config);

var width = state.size.width;
var height = state.size.height;

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

var factorX = width / canvas.width;
var factorY = height / canvas.height;

context.setTransform(1 / factorX, 0, 0, 1 / factorY, 0, 0);

window.requestAnimationFrame(animate);
