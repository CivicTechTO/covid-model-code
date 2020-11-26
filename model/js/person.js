class Person
{
	constructor()
	{
		this.toRoom = null;
		this.inRoom = null;
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

	moveTo(dest, speed)
	{
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
 *		Go E/W to the nearest feeder road
 *		Go N/S to the main road
 *		Go E/W to the feeder road nearest the dest
 *		Go N/S to the dest y co-ordinate
 *		Go E/W to the dest
 */

	setItinerary(toRoom)
	{
		if (toRoom !== this.toRoom && toRoom !== this.inRoom)
		{
			this.itinerary = [];
			this.index = 0;
			
			let toDoor = toRoom.door();
			let toRoad = state.findRoad(toDoor.x);

			if (this.inRoom)
			{
				this.toRoom = toRoom;
				this.speed = this.inRoom.getSpeed();

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

				this.inRoom.personSet.delete(this);
			}
			else
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
// on the road to the new room
// Not on a road
// 		Find nearest road - go to it
//		Find new room road 
//			If not on it go to main
// on the main road - 
//		go to new room road
// 		go to new room

			}			
		}
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


					if (this.index >= this.itinerary.length)
					{
						this.toRoom.arrive(this);
						this.inRoom = this.toRoom;
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

	goHome()
	{
		this.setItinerary(this.home);
	}

	goToWork()
	{
		this.setItinerary(this.work);
	}

	goToChurch()
	{
		this.setItinerary(this.church);
	}

	draw(context)
	{
		let size = state.personSize;

		context.strokeStyle = 'blue';

		context.beginPath();
		context.moveTo(this.current.x, this.current.y - size);
		context.lineTo(this.current.x, this.current.y + size);
		context.moveTo(this.current.x - size, this.current.y);
		context.lineTo(this.current.x + size, this.current.y);
		context.stroke();
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

