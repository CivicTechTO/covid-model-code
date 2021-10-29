class Trace
{
	trace(person)
	{

	}

	initialize()
	{

	}

	follouup()
	{

	}

	initialize()
	{

	}

	followup()
	{
	}
}

class Forward extends Trace
{
	constructor()
	{
		super();

		this.deferred = C.FORWARD.DEFERRED;
		this.search = C.FORWARD.SEARCH;
		
		this.testOnDay = [];

		for (let i = 0 ; i < this.deferred ; i++)
		{
			this.testOnDay[i] = new Set();
		}
	}

	initialize()
	{
		this.limit = state.getTraceLimit();

		this.today = Math.floor(state.tickToDay(state.clock + 1));
		this.index = this.today % this.deferred;

		this.testOnDay[this.index] = new Set();

		this.tracedToday = new Set();
	}
	
	trace(person)
	{
		if (!this.tracedToday.has(person))
		{
			this.tracedToday.add(person);
			for (let day = this.today - this.search ; day < this.today ; day++)
			{
				const index = day % this.deferred;
				const contacts = person.dayContacts(day);

				this.testOnDay[index] = union(this.testOnDay[index], contacts);
			}
		}
	}

	followup()
	{
		let set = Array.from(this.testOnDay[this.index]);
		set.every(this.test);
	}

	test(person)
	{
		if (!person.isTested())
		{
			if (person.test())
			{
				this.trace(person);
			}

			return --this.limit > 0;
		}
		else
		{
			return true;
		}
	}
}

class Backward extends Trace
{
	constructor()
	{
		super();
	}

	initialize()
	{

	}
	
	trace(person)
	{

	}

	follouup()
	{
		
	}
}
