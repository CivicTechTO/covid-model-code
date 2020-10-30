class State 
{
	constructor(config, width, height)
	{
		this.size = config.size;
		this.moveSpeed = config.moveSpeed;
		this.travelSpeed = config.travelSpeed;

		this.main = config.main;
		this.feederSpace = config.feederSpace;

		this.roomList = [];
		
		this.personList = [];

		this.travelers = new Set();
	}

	step(deltaT)
	{
		this.timeFactor = Math.round(deltaT / FRAME);

		for (const room of this.roomList)
		{
			room.step();
		}

		for (const person of this.travelers)
		{
			person.travel();
		}
	}

	draw(context)
	{
		let width = this.size.width;
		let height = this.size.height;

		context.fillStyle = 'LightBlue';
		context.fillRect(0, 0, this.size.width, this.size.height);

		for (const room of this.roomList)
		{
			room.draw(context);
		}

		for (const person of this.personList)
		{
			person.draw(context);
		}
	}


	findFeeder(x)
	{
		let feederSpace = this.feederSpace;
		let last = this.size.width - feederSpace;
		return Math.min(last, Math.max(feederSpace, feederSpace * Math.round(x / feederSpace)));
	}

}

