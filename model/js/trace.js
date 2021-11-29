class Trace
{
	constructor()
	{
		this.today = 0;
		this.traceToday = new Set();
		this.testOnlyToday = new Set();
		this.testedToday = new Set();
	}

	initialize()
	{
		if (state.trace.new)
		{
			state.trace.new = false;

			state.trace.traceOnDay = [];
			state.trace.testOnDay = [];

			for (let i = 0 ; i < state.trace.deferred ; i++)
			{
				state.trace.traceOnDay[i] = new Set();
				state.trace.testOnDay[i] = new Set();
			}
		}
	}

	newDay()
	{
		this.today = Math.floor(state.tickToDay(state.clock + 1));

		const index = this.today % state.trace.deferred;

		state.limit = state.getTraceLimit();

		this.traceToday = union(new Set(), state.trace.traceOnDay[index]);  // doing union forces copy
		this.testOnlyToday = union(new Set(), state.trace.testOnDay[index]);  // doing union forces copy

		this.testedToday = new Set();

		state.trace.traceOnDay[index] = new Set();
		state.trace.testOnDay[index] = new Set();
	}

	followup()
	{
		while(this.testOnlyToday.size > 0 && state.limit-- > 0)
		{
			let person = pop(this.testOnlyToday);
			this.test(person);
		}

		while(this.traceToday.size > 0 && state.limit-- > 0)
		{
			let person = pop(this.traceToday);
			this.testAndTrace(person);
		}
	}

	randomTrace(person)
	{
	}

	hospitalTrace(person)
	{
	}

	traceTrace(person)
	{
	}

	trace(action, start, end, person)
	{
		if (!this.testedToday.has(person))
		{
			state.trace.count++;

			this.testedToday.add(person);

			for (let day = Math.max(0, this.today - start) ; day < this.today - end ; day++)
			{
				action.action(day, person.dayContacts(day));
			}
		}
	}

	test(person)
	{
		let result = false;

		if (!person.isTested())
		{
			if (person.test())
			{
				result = true;
				state.trace.found++;
			}
		}

		return result;
	}

	testAndTrace(person)
	{
		if (this.test(person))
		{
			this.traceTrace(person);
		}
	}
}

class NoTrace extends Trace
{
	constructor()
	{
		super();
	}

	newDay()
	{
	}

	randomTrace(person)
	{
	}

	hospitalTrace(person)
	{
	}

	traceTrace(person)
	{
	}

	followup(action)
	{
	}

	trace(action, from, to, person)
	{
	}

	test(person)
	{
	}
}

class Forward extends Trace
{
	constructor()
	{
		super();
	}

	randomTrace(person)
	{
		this.trace(new Recurse(this), state.trace.forward.from, state.trace.forward.to, person);
	}

	hospitalTrace(person)
	{
		this.trace(new Recurse(this), state.trace.forward.from, state.trace.forward.to, person);
	}

	traceTrace(person)
	{
		this.trace(new Recurse(this), state.trace.forward.from, state.trace.forward.to, person);
	}
}

class Backward extends Trace
{
	constructor()
	{
		super();
	}

	randomTrace(person)
	{
		this.trace(new Recurse(this), state.trace.backward.random.from, state.trace.backward.random.to, person);
	}

	hospitalTrace(person)
	{
		this.trace(new Recurse(this), state.trace.backward.hospital.from, state.trace.backward.hospital.to, person);
	}

	traceTrace(person)
	{
		this.trace(new Simple(this), state.trace.backward.trace.from, state.trace.backward.trace.to, person);
	}
}

class Both extends Trace
{
	constructor()
	{
		super();
	}

	randomTrace(person)
	{
		this.trace(new Recurse(this), state.trace.both.random.from, state.trace.both.random.to, person);
	}

	hospitalTrace(person)
	{
		this.trace(new Recurse(this), state.trace.both.hospital.from, state.trace.both.hospital.to, person);
	}

	traceTrace(person)
	{
		this.trace(new Recurse(this), state.trace.both.trace.from, state.trace.both.trace.to, person);
	}
}

class Action
{
	constructor(trace)
	{
		this.trace = trace;
	}

	action(day, contacts)
	{
	}
}

class Simple extends Action
{
	constructor(trace)
	{
		super(trace);
	}

	action(day, contacts)
	{
		if (day <= this.trace.today - state.trace.deferred)
		{
			this.trace.testOnlyToday = union(this.trace.testOnlyToday, contacts);
		}
		else
		{
			const index = day % state.trace.deferred;
			state.trace.testOnDay[index] = union(state.trace.testOnDay[index], contacts);
		}
	}
}

class Recurse extends Action
{
	constructor(trace)
	{
		super(trace);
	}

	action(day, contacts)
	{
		if (day <= this.trace.today - state.trace.deferred)
		{
			this.trace.traceToday = union(this.trace.traceToday, contacts);
		}
		else
		{
			const index = day % state.trace.deferred;
			state.trace.traceOnDay[index] = union(state.trace.traceOnDay[index], contacts);
		}
	}
}


var noTraceTrace = new NoTrace();
var forwardTrace = new Forward();
var backwardTrace = new Backward();
var bothTrace = new Both();
