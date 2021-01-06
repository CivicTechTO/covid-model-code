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
		context.strokeStyle = state.infectious.not.style;
		context.lineWidth = 1;
		context.beginPath();
		context.moveTo(point.x, point.y);
		context.lineTo(point.x, point.y + state.personSize);
		context.stroke();
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
		let style = state.infectious.slightly.style;
		bottomRight(context, point, style, style);
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
		let style = state.infectious.very.style;
		bottomLeft(context, point, style, style);
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
		let style = state.infectious.exceedingly.style;
		bottomLeft(context, point, style, style);
		bottomRight(context, point, style, style);
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
