// Base and default rules class

class Rules
{
	constructor(speed)
	{
		this.speed = speed;
	}

	getSpeed()
	{
		return this.speed;
	}
	
	insert(room, person)
	{
		person.setNewCurrent(seat(room, person, room.personSet.size));
	}

	arrive(room, person)
	{
		person.moveTo(seat(room, person, room.personSet.size), this.speed);
		return true;
	}

	depart(room, person)
	{

	}

	transition(room)
	{
		let i = 0;
		for (const person of room.personSet)
		{
			person.moveTo(seat(room, person, i++), this.speed);
		}
	}

	step(room)
	{

	}

	migrate(room, shift)
	{
		for (const person of room.personSet)
		{
			shift.migrate([person]);
		}
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

class RandomRulesBase extends Rules
{
	constructor(speed, start, pause)
	{
		super(speed);
		this.pause = pause;
		this.start = start;
	}

	insert(room, person)
	{
		let x = getRandom(room.x + 1, room.width - 1);
		let y = getRandom(room.y + 1, room.height - 1);
		person.setCurrent(x, y);
		person.setDest(x,y);
		person.pause = this.newPause();
	}

	transition(room)
	{
		let i = 0;
		for (const person of room.personSet)
		{
			person.pause = this.newStart();
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

class RandomRules extends RandomRulesBase
{
	constructor(speed, halfEdge, start, pause)
	{
		super(speed, start, pause);
		this.halfEdge = halfEdge;
	}

	arrive(room, person)
	{
		person.moveTo(this.findRandom(room, person, this.halfEdge), this.speed);
		person.pause = 0;
		return true;
	}

	step(room)
	{
		for (const person of room.personSet)
		{
			if (person.hasArrived())
			{
				person.pause--;
				if (0 >= person.pause)
				{
					person.pause = this.newPause();
					person.moveTo(this.findRandom(room, person, this.halfEdge), this.speed);
				}
			}
		}
	}

	findRandom(room, person, halfEdge) 
	{
		let x = centredRandom(room.x + 1, room.width - 1, person.current.x, halfEdge);
		let y = centredRandom(room.y + 1, room.height - 1, person.current.y, halfEdge);
		return new Point(x, y)
	}
}

class TotalRandomRules extends RandomRulesBase
{
	constructor(speed, start, pause)
	{
		super(speed, start, pause);
	}

	arrive(room, person)
	{
		person.moveTo(findRandom(room), this.speed);
		person.pause = 0;

		return true;
	}

	step(room)
	{
		for (const person of room.personSet)
		{
			if (person.hasArrived())
			{
				person.pause--;
				if (0 >= person.pause)
				{
					person.pause = this.newPause();
					person.moveTo(findRandom(room), this.speed);
				}
			}
		}
	}

}

function getRandom(lower, limit) 
{
	return lower + rand(limit);
}

function findRandom(room)
{
	let x = getRandom(room.x, room.width);
	let y = getRandom(room.y, room.height);

	return new Point(x, y);
}

function centredRandom(lower, limit, current, halfEdge) 
{
	let mid = clamp(lower + halfEdge, lower + (limit - halfEdge), current);
	let delta = rand(2 * halfEdge + 1) - halfEdge;
	return mid + delta;
}

class FullRules extends Rules
{
	constructor(speed, otherList)
	{
		super(speed);
		this.tableList = [];
		this.otherList = otherList;
	}

	arrive(room, person)
	{
		let full = true;
		let other = null;
		let result = true;

		for (const table of this.tableList)
		{
			if (table.add(person))
			{
				full = false;
				break;
			}
		}

		if (full)
		{
			result = false;

			do
			{
				other = chooseOne(this.otherList);
			}
			while (other.equals(room));

			person.setItinerary(other);
		}

		return result;
	}

	depart(room, person)
	{
		for (const table of this.tableList)
		{
			table.delete(person);
		}
	}
}

class ChurchRules extends Rules
{
	constructor(speed, room, separation)
	{
		super(speed);

		this.pewList = [];

		let spacing = state.spacing;
		let pewSpace = 2 * spacing + separation;
		let across =  Math.floor(room.width / (2 * (spacing + 1)));
		let width = across * spacing;
		let down = Math.floor(room.height / (spacing + 2));

		this.pewList.push(new Group(room, spacing, pewSpace, across, down))
		this.pewList.push(new Group(room, 2 * spacing + width, pewSpace, across, down))
	}

	transition(room)
	{
		let i = 0;
		for (const person of room.personSet)
		{
			this.pewList[i++ % 2].add(person);
		}
	}
}

class RestaurantRules extends FullRules
{
	constructor(speed, otherList, room, separation)
	{
		super(speed, otherList);
		let spacing = state.spacing;
		let tableSpace = 2 * spacing + separation;
		let across = Math.floor(room.width / (spacing + 2));
		let down = Math.floor(room.height / (tableSpace + 2));

		for (var i = 0 ; i < down ; i++)
		{
			this.tableList.push(new Group(room, spacing / 2, i * tableSpace, across, 2))
		}
	}

	migrate(room, shift)
	{
		for (const table of this.tableList)
		{
			shift.migrate(table.personSet);
		}
	}
}

class PubRules extends FullRules
{
	constructor(speed, otherList, room)
	{
		super(speed, otherList);
		let spacing = state.spacing;
		let down = Math.floor(room.height / (spacing + 2));

		for (var i = 0 ; i < down ; i++)
		{
			this.tableList.push(new Group(room, spacing / 2, i * spacing, 1, 1))
			this.tableList.push(new Group(room, spacing * 2, i * spacing, 1, 1))
		}
	}

}

class WorkRules extends Rules
{
	constructor(speed, chance, room, crowd)
	{
		super(speed);
		this.chance = chance;
		this.tableList = [];
		
		let spacing = state.spacing;
		let across =  Math.floor(room.width / (2 * (spacing + 1)));
		let width = across * spacing;
		let down = Math.floor(room.height / (spacing + 2));

		for (var i = 1 ; i <= down ; i++)
		{
			this.tableList.push(new Group(room, spacing, i * spacing, across, 1))
			this.tableList.push(new Group(room, 2 * spacing + width, i * spacing, across, 1))
		}
	}

	arrive(room, person)
	{
		let result = true;

		for (const table of this.tableList)
		{
			if (table.add(person))
			{
				break;
			}
		}

		return true;
	}

	step(room)
	{
		for (const person of room.personSet)
		{
			if (person.hasArrived())
			{
				if (Math.random() < this.chance)
				{
					person.andBack(findRandom(room), room.getSpeed());
				}
			}
		}
	}

	depart(room, person)
	{
		for (const table of this.tableList)
		{
			table.delete(person);
		}
	}
}
