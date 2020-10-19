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

function Point(x, y)
{
	this.x = x;
	this.y = y;
}
