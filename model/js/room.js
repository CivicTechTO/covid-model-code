class Room
{
	constructor(x, y, width, height)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.personSet = new Set();
		this.rules = new Rules();

		this.eventList = [];
		this.eventIndex = 0;
		this.currentEvent = null;
	}

	change(rules)
	{
		this.rules = rules;
		this.rules.transition(this);
	}

	insert(person)
	{
		this.rules.insert(this, person);
		person.inRoom = this;
		this.personSet.add(person);
	}

	arrive(person)
	{
		this.rules.arrive(this, person);
		person.inRoom = this;
		this.personSet.add(person);
	}
	
	door()
	{
		let midX = this.x + Math.floor(this.width / 2);
		let midY = this.y + Math.floor(this.height / 2);
		let nearest = state.findRoad(midX);
		let side = (nearest < midX ? this.x : this.x + this.width);
		return new Point(side, midY);
	}

	addEvent(event)
	{
		if (0 === this.eventList.length)
		{
			this.currentEvent = event;
			event.reset();
		}

		this.eventList.push(event);
	}

	resetEvents()
	{
		if (this.eventList.length > 0)
		{
			this.eventIndex = 0;
			this.currentEvent = this.eventList[0];
			this.currentEvent.reset();
		}
	}

	step(stepCount)
	{
		this.rules.step(this, stepCount);

		if (this.currentEvent)
		{
			if (this.currentEvent.step(stepCount)) 
			{
				this.eventIndex++;

				if (this.eventIndex < this.eventList.length)
				{
					this.currentEvent = this.eventList[this.eventIndex];
					this.currentEvent.reset();
				}
				else
				{
					this.currentEvent = null;
				}
			}
		}

		for (const person of this.personSet)
		{
			person.step(stepCount);
		}
	}

	leaveFor(to)
	{
		for (const person of this.personSet)
		{
			person.setItinerary(to);
		}

	}

	draw(context)
	{
		context.strokeStyle = 'black';
		context.lineWidth = 1;
		context.strokeRect(this.x, this.y, this.width, this.height);	
		context.fillStyle = 'lightGray';
		context.fillRect(this.x, this.y, this.width, this.height);	
	}
}

class Outside extends Room
{
	constructor(x, y, width, height)
	{
		super(x, y, width, height);
	}

	draw(context)
	{
		context.fillStyle = 'lightGreen';
		context.fillRect(this.x, this.y, this.width, this.height);	
	}
}

class RandomRoom extends Room
{
	constructor(x, y, width, height, halfEdge, start, pause)
	{
		super(x, y, width, height);
		this.rules = new RandomRules(halfEdge, start, pause);
	}
}