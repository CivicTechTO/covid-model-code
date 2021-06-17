class Event
{
	constructor(room, time)
	{
		this.room = room;
		this.time = time;
		this.notDone = true;

		this.clock = 0;
	}

	step()
	{
		let result = false;

		this.clock++;

		if (this.notDone && this.clock >= this.time)
		{
			this.notDone = false;
			this.action();
			result = true;
		}

		return result;
	}

	action()
	{

	}

	reset()
	{
		this.clock = 0;
		this.notDone = true;
	}
}

class Sit extends Event
{
	constructor(room, time, separation)
	{
		super(room, time);

		this.separation = separation;
	}

	action()
	{
		this.room.change(new ChurchSitRules(this.room, this.separation));
	}
}

class Millabout extends Event
{
	constructor(room, time, args)
	{
		super(room, time);

		this.args = args;
	}

	action()
	{
		let args = this.args;
		this.room.change(new ChurchRandomRules(args.halfEdge));
	}
}

