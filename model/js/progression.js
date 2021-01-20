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

	getStyle()
	{
		return state.susceptible;
	}

	draw(context, point)
	{		
		let size = state.personSize;
		context.lineWidth = 1;

		context.beginPath();
		context.moveTo(point.x - size, point.y);
		context.lineTo(point.x + size, point.y);
		context.moveTo(point.x, point.y - size);
		context.lineTo(point.x, point.y + size);
		context.stroke();
	}

	baseDraw(context, point, size)
	{
		context.lineWidth = 1;

		context.beginPath();
		context.moveTo(point.x, point.y);
		context.lineTo(point.x + size, point.y);
		context.moveTo(point.x, point.y);
		context.lineTo(point.x, point.y + size);
	}

	linear(startValue, endValue, startTime, endTime) 
	{		
		let slope = (endValue - startValue) / (endTime - startTime);
		return  startValue + slope * ((state.clock - this.infectedAt) - startTime);
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

	getStyle()
	{
		return state.progression.notYet.style;
	}

	draw(context, point) 
	{
		let size = state.personSize;

		this.baseDraw(context, point, size);
		context.stroke();
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
		return this.linear(startFactor, endFactor, start, end);
	}

	transition()
	{
		return state.transition.noSymptoms + this.infectedAt;
	}

	progress()
	{
		return new Peak(this.infectedAt);
	}

	getStyle()
	{
		return state.progression.notYet.style;
	}

	draw(context, point) 
	{
		let size = state.personSize;

		this.baseDraw(context, point, size);
		context.moveTo(point.x, point.y);
		context.lineTo(point.x - size, point.y + size);
		context.stroke();
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

		return this.linear(startFactor, endFactor, start, end);
	}

	transition()
	{
		return state.transition.peak + this.infectedAt;
	}

	progress()
	{
		return new Declining(this.infectedAt);
	}

	getStyle()
	{
		return state.progression.peak.style;
	}

	draw(context, point) 
	{
		let size = state.personSize;

		this.baseDraw(context, point, size);
		context.moveTo(point.x, point.y);
		context.lineTo(point.x - size, point.y);
		context.stroke();
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
		return this.linear(startFactor, endFactor, start, end);
	}

	transition()
	{
		return state.transition.declining + this.infectedAt;
	}

	progress()
	{
		return new Recovered(this.infectedAt);
	}

	getStyle()
	{
		return state.progression.declining.style;
	}

	draw(context, point) 
	{
		let size = state.personSize;

		this.baseDraw(context, point, size);
		context.moveTo(point.x, point.y);
		context.lineTo(point.x - size, point.y);
		context.moveTo(point.x, point.y);
		context.lineTo(point.x - size, point.y + size);
		context.stroke();
	}
}

class Recovered extends Progression
{
	constructor(infectedAt)
	{
		super(infectedAt);
	}

	getStyle()
	{
		return state.progression.notYet.style;
	}

	draw(context, point) 
	{
		let size = state.personSize;

		this.baseDraw(context, point, size);
		context.moveTo(point.x, point.y);
		context.lineTo(point.x - size, point.y - size);
		context.stroke();
	}

	infectable()
	{
		return false;
	}
}

