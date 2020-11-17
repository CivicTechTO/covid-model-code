class Event
{
	constructor(room, time)
	{
		this.room = room;
		this.time = time;

		this.clock = 0;
	}

	step(stepCount)
	{
		let result = false;

		this.clock += stepCount;

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

