// Base and default rules class

class Rules
{
	constructor()
	{
	}

	insert(room, person)
	{
		person.setNewCurrent(seat(room, person, room.personSet.size));
	}

	arrive(room, person)
	{
		person.moveTo(seat(room, person, room.personSet.size));
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
		person.pause = this.newPause();
	}

	arrive(room, person)
	{
		person.moveTo(findRandom(room, person, this.halfEdge));
		person.pause = 0;
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

