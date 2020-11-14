// Base and default rules class

class Rules
{
	constructor()
	{
	}

	insert(room, person)
	{
		person.setNewCurrent(seat(room, person, room.personSet.size));
		room.personSet.add(person);
	}

	arrive(room, person)
	{
		person.moveTo(seat(room, person, room.personSet.size));
		room.personSet.add(person);
	}

	transition(room)
	{
		let i = 0;
		for (const person of room.personSet)
		{
			person.moveTo(seat(room, person, i++));
		}
	}

	step(room, stepCount)
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

	insert(room, person)
	{
		let x = startRandom(room.x + 1, room.width - 1);
		let y = startRandom(room.y + 1, room.height - 1);
		person.setCurrent(x, y);
		person.setDest(x,y);
		room.personSet.add(person);
		person.pause = this.newPause();
	}

	arrive(room, person)
	{
		person.moveTo(findRandom(room, person, this.halfEdge));
		person.pause = 0;
		room.personSet.add(person);
	}

	transition(room)
	{
		let i = 0;
		for (const person of room.personSet)
		{
			person.pause = this.newStart();
		}
	}

	step(room, stepCount)
	{
		for (const person of room.personSet)
		{
			if (person.hasArrived())
			{
				person.pause -= stepCount;
				if (0 >= person.pause)
				{
					person.pause = this.newPause();
					person.moveTo(findRandom(room, person, this.halfEdge));
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

function findRandom(room, person, halfEdge) 
{
	let x = randomCoord(room.x + 1, room.width - 1, person.current.x, halfEdge);
	let y = randomCoord(room.y + 1, room.height - 1, person.current.y, halfEdge);
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
	constructor(room, time)
	{
		this.room = room;
		this.time = time;

		this.clock = 0;
	}

	step(stepCount)
	{
		let result = false;

		this.clock += stepCount;

		if (this.clock >= this.time)
		{
			this.action();
			result = true;
		}

		return result;
	}

	action()
	{

	}

	reset()
	{
		this.clock = 0;
	}
}

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
	}

	arrive(person)
	{
		this.rules.arrive(this, person);
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
			this.personSet.delete(person);
			person.setItinerary(this, to);
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

	goToChurch()
	{
		for (const person of this.personSet)
		{
			person.goToChurch(this);
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