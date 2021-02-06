class Person 
{
	constructor()
	{
		this.toRoom = null;
		this.inRoom = null;
		this.current = null;
		this.dest = null;
		this.back = null;
		this.group = null;
		this.home = null;
		this.work = null;
		this.church = null;
	}

// newCurrent : Point

	setCurrent(x, y)
	{
		this.current = new Point(x, y);
	}

	setNewCurrent(newCurrent)
	{
		this.current = newCurrent;
	}

	setDest(x, y)
	{
		this.dest = new Point(x, y);
	}

	moveTo(dest, speed)
	{
		this.dest = dest;
		this.to = null;
		this.speed = speed;
	}

	andBack(dest, speed)
	{
		this.back = new Point(this.current.x, this.current.y);
		this.dest = dest;
		this.to = null;
		this.speed = speed;
	}

	hasArrived()
	{
		return ((this.current && this.dest) ? this.current.equals(this.dest) : false);
	}


/*
 *	There is one main E/W road partway up the model
 *  There are a set of equally spaced N/S feeder roads
 *  Path finding is
 *		If in a room, go to the door
 *		Go E/W to the nearest feeder road
 *		Go N/S to the main road
 *		Go E/W to the feeder road nearest the dest
 *		Go N/S to the dest y co-ordinate
 *		Go E/W to the dest
 */

	goToRoom(toRoom)
	{
		this.itinerary = [];
		this.index = 0;
		
		let toDoor = toRoom.door();
		let toRoad = state.findRoad(toDoor.x);

		if (this.inRoom)
		{
			this.fromRoom(toRoom, toDoor, toRoad);
		}
		else
		{
			this.notFromRoom(toRoom, toDoor, toRoad);
		}
	}

	fromRoom(toRoom, toDoor, toRoad)
	{
		this.toRoom = toRoom;
		this.speed = state.leaveSpeed;

		let dest = this.inRoom.door();
		this.dest = dest;

		let fromRoad = state.findRoad(dest.x);
		this.itinerary.push(new Point(fromRoad, dest.y));

		if (toRoad !== fromRoad)
		{
			this.itinerary.push(new Point(fromRoad, state.main));
			this.itinerary.push(new Point(toRoad, state.main));
		}

		this.itinerary.push(new Point(toRoad, toDoor.y));
		this.itinerary.push(new Point(toDoor.x, toDoor.y));

		this.inRoom.depart(this);
	}

	notFromRoom(toRoom, toDoor, toRoad)
	{
		this.toRoom = toRoom;
		let fromRoad = state.findRoad(this.current.x);
		this.speed = state.travelSpeed + rand(state.travelVariation);

		if (this.current.x !== fromRoad && this.current.y !== state.main)
		{
			this.itinerary.push(new Point(fromRoad, this.current.y));	// must be new room
		}

		if (fromRoad !== toRoad)
		{
			if (this.current.y !== state.main)
			{
				this.itinerary.push(new Point(fromRoad, state.main));
			}
				
			this.itinerary.push(new Point(toRoad, state.main));
		}
		else
		{
			if (this.current.y === state.main)
			{
				this.itinerary.push(new Point(toRoad, state.main));
			}
		}

		this.itinerary.push(new Point(toRoad, toDoor.y));
		this.itinerary.push(new Point(toDoor.x, toDoor.y));

		this.dest = this.itinerary[0];
	}

	step()
	{
		if (this.current && this.dest)
		{
			if (!this.current.equals(this.dest))
			{
				if (this.sickness() === C.DEAD)
				{
					this.speed = state.deadSpeed;
				}
				
				this.current.x = closer(this.dest.x, this.current.x, this.speed);
				this.current.y = closer(this.dest.y, this.current.y, this.speed);
			}
			else
			{
				if (this.back)
				{
					this.dest = this.back;
					this.back = null;
				}
				else
				{
					if (this.toRoom)		// We are travelling and we are at an intermediate dest
					{
						this.travel();
					}
				}
			}
		}
	}

	travel()
	{
		if (0 === this.index)		//  Leaving door
		{
			this.inRoom = null;
			this.speed = 1 + rand(state.travelSpeed);
		}
		else
		{
			if (1 === this.index)
			{
				this.speed = state.travelSpeed + rand(state.travelVariation);
			}
		}

		if (this.index >= this.itinerary.length)		// Last entry is toRoom.door
		{
			if (this.toRoom.arrive(this))
			{
				this.inRoom = this.toRoom;
				this.toRoom = null;
			}
		}
		else
		{
			this.dest = this.itinerary[this.index++];
		}
	}

	goHome()
	{
		this.goToRoom(this.home);
	}

	goToWork()
	{
		this.goToRoom(this.work);
	}

	goToChurch()
	{
		this.goToRoom(this.church);
	}

debug(message)
{
	if (this.debugFlag)
	{
		console.log("person", message);
	}
}
}

function closer(dest, current, delta)
{
	if (current < dest)
	{
		return Math.min(dest, current + delta);
	}
	else
	{
		return Math.max(dest, current - delta);
	}
}

