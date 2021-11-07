class NoTrace
{
	constructor()
	{
	}

	initialize()
	{
	}


	followup()
	{
	}

	trace(person)
	{
	}
}

class Trace extends NoTrace
{
	constructor(start, end)
	{
		super();

		this.start = start;
		this.end = end;
	}

	initialize()
	{
		this.limit = state.getTraceLimit();
		this.tracedToday = new Set();

		this.today = Math.floor(state.tickToDay(state.clock + 1));
		this.index = this.today % this.deferred;
	}

	followup()
	{
	}

	trace(person)
	{
console.log("trace");
		if (!this.tracedToday.has(person))
		{
			state.tracedCount++;

			this.tracedToday.add(person);
			for (let day = this.today - this.start ; day < this.today - this.end ; day++)
			{
				const contacts = person.dayContacts(day);

				this.action(day, contacts);
			}
		}
	}

	action(day, contacts)
	{

	}

	test(person)
	{
		if (!person.isTested())
		{
			if (person.test())
			{
				state.getTrace().trace(person);

				state.found++;
			}

			return --(state.getTrace().limit) > 0;
		}
		else
		{
			return true;
		}
	}
}

class Forward extends Trace
{
	constructor()
	{
		super(C.FORWARD.SEARCH.FROM, C.FORWARD.SEARCH.TO);

		this.deferred = C.FORWARD.DEFERRED;
		
		this.testOnDay = [];

		for (let i = 0 ; i < this.deferred ; i++)
		{
			this.testOnDay[i] = new Set();
		}
	}

	action(day, contacts)
	{
		const index = day % this.deferred;
console.log("action before", contacts.size, this.testOnDay[index].size);
		this.testOnDay[index] = union(this.testOnDay[index], contacts);
console.log("action after ", contacts.size, this.testOnDay[index].size);
	}

	initialize()
	{
		super.initialize();
	}
	
	followup()
	{
		let contacts = Array.from(this.testOnDay[this.index]);

console.log("followup", contacts.length);
		contacts.every(person => this.test(person));

		this.testOnDay[this.index] = new Set();
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
