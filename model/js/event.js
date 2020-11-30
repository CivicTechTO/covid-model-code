class Event
{
	constructor(room, time)
	{
		this.room = room;
		this.time = time;

		this.clock = 0;
	}

	step()
	{
		let result = false;

		this.clock++;

		if (this.clock >= this.time)
		{
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
	}
}

class Sit extends Event
{
	constructor(room, time)
	{
		super(room, time);
	}

	action()
	{
		let speed = this.room.getSpeed();
		this.room.change(new Rules(speed));
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
		let speed = this.room.getSpeed();
		let args = this.args;
console.log("args", args);
		this.room.change(new RandomRules(speed, args.halfEdge, args.start, args.pause));
	}
}

