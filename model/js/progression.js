class Draw
{
	draw(context, point) {}

	baseDraw(context, point, size)
	{
		context.lineWidth = 1;

		context.beginPath();
		context.moveTo(point.x, point.y);
		context.lineTo(point.x + size, point.y);
		context.moveTo(point.x, point.y);
		context.lineTo(point.x, point.y + size);
	}
}

class Draw0 extends Draw
{
	draw(context, point) 
	{
		const size = state.personSize;
		context.lineWidth = 1;

		context.beginPath();
		context.moveTo(point.x - size, point.y);
		context.lineTo(point.x + size, point.y);
		context.moveTo(point.x, point.y - size);
		context.lineTo(point.x, point.y + size);
		context.stroke();
	}
}

class Draw1 extends Draw
{
	draw(context, point) 
	{
		let size = state.personSize;

		this.baseDraw(context, point, size);
		context.stroke();
	}
}

class Draw2 extends Draw
{
	draw(context, point) 
	{
		let size = state.personSize;

		this.baseDraw(context, point, size);
		context.moveTo(point.x, point.y);
		context.lineTo(point.x - size, point.y + size);
		context.stroke();
	}
}

class Draw3 extends Draw
{
	draw(context, point) 
	{
		let size = state.personSize;

		this.baseDraw(context, point, size);
		context.moveTo(point.x, point.y);
		context.lineTo(point.x - size, point.y);
		context.stroke();
	}
}

class Draw4 extends Draw
{
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

class Draw5 extends Draw
{
	draw(context, point) 
	{
		let size = state.personSize;

		this.baseDraw(context, point, size);
		context.moveTo(point.x, point.y);
		context.lineTo(point.x - size, point.y - size);
		context.stroke();
	}
}

class Draw6 extends Draw
{
	draw(context, point) 
	{
		let size = state.personSize;

		this.baseDraw(context, point, size);
		context.moveTo(point.x, point.y);
		context.lineTo(point.x - size, point.y - size);
		context.moveTo(point.x, point.y);
		context.lineTo(point.x - size, point.y + size);
		context.stroke();
	}
}

class Draw7 extends Draw
{
	draw(context, point) 
	{
		let size = state.personSize;

		this.baseDraw(context, point, size);
		context.moveTo(point.x, point.y);
		context.lineTo(point.x - size, point.y - size);
		context.moveTo(point.x, point.y);
		context.lineTo(point.x - size, point.y);
		context.stroke();
	}
}

class Draw8 extends Draw
{
	draw(context, point) 
	{
		let size = state.personSize;

		this.baseDraw(context, point, size);
		context.moveTo(point.x, point.y);
		context.lineTo(point.x - size, point.y - size);
		context.moveTo(point.x, point.y);
		context.lineTo(point.x - size, point.y);
		context.moveTo(point.x, point.y);
		context.lineTo(point.x - size, point.y + size);
		context.stroke();
	}
}

class Draw9 extends Draw
{
	draw(context, point) 
	{
		const size = state.personSize;
		const cross = size - state.cross;

		context.beginPath();
		context.moveTo(point.x, point.y - size);
		context.lineTo(point.x, point.y + size);
		context.moveTo(point.x - state.cross, point.y - cross);
		context.lineTo(point.x + state.cross, point.y - cross);
		context.stroke();
	}
}

class DrawList
{
	constructor()
	{
		this.drawObjectArray = 
			[
				  new Draw0(), new Draw1(), new Draw2(), new Draw3(), new Draw4()
				  , new Draw5(), new Draw6(), new Draw7(), new Draw8(), new Draw9()
			]
	}
}

class Progression
{
	constructor(at)
	{
		this.at = at;
		this.index = 0;
	}

	draw(context, point) 
	{
		const drawIndex = state.progression[this.index].draw;
		const drawObject = state.drawList.drawObjectArray[drawIndex];
		drawObject.draw(context, point); 
	}

	canProgress()
	{
		return state.progression[this.index].canProgress;
	}

	infectable()
	{
		return state.progression[this.index].infectable;
	}

	infectious()
	{
		return state.progression[this.index].infectious;
	}

	getStyle()
	{
		return state.progression[this.index].style;
	}

	sickness()
	{
		return state.progression[this.index].sick;
	}

	change()
	{
		return state.progression[this.index].change;
	}

	delta()
	{
		return state.progression[this.index].delta;
	}

	transition()
	{
		return state.progression[this.index].time + this.at;
	}

	progress(at)
	{
		this.at = at;
		let progression = state.progression[this.index];

		if (progression.worse.p > Math.random())
		{
			this.index = progression.worse.next;
		}
		else
		{
			this.index = progression.next;
		}
	}

	factor() 
	{		
		const progression = state.progression[this.index];
		let result = 0;

		if (progression.infectious)
		{
			let slope = (progression.end - progression.start) / progression.time;
			result = progression.start + slope * (state.clock - this.at);
		}

		return result;
	}
}
