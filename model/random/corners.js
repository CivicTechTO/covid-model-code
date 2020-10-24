/*
 *	Go to corner rooms via roads
 */


/*
 *	There is one main E/W road halfway up the model
 *  There are a set of equally spaced N/S feeder roads
 *  Path finding is
 *		Go E/W to the nearest feeder road
 *		Go N/S to the main road
 *		Go E/W to the feeder road nearest the dest
 *		Go N/S to the dest y co-ordinate
 *		Go E/W to the dest
 */


function findFeeder(width, feederSpace, x)
{
	let last = width - feederSpace;
	return Math.min(last, Math.max(feederSpace, feederSpace * Math.round(x / feederSpace)));
}

function newFinal(person, state)
{
	previousX = person.final.x;
	previousY = person.final.y;

	person.final = target(state);

	return previousX !== person.final.x || previousY !== person.final.y;
}

function Person(state)
{
	this.current = target(state);
	this.dest = new Point(this.current.x, this.current.y);
	
	this.final = {x: -1, y: -1};			// Guaranteed to change
	newFinal(this, state);

	return this;
}

function target(state)
{
	let x = state.whichX[state.which];
	let y = state.whichY[state.which];

	return new Point(x, y);
}

function setState(config)
{
	let state = {};

	state.size = config.size;
	let width = state.size.width;
	let height = state.size.height;

	state.speed = config.speed;

	state.main = config.main;
	state.feederSpace = config.feederSpace;

	state.tick = 0;
	state.when = Math.floor(config.when / config.speed);
	state.which = 0;
	state.whichX = [2, width - 2, 2, width - 2];
	state.whichY = [2, 2, height - 2, height - 2];


	state.personList = [];

	for (var i = 0; i < config.count; i++) 
	{
		state.personList[i] = new Person(state);
	}

	return state;
}

function nextDest(person, state)
{
	let main = state.main;
	let feederSpace = state.feederSpace;
	let width = state.size.width;
	let height = state.size.height;

	if (person.current.x == person.final.x && person.current.y == person.final.y)
	{
		if (newFinal(person, state))
		{
			person.outbound = true;
			person.dest = new Point(findFeeder(width, feederSpace, person.current.x), person.current.y)
		}
	}
	else
	{
		if (person.outbound)
		{
			if (person.current.y == main)
			{
				person.outbound = false;
				person.dest.x = findFeeder(width, feederSpace, person.final.x);
			}
			else
			{
				person.dest.y = main;
			}
		}
		else
		{
			if (person.current.y == main)
			{
				person.dest.y = person.final.y;
			}
			else
			{
				if (person.current.x !== person.final.x)
				{
					person.dest.x = person.final.x;				
				}
			}
		}
	}
}

function step(state, deltaT) 
{
	let width = state.size.width;
	let height = state.size.height;

	let stepDelta = state.speed * Math.round(deltaT / FRAME);

	state.tick += 1;

	if (0 == state.tick % state.when)
	{
		state.which = (state.which + 1) % 4;
	}

	for (var i = state.personList.length - 1; i >= 0; i--) 
	{
		let person = state.personList[i];
		let current = person.current;
		let dest = person.dest;

		if (current.x == dest.x)
		{
			if (current.y == dest.y)
			{
				nextDest(person, state);
			}
			if (current.y < dest.y)
			{
				current.y = Math.min(dest.y, current.y + stepDelta);
			}
			else
			{
				current.y = Math.max(dest.y, current.y - stepDelta);
			}
		}
		else
		{
			if (current.x < dest.x)
			{
				current.x = Math.min(dest.x, current.x + stepDelta);
			}
			else
			{
				current.x = Math.max(dest.x, current.x - stepDelta);
			}
		}
	}

	return state;
}

function draw(context, state)
{
	var width = state.size.width;
	var height = state.size.height;

	context.fillStyle = 'LightBlue';
	context.fillRect(0, 0, width, height);

	context.strokeStyle = 'black';

	for (var i = state.personList.length - 1; i >= 0; i--) 
	{
		let x = state.personList[i].current.x;
		let y = state.personList[i].current.y;

		context.strokeRect(x, y, factorX, factorY);	
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
