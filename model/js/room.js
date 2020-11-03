// Base and default rules class

class Rules
{
	constructor(place)
	{
		this.place = place;
	}

	insert(person)
	{
		person.setCurrent(seat(this.place, person, this.place.personSet.size));
		this.place.personSet.add(person);
	}

	arrive(person)
	{
		person.moveTo(seat(this.place, person, this.place.personSet.size));
		transfer(state.travelers, this.place.personSet, person);
	}

	transition()
	{
		let i = 0;
		for (const person of this.place.personSet)
		{
			person.moveTo(seat(this.place, person, i++));
		}
	}

	step()
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
	constructor(place, halfEdge, pause)
	{
		super(place);
		this.halfEdge = halfEdge;
		this.pause = pause;
		this.pauseCount = 0;
	}

	insert(person)
	{
		let x = startRandom(this.place.x + 1, this.place.width - 1);
		let y = startRandom(this.place.y + 1, this.place.height - 1);
		person.setCurrent(new Point(x, y));
		this.place.personSet.add(person);
	}

	arrive(person)
	{
		person.moveTo(findRandom(this.place, person, this.halfEdge));
		transfer(state.travelers, this.place.personSet, person);
	}

	transition()
	{
		let i = 0;
		for (const person of this.place.personSet)
		{
			person.moveTo(findRandom(this.place, person, this.halfEdge));
		}
	}

	step()
	{
		for (const person of this.place.personSet)
		{
			if (person.hasArrived())
			{
				if (this.pauseCount++ > this.pause)
				{
					this.pauseCount = 0;
					person.moveTo(findRandom(this.place, person, this.halfEdge));
				}
			}
		}
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

class Place
{
	constructor(x, y, width, height)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.personSet = new Set();
		this.rules = new Rules(this);
	}

	insert(person)
	{
		this.rules.insert(person);
	}

	arrive(person)
	{
		this.rules.arrive(person);
	}
	
	door()
	{
		let midX = this.x + Math.floor(this.width / 2);
		let midY = this.y + Math.floor(this.height / 2);
		let nearest = state.findFeeder(midX);
		let side = (nearest < midX ? this.x : this.x + this.width);
		return new Point(side, midY);
	}

	step()
	{
		this.rules.step();

		for (const person of this.personSet)
		{
			person.step();
		}
	}

	leaveFor(to)
	{
		for (const person of this.personSet)
		{
			transfer(this.personSet, state.travelers, person);
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
	}
}

class RandomRoom extends Room
{
	constructor(x, y, width, height, halfEdge, pause)
	{
		super(x, y, width, height);
		this.rules = new RandomRules(this, halfEdge, pause);
	}
}