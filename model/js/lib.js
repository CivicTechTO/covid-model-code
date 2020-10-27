function rand(end)
{
	return Math.floor(end * Math.random());
}

const FRAME = 1000 / 60;

var past = null;

function animate(timestamp)
{
	window.requestAnimationFrame(animate);

	if (past)
	{
		deltaT = timestamp - past;
	}
	else
	{
		deltaT = FRAME;
	}

	past = timestamp;

	const context = document.getElementById('canvas').getContext('2d');

	context.save();

	draw(context, state);

	context.restore();

	state = step(state, deltaT);
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

function findFeeder(width, feederSpace, x)
{
	let last = width - feederSpace;
	return Math.min(last, Math.max(feederSpace, feederSpace * Math.round(x / feederSpace)));
}


