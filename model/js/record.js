class Record
{
	constructor()
	{
		this.current = 0;
		this.max = 0;
		this.total = 0;
	}

	increment()
	{
		this.current++;
		this.total++;
		if (this.current > this.max)
		{
			this.max++;
		}
	}

	decrement()
	{
		this.current--;
	}
}
