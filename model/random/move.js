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

	state.persons = [];

	for (var i = 0; i < config.count; i++) 
	{
		state.persons[i] = new Person(target(width, height), target(width, height));
	}

	return state;
}

function step(state, deltaT) 
{
	let width = state.size.width;
	let height = state.size.height;

	let stepDelta = state.speed * Math.round(deltaT / FRAME);

	for (var i = state.persons.length - 1; i >= 0; i--) 
	{
		let current = state.persons[i].current;
		let dest = state.persons[i].dest;

		if (current.x === dest.x)
		{
			if (current.y === dest.y)
			{
				state.persons[i].dest = target(width, height);
			}
			if (current.y < dest.y)
			{
				state.persons[i].current.y = Math.min(dest.y, current.y + stepDelta);
			}
			else
			{
				state.persons[i].current.y = Math.max(dest.y, current.y - stepDelta);
			}
		}
		else
		{
			if (current.x < dest.x)
			{
				state.persons[i].current.x = Math.min(dest.x, current.x + stepDelta);
			}
			else
			{
				state.persons[i].current.x = Math.max(dest.x, current.x - stepDelta);
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

	for (var i = state.persons.length - 1; i >= 0; i--) 
	{
		context.strokeRect(state.persons[i].current.x, state.persons[i].current.y, 1, 1);	
	}
}


var state = setState(config);

var width = state.size.width;
var height = state.size.height;

var canvas = document.getElementById('canvas');

canvas.width = width;
canvas.height = height;

window.requestAnimationFrame(animate);
