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

