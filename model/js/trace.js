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

	limit()
	{
		return state.getTraceLimit();
	}
}

class Forward extends Trace
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

var noTrace = new Trace();
var forwardTracee = new Forward();
var backwardTrace = new Backward();

