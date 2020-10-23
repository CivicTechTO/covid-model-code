function Person(current, dest)
{
	this.current = current;
	this.dest = dest;
}

function target(width, height)
{
	return new Point(rand(width), rand(height));
}

function setState(config)
{
	let state = {};
	state.size = config.size;

	state.speed = config.speed;

	let width = state.size.width;
	let height = state.size.height;

	state.personList = [];

	for (var i = 0; i < config.count; i++) 
	{
		state.personList[i] = new Person(target(width, height), target(width, height));
	}

	return state;
}

function step(state, deltaT) 
{
	let width = state.size.width;
	let height = state.size.height;

	let stepDelta = state.speed * Math.round(deltaT / FRAME);

	for (var i = state.personList.length - 1; i >= 0; i--) 
	{
		let current = state.personList[i].current;
		let dest = state.personList[i].dest;

		if (current.x === dest.x)
		{
			if (current.y === dest.y)
			{
				state.personList[i].dest = target(width, height);
			}
			if (current.y < dest.y)
			{
				state.personList[i].current.y = Math.min(dest.y, current.y + stepDelta);
			}
			else
			{
				state.personList[i].current.y = Math.max(dest.y, current.y - stepDelta);
			}
		}
		else
		{
			if (current.x < dest.x)
			{
				state.personList[i].current.x = Math.min(dest.x, current.x + stepDelta);
			}
			else
			{
				state.personList[i].current.x = Math.max(dest.x, current.x - stepDelta);
			}
		}
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
		context.strokeRect(state.personList[i].current.x, state.personList[i].current.y, factorX, factorY);	
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
