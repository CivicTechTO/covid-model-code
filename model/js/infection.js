class Infection
{
	draw(context, point){}

	constructor()
	{
		this.load = 0;
	}
}

class NotInfectious extends Infection
{
	constructor()
	{
		super();

		this.load = state.infectious.not.load;
	}

	draw(context, point)
	{		
	}
}

class SlightlyInfectious extends Infection
{
	constructor()
	{
		super();

		this.load = state.infectious.slightly.load;
	}

	draw(context, point)
	{		
		let size = state.personSize;

		context.beginPath();
		context.moveTo(point.x, point.y);
		context.lineTo(point.x + size, point.y + size);
		context.stroke();
	}
}

class VeryInfectious extends Infection
{
	constructor()
	{
		super();

		this.load = state.infectious.very.load;
	}

	draw(context, point)
	{		
		let size = state.personSize;

		context.beginPath();
		context.moveTo(point.x, point.y);
		context.lineTo(point.x + size, point.y - size);
		context.stroke();
	}
}

class ExceedinglyInfectious extends Infection
{
	constructor()
	{
		super();

		this.load = state.infectious.exceedingly.load;
	}

	draw(context, point)
	{		
		let size = state.personSize;

		context.beginPath();
		context.moveTo(point.x, point.y);
		context.lineTo(point.x + size, point.y + size);
		context.moveTo(point.x, point.y);
		context.lineTo(point.x + size, point.y - size);
		context.stroke();
	}
}


function makeInfectious() 
{
	let pick = Math.random();

	pick -= state.infectious.exceedingly.chance;

	if (pick < 0)
	{
		return new ExceedinglyInfectious();
	}

	pick -= state.infectious.very.chance;

	if (pick < 0)
	{
		return new VeryInfectious();
	}

	pick -= state.infectious.slightly.chance;

	if (pick < 0)
	{
		return new SlightlyInfectious();
	}

	return new NotInfectious();
}
