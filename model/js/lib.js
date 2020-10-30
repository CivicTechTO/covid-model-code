function rand(end)
{
	return Math.floor(end * Math.random());
}

const FRAME = 1000 / 60;

var past = null;

function animate(timestamp)
{
	window.requestAnimationFrame(animate);

	let deltaT = (past ? timestamp - past : FRAME);
	past = timestamp;

	const context = document.getElementById('canvas').getContext('2d');

	context.save();

	state.draw(context);

	context.restore();

	state.step(deltaT);
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

function transfer(fromSet, toSet, member) 
{
	toSet.add(member);
	fromSet.delete(member);
}
