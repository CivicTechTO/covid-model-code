class Person
{
	constructor()
	{
		this.toRoom = null;
		this.current = null;
		this.dest = null;
	}

// newCurrent : Point

	setCurrent(newCurrent)
	{
		this.current = new Point(newCurrent.x, newCurrent.y);
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

		let fromFeeder = state.findFeeder(dest.x);
		this.itinerary.push(new Point(fromFeeder, dest.y));

		let toDoor = toRoom.door();
		let toFeeder = state.findFeeder(toDoor.x);
		if (toFeeder !== fromFeeder)
		{
			this.itinerary.push(new Point(fromFeeder, state.main));
			this.itinerary.push(new Point(toFeeder, state.main));
		}

		this.itinerary.push(new Point(toFeeder, toDoor.y))
		this.itinerary.push(new Point(toDoor.x, toDoor.y))

		this.index = 0;
	}

	step()
	{
		this.moveStep();
		this.decisionStep();
	}

	travel()
	{
		this.moveStep();
	}

	decisionStep()
	{

	}
	
	moveStep()
	{
		if (this.current && this.dest)
		{
			if (!this.current.equals(this.dest))
			{
				let delta = Math.round(state.timeFactor * this.speed);
				this.current.x = closer(this.dest.x, this.current.x, delta);
				this.current.y = closer(this.dest.y, this.current.y, delta);
			}
			else
			{
				if (this.toRoom)		// We are travelling and we are at an intermediate dest
				{
					if (0 === this.index)		//  Leaving door
					{
						this.speed = 1 + rand(state.travelSpeed + state.travelVariation);
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

