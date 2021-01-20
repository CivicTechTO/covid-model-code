class Room
{
	constructor(x, y, width, height, speed)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.personSet = new Set();
		this.rules = new Rules(speed);

		this.eventList = [];
		this.eventIndex = 0;
		this.currentEvent = null;

		this.ventilation = 1;
		this.loud = 40;
		
		this.stats = false;
	}

	equals(other)
	{
		return this.x === other.x && this.y === other.y;
	}

	getSpeed()
	{
		return this.rules.getSpeed();
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
		let result = true;

		if (this.rules.arrive(this, person))
		{
			person.inRoom = this;
			this.personSet.add(person);
		}
		else
		{
			result = false;
		}

		return result;
	}

	depart(person)
	{
		this.rules.depart(this, person)
		this.personSet.delete(person);
	}

	migrate(shift)
	{
		this.rules.migrate(this, shift);
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

	clearEvents()
	{
		this.eventIndex = 0;
		this.eventList = [];
	}

	step()
	{
		this.rules.step(this);

		if (this.currentEvent)
		{
			if (this.currentEvent.step()) 
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

		// for (const person of this.personSet)
		// {
		// 	person.step();
		// }
	}

	leaveFor(to)
	{
		for (const person of this.personSet)
		{
			person.setItinerary(to);
		}

	}

	fillColour()
	{
		return 'lightGray';
	}

	draw(context)
	{
		context.strokeStyle = 'black';
		context.lineWidth = 1;
		context.strokeRect(this.x, this.y, this.width, this.height);	
		context.fillStyle = this.fillColour();
		context.fillRect(this.x, this.y, this.width, this.height);	
	}

	spread()
	{
		let infectious = new Set();
		let susceptible = new Set();

		for (const person of this.personSet)
		{
			if (person.infectable())
			{
				susceptible.add(person);
			}
			else
			{
				if (person.infectious())
				{
					infectious.add(person);
				}
			}
		}

// !!!
// if (infectious.size > 0)
// {
// console.log("spread", infectious.size, susceptible.size);
// }
// this.flag = true;
		for (const source of infectious)
		{
			for (const person of susceptible)
			{
				this.load(source, person);
			}
		}
	}

	load(source, person)
	{ 
		let dx = source.current.x - person.current.x;
		let dy = source.current.y - person.current.y;
		let distance = Math.max(1, dx * dx + dy * dy);

		let increment = (source.load() * this.loud) / (distance * this.ventilation);

		person.exposure += increment;

// !!!
// if (this.flag)
// {
// console.log("load", distance, this.ventilation, increment, person.exposure);
// this.flag = false;
// }
	}
}

class RandomRoom extends Room
{
	constructor(x, y, width, height, speed, halfEdge, start, pause)
	{
		super(x, y, width, height, speed);
		this.rules = new RandomRules(speed, halfEdge, start, pause);
	}
}

class Outside extends Room
{
	constructor(x, y, width, height, speed, start, pause)
	{
		super(x, y, width, height, speed, start, pause);
		this.rules = new TotalRandomRules(speed, start, pause);
	}

	draw(context)
	{
		context.fillStyle = 'lightGreen';
		context.fillRect(this.x, this.y, this.width, this.height);	
	}
}
