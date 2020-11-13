// Base and default rules class

class Rules
{
	constructor()
	{
	}

	insert(place, person)
	{
		person.setNewCurrent(seat(place, person, place.personSet.size));
		place.personSet.add(person);
	}

	arrive(place, person)
	{
		person.moveTo(seat(place, person, place.personSet.size));
		place.personSet.add(person);
	}

	transition(place)
	{
		let i = 0;
		for (const person of place.personSet)
		{
			person.moveTo(seat(place, person, i++));
		}
	}

	step(place, stepCount)
	{

	}
}

function seat(room, person, which)
{
	let spacing = state.spacing
	let columnCount = Math.floor((room.width - spacing) / spacing);
	let x = room.x + spacing + spacing * (which % columnCount);
	let y = room.y + spacing + spacing * Math.floor(which / columnCount);

	return new Point(x,y);
}

class RandomRules extends Rules
{
	constructor(halfEdge, start, pause)
	{
		super();
		this.halfEdge = halfEdge;
		this.pause = pause;
		this.start = start;
	}

	insert(place, person)
	{
		let x = startRandom(place.x + 1, place.width - 1);
		let y = startRandom(place.y + 1, place.height - 1);
		person.setCurrent(x, y);
		person.setDest(x,y);
		place.personSet.add(person);
		person.pause = this.newPause();
	}

	arrive(place, person)
	{
		person.moveTo(findRandom(place, person, this.halfEdge));
		person.pause = 0;
		place.personSet.add(person);
	}

	transition(place)
	{
		let i = 0;
		for (const person of place.personSet)
		{
			person.pause = this.newStart();
		}
	}

	step(place, stepCount)
	{
		for (const person of place.personSet)
		{
			if (person.hasArrived())
			{
				person.pause -= stepCount;
				if (0 >= person.pause)
				{
					person.pause = this.newPause();
					person.moveTo(findRandom(place, person, this.halfEdge));
				}
			}
		}
	}

	newPause()
	{
		return 1 + rand(this.pause);
	}

	newStart()
	{
		return 1 + rand(this.start);
	}
}

function startRandom(lower, limit) 
{
	return lower + rand(limit);
}

function findRandom(place, person, halfEdge) 
{
	let x = randomCoord(place.x + 1, place.width - 1, person.current.x, halfEdge);
	let y = randomCoord(place.y + 1, place.height - 1, person.current.y, halfEdge);
	return new Point(x, y)
}

function randomCoord(lower, limit, current, halfEdge) 
{
	let mid = clamp(lower + halfEdge, lower + (limit - halfEdge), current);
	let delta = rand(2 * halfEdge + 1) - halfEdge;
	return mid + delta;
}

class Event
{
	constructor(time)
	{
		this.clock = 0;
		this.time = time;
	}

	step(stepCount)
	{
		this.clock += stepCount;
		return this.clock >= this.time;
	}

	reset()
	{
		this.clock = 0;
	}
}

class Place
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
	}

	arrive(person)
	{
		this.rules.arrive(this, person);
	}
	
	door()
	{
		let midX = this.x + Math.floor(this.width / 2);
		let midY = this.y + Math.floor(this.height / 2);
		let nearest = state.findFeeder(midX);
		let side = (nearest < midX ? this.x : this.x + this.width);
		return new Point(side, midY);
	}

	addEvent(event)
	{
		if (0 === this.eventList.length)
		{
			currentEvent = event;
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
			this.personSet.delete(person);
			person.setItinerary(this, to);
		}

	}
}

class Room extends Place
{
	constructor(x, y, width, height)
	{
		super(x, y, width, height);
	}

	draw(context)
	{
		context.strokeStyle = 'black';
		context.lineWidth = 1;
		context.strokeRect(this.x, this.y, this.width, this.height);	
		context.fillStyle = 'lightGray';
		context.fillRect(this.x, this.y, this.width, this.height);	
	}

	goHome()
	{
		for (const person of this.personSet)
		{
			person.goHome(this);
		}
	}

	goToWork()
	{
		for (const person of this.personSet)
		{
			person.goToWork(this);
		}
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