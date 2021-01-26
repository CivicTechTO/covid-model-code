function rand(end)
{
	return Math.floor(end * Math.random());
}

function clamp(lower, upper, value) 
{
	return (lower > value ? lower : (upper < value ? upper : value));
}

function tickToMinute(tick)
{
	return Math.floor(tick / ((60 / config.realTick)));
}

function tickToHour(tick)
{
	return Math.floor(tick / (((60 * 60) / config.realTick)));
}

function tickToDay(tick)
{
	return Math.floor(tick / (((24 * 60 * 60) / config.realTick)));
}

function hourToTick(hour) 
{
	return hour * ((60 * 60) / config.realTick);
}

function dayToTick(day) 
{
	return day * ((24 * 60 * 60) / config.realTick);
}

const FRAME = 1000 / 60;

var past = null;

function animate(timestamp)
{
	let deltaT = (past ? timestamp - past : FRAME);
	past = timestamp;
	stepCount = Math.max(state.stepsPerFrame, Math.round(deltaT / FRAME));

	for (var i = 0; i < stepCount; i++) 
	{
		state.step();
	}

	draw();

	if (state.run)
	{
		window.requestAnimationFrame(animate);
	}
}

function draw() 
{
	const context = document.getElementById('canvas').getContext('2d');
	context.save();
	state.draw(context);
	context.restore();
}

function setSteps(steps) 
{
	state.stepsPerFrame = steps;
}

class Point
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}

	equals(other)
	{
		return this.x === other.x && this.y === other.y;
	}
}

// function transfer(fromSet, toSet, member) 
// {
// 	toSet.add(member);
// 	fromSet.delete(member);
// }


function chooseOne(choices) 
{
	return choices[rand(choices.length)];
}

function makeChoices(optionList, weightList) 
{
	let result = [];

	for (var i = 0; i < optionList.length; i++) 
	{
		for (var j = 0; j < weightList[i]; j++) 
		{
			result.push(optionList[i]);
		}
	}

	return result;
}

function debug(argument) 
{
	if (state.debug) 
	{
		console.log(argument);
	}
}