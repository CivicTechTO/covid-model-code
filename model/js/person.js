class Person
{
	constructor()
	{
	}

// newCurrent : Point

	setCurrent(newCurrent)
	{
		this.current = { ...newCurrent};
	}

	moveTo(dest, speed)
	{
		this.speed = speed;
		this.dest = dest;
	}


// final : Room

	travelTo(final, speed)
	{
		this.speed = speed;
		this.final = final;
	}

	step(DeltaT)
	{

	}

	draw(context)
	{
		context.strokeStyle = 'black';
	 	context.strokeRect(this.current.x, this.current.y, 1, 1);
	}
}

function badPoint() 
{
	return new Point(-1, -1);
}

function newFinal(person, state)
{
	previousX = person.final.x;
	previousY = person.final.y;

	person.final = target(state);

	return previousX !== person.final.x || previousY !== person.final.y;
}

function target(state)
{
	let x = state.whichX[state.which];
	let y = state.whichY[state.which];

	return new Point(x, y);
}

function nextDest(person, state)
{
	let main = state.main;
	let feederSpace = state.feederSpace;
	let width = state.size.width;
	let height = state.size.height;

	if (person.current.x == person.final.x && person.current.y == person.final.y)
	{
		if (newFinal(person, state))
		{
			person.outbound = true;
			person.dest = new Point(findFeeder(width, feederSpace, person.current.x), person.current.y)
		}
	}
	else
	{
		if (person.outbound)
		{
			if (person.current.y == main)
			{
				person.outbound = false;
				person.dest.x = findFeeder(width, feederSpace, person.final.x);
			}
			else
			{
				person.dest.y = main;
			}
		}
		else
		{
			if (person.current.y == main)
			{
				person.dest.y = person.final.y;
			}
			else
			{
				if (person.current.x !== person.final.x)
				{
					person.dest.x = person.final.x;				
				}
			}
		}
	}
}

function move(person, stepDelta)
{
	let current = person.current;
	let dest = person.dest;

	if (current.x == dest.x)
	{
		if (current.y == dest.y)
		{
			nextDest(person, state);
		}
		if (current.y < dest.y)
		{
			current.y = Math.min(dest.y, current.y + stepDelta);
		}
		else
		{
			current.y = Math.max(dest.y, current.y - stepDelta);
		}
	}
	else
	{
		if (current.x < dest.x)
		{
			current.x = Math.min(dest.x, current.x + stepDelta);
		}
		else
		{
			current.x = Math.max(dest.x, current.x - stepDelta);
		}
	}
}
