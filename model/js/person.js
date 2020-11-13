class Person
{
	constructor()
	{
		this.toRoom = null;
		this.current = null;
		this.dest = null;
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

	moveTo(dest)
	{
		this.dest = dest;
		this.to = null;
		this.speed = state.moveSpeed + rand(state.moveVariation);
	}

	hasArrived()
	{
		return ((this.current && this.dest) ? this.current.equals(this.dest) : false);
	}


	setItinerary(fromRoom, toRoom)
	{
		this.toRoom = toRoom;
		this.speed = state.moveSpeed + rand(state.moveVariation);

		this.itinerary = [];

		let dest = fromRoom.door();
		this.dest = dest;

		let fromRoad = state.findRoad(dest.x);
		this.itinerary.push(new Point(fromRoad, dest.y));

		let toDoor = toRoom.door();
		let toRoad = state.findRoad(toDoor.x);
		if (toRoad !== fromRoad)
		{
			this.itinerary.push(new Point(fromRoad, state.main));
			this.itinerary.push(new Point(toRoad, state.main));
		}

		this.itinerary.push(new Point(toRoad, toDoor.y))
		this.itinerary.push(new Point(toDoor.x, toDoor.y))

		this.index = 0;

		fromRoom.personSet.delete(this);
	}

	step(stepCount)
	{
		if (this.current && this.dest)
		{
			if (!this.current.equals(this.dest))
			{
				let delta = stepCount * this.speed;
				this.current.x = closer(this.dest.x, this.current.x, delta);
				this.current.y = closer(this.dest.y, this.current.y, delta);
			}
			else
			{
				if (this.toRoom)		// We are travelling and we are at an intermediate dest
				{
					if (0 === this.index)		//  Leaving door
					{
						this.speed = 1 + rand(state.travelSpeed);
					}
					else
					{
						if (1 === this.index)
						{
							this.speed = state.travelSpeed + rand(state.travelVariation);
						}
					}


					if (this.index >= this.itinerary.length)
					{
						this.toRoom.arrive(this);
						this.toRoom = null;
					}
					else
					{
						this.dest = this.itinerary[this.index++];
					}
				}
			}
		}
	}

	goHome(from)
	{
		this.setItinerary(from, this.home);
	}

	goToWork(from)
	{
		this.setItinerary(from, this.work);
	}

	draw(context)
	{
		context.strokeStyle = 'black';
	 	context.strokeRect(this.current.x, this.current.y, 1, 1);
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

