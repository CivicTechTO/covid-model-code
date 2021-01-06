class Progression
{
	constructor(infectedAt)
	{
		this.infectedAt = infectedAt;
	}

	draw(context, point) {}

	canProgress()
	{
		return false;
	}

	infectable()
	{
		return true;
	}

	infectious()
	{
		return false;
	}

	factor()
	{
		return 0.0;
	}

	draw(context, point)
	{		
		let size = state.personSize;

		context.strokeStyle = state.susceptible;

		context.beginPath();
		context.moveTo(point.x - size, point.y - size);
		context.lineTo(point.x + size, point.y + size);
		context.moveTo(point.x + size, point.y - size);
		context.lineTo(point.x - size, point.y + size);
		context.stroke();
	}
}

class CanProgress extends Progression
{
	constructor(infectedAt)
	{
		super(infectedAt);
	}

	canProgress()
	{
		return true;
	}

	infectable()
	{
		return false;
	}
}

class NotYet extends CanProgress
{
	constructor(infectedAt)
	{
		super(infectedAt);
	}

	transition()
	{
		return state.transition.notYet + this.infectedAt;
	}

	progress()
	{
		return new NoSymptoms(this.infectedAt);
	}

	draw(context, point) 
	{
		let style = state.progression.notYet.style;
		topRight(context, point, style, style);
	}
}

class NoSymptoms extends CanProgress
{
	constructor(infectedAt)
	{
		super(infectedAt);
	}

	infectious()
	{
		return true;
	}
	
	factor()
	{
		let startFactor = state.progression.noSymptoms.startFactor;
		let endFactor = state.progression.noSymptoms.endFactor;
		let start = state.transition.notYet;
		let end = state.transition.noSymptoms;

		let slope = (endFactor - startFactor) / (end - start);
		return  startFactor + slope * (state.clock - this.infectedAt);
	}

	transition()
	{
		return state.transition.noSymptoms + this.infectedAt;
	}

	progress()
	{
		return new Peak(this.infectedAt);
	}

	draw(context, point) 
	{
		let style = state.progression.notYet.style;
		topRight(context, point, style, state.contrast);
		topLeft(context, point, style, style);
	}
}

class Peak extends CanProgress
{
	constructor(infectedAt)
	{
		super(infectedAt);
	}

	infectious()
	{
		return true;
	}
	
	factor()
	{
		let startFactor = state.progression.peak.startFactor;
		let endFactor = state.progression.peak.endFactor;
		let start = state.transition.noSymptoms;
		let end = state.transition.peak;

		let slope = (endFactor - startFactor) / (end - start);
		return  startFactor + slope * (state.clock - this.infectedAt);
	}

	transition()
	{
		return state.transition.peak + this.infectedAt;
	}

	progress()
	{
		return new Declining(this.infectedAt);
	}

	draw(context, point) 
	{
		let style = state.progression.peak.style;
		topRight(context, point, style, state.contrast);
		topLeft(context, point, style, state.contrast);
	}
}

class Declining extends CanProgress
{
	constructor(infectedAt)
	{
		super(infectedAt);
	}

	infectious()
	{
		return true;
	}
	
	factor()
	{
		let startFactor = state.progression.declining.startFactor;
		let endFactor = state.progression.declining.endFactor;
		let start = state.transition.peak;
		let end = state.transition.declining;

		let slope = (endFactor - startFactor) / (end - start);
		return  startFactor + slope * (state.clock - this.infectedAt);
	}

	transition()
	{
		return state.transition.declining + this.infectedAt;
	}

	progress()
	{
		return new Over(this.infectedAt);
	}

	draw(context, point) 
	{
		let style = state.progression.declining.style;
		topRight(context, point, style, style);
		topLeft(context, point, style, state.contrast);
	}
}

class Over extends Progression
{
	constructor(infectedAt)
	{
		super(infectedAt);
	}

	draw(context, point) 
	{
		let style = state.progression.notYet.style;
		topRight(context, point, style, state.contrast);
	}

	infectable()
	{
		return false;
	}
}

