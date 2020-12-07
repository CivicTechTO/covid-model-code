class State 
{
	constructor(config, width, height)
	{
		this.size = config.size;

		this.stepsPerFrame = config.stepsPerFrame;

		this.personSize = config.personSize;
		
		this.moveSpeed = config.moveSpeed;
		this.leaveSpeed = config.leaveSpeed;
		this.moveVariation = config.moveVariation;
		this.travelSpeed = config.travelSpeed;
		this.travelVariation = config.travelVariation;

		this.main = config.main;
		this.road = config.road;

		this.spacing = config.spacing;

		this.roomList = [];
		
		this.personList = [];

		this.clock = 0;

		this.week = [new Shift()];
		this.shiftLength = config.shiftLength;
		this.shift = 0;


this.debug = false;
	}

	step()
	{
		this.clock++;
		let nextShift = Math.floor(this.clock / this.shiftLength) % this.week.length;

		if (this.shift !== nextShift)
		{
			this.shift = nextShift;
			this.week[nextShift].startShift();
		}

		for (const room of this.roomList)
		{
			room.step();
		}

		for (const person of this.personList)
		{
			person.step();
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

	findRoad(x)
	{
		let space = this.road.space;
		let first = this.road.first;
		let last = this.road.last;
		return Math.min(last * space, Math.max(first * space, space * Math.round(x / space)));
	}

	goHome()
	{
		for (const person of this.personList)
		{
			person.goHome();
		}
	}

	goToWork()
	{
		for (const person of this.personList)
		{
			person.goToWork();
		}
	}

	goToChurch()
	{
		for (const person of this.personList)
		{
			person.goToChurch();
		}
	}
}



