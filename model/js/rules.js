// Base and default rules class

class Rules
{
	constructor()
	{
	}

	getSpeed()
	{
		throw "Undefined speed";
	}
	
	insert(room, person)
	{
	}

	arrive(room, person)
	{
		return true;
	}

	depart(room, person)
	{

	}

	leave(room, person)
	{

	}
	
	transition(room)
	{
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

	isFull()
	{
		return false;
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

class SeatRules extends Rules
{
	insert(room, person)
	{
		person.setNewCurrent(seat(room, person, room.personSet.size));
	}

	arrive(room, person)
	{
		person.moveTo(seat(room, person, room.personSet.size), this.getSpeed());
		return true;
	}

	transition(room)
	{
		let i = 0;
		for (const person of room.personSet)
		{
			person.moveTo(seat(room, person, i++), this.getSpeed());
		}
	}
}

class RandomRulesBase extends Rules
{
	insert(room, person)
	{
		let x = getRandom(room.x + 1, room.width - 1);
		let y = getRandom(room.y + 1, room.height - 1);
		person.setCurrent(x, y);
		person.setDest(x,y);
		person.pause = this.newPause();
	}

	getPause()
	{
		throw "Undefined pause";
	}

	getStart()
	{
		throw "Undefined start";
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
		return 1 + rand(this.getPause());
	}

	newStart()
	{
		return 1 + rand(this.getStart());
	}
}

class RandomRules extends RandomRulesBase
{
	constructor(halfEdge)
	{
		super();
		this.halfEdge = halfEdge;
	}

	arrive(room, person)
	{
		person.moveTo(this.findRandom(room, person, this.halfEdge), this.getSpeed());
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
					person.moveTo(this.findRandom(room, person, this.halfEdge), this.getSpeed());
				}
			}
		}
	}

	findRandom(room, person, halfEdge) 
	{
		let buffer = state.personSize;
		let x = centredRandom(room.x + buffer, room.width - buffer, person.current.x, halfEdge);
		let y = centredRandom(room.y + buffer, room.height - buffer, person.current.y, halfEdge);
		return new Point(x, y)
	}
}

class TotalRandomRules extends RandomRulesBase
{
	arrive(room, person)
	{
		person.moveTo(findRandom(room), this.getSpeed());
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
					person.moveTo(findRandom(room), this.getSpeed());
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
	let buffer = state.personSize + 1;
	let x = getRandom(room.x + buffer, room.width - 2 * buffer);
	let y = getRandom(room.y + buffer, room.height - 2 * buffer);

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
	constructor(otherList)
	{
		super();
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

			person.goToRoom(other);
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

class ChurchSitRules extends Rules
{
	constructor(room, separation)
	{
		super();

		this.pewList = [];

		let spacing = state.spacing;
		let pewSpace = 2 * spacing + separation;
		let across =  Math.floor(room.width / (2 * (spacing + 1)));
		let width = across * spacing;
		let down = Math.floor(room.height / spacing);

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

	arrive(room, person)
	{
		return this.pewList[1].add(person);
;
	}

	getSpeed()
	{
		return state.activeConfig.church.speed;
	}
}

class ChurchRandomRules extends RandomRules
{
	constructor(halfEdge)
	{
		super(halfEdge);
	}

	getSpeed()
	{
		return state.activeConfig.church.speed;
	}

	getStart()
	{
		return state.activeConfig.church.start;
	}

	getPause()
	{
		return state.activeConfig.church.pause;
	}
}

class RestaurantRules extends FullRules
{
	constructor(otherList, room, separation)
	{
		super(otherList);
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

	getSpeed()
	{
		return state.activeConfig.restaurant.speed;
	}
}

class PubRules extends FullRules
{
	constructor(otherList, room)
	{
		super(otherList);
		let spacing = state.spacing;
		let down = Math.floor(room.height / (spacing + 2));

		for (var i = 0 ; i < down ; i++)
		{
			this.tableList.push(new Group(room, Math.floor(spacing / 2) - 1, i * spacing, 1, 1))
			this.tableList.push(new Group(room, (spacing * 2) - 1, i * spacing, 1, 1))
		}
	}

	getSpeed()
	{
		return state.activeConfig.pub.speed;
	}
}

class ClubRules extends RandomRules
{
	constructor(halfEdge)
	{
		super(halfEdge);
	}

	getSpeed()
	{
		return state.activeConfig.club.speed;
	}

	getStart()
	{
		return state.activeConfig.club.start;
	}

	getPause()
	{
		return state.activeConfig.club.pause;
	}
}

class HospitalRules extends SeatRules
{
	depart(room, person)
	{
		super.depart(room, person);

		this.transition(room);
	}

	getSpeed()
	{
		return state.activeConfig.hospital.speed;
	}
}

class HallwayRules extends HospitalRules
{
	arrive(room, person)
	{
		let result = super.arrive(room, person);

		recordIncrement(C.RECORD.HALLWAY);

		return result;
	}

	leave(room, person)
	{
		super.leave(room, person);
		recordDecrement(C.RECORD.HALLWAY);
	}
}

class WorkRules extends Rules
{
	constructor(chance, room, crowd)
	{
		super();
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
					person.andBack(findRandom(room), this.getSpeed());
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

	getSpeed()
	{
		return state.activeConfig.workSpeed;
	}
}

class OutsideRules extends TotalRandomRules
{
	getSpeed()
	{
		return state.activeConfig.outside.speed;
	}

	getStart()
	{
		return state.activeConfig.outside.start;
	}

	getPause()
	{
		return state.activeConfig.outside.pause;
	}
}

class NightDwellingRules extends SeatRules
{
	getSpeed()
	{
		return state.activeConfig.dwelling.speed;
	}
}

class DayDwellingRules extends TotalRandomRules
{
	getSpeed()
	{
		return state.activeConfig.dwelling.speed;
	}

	getStart()
	{
		return state.activeConfig.dwelling.start;
	}

	getPause()
	{
		return state.activeConfig.dwelling.pause;
	}
}

class CemetaryRules extends SeatRules
{
	getSpeed()
	{
		return state.activeConfig.cemetary.speed;
	}
}

