class Pool
{
	constructor(size)
	{
		this.size = size;
		this.current = 0;
		this.pool = new Set();
	}

	add(person)
	{
		if (this.current < this.size)
		{
			this.send(person);
			this.current++;
		}
		else
		{
			this.pool.add(person);
			downgrade(person);
		}
	}
	
	nextInPool()
	{
		let first = null;
		let attempt = this.pool.values().next();

		if (!attempt.done)
		{
			first = attempt.value;
			set.delete(first);
		}

		return first;
	}

	depart(person)
	{
		this.current--;

		if ()
	}

	send(person)
	{

	}
}

class WardPool extends Pool
{
	constructor(size)
	{
		super(size);
	}

	send(person)
	{
		person.setItinerary(state.ward);
	}

	downgrade(person)
	{
		person.setItinerary(state.hallway);
	}
}

class ICUPool extends Pool
{
	constructor(size)
	{
		super(size);
	}
}
