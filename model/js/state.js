class State 
{
	constructor(config, width, height)
	{
		this.size = config.size;
		this.moveSpeed = config.moveSpeed;
		this.moveVariation = config.moveVariation;
		this.travelSpeed = config.travelSpeed;
		this.travelVariation = config.travelVariation;

		this.main = config.main;
		this.feederSpace = config.feederSpace;

		this.spacing = config.spacing;

		this.roomList = [];
		
		this.personList = [];

		this.week = [night, day];
		this.shift = 0;
	}

	step(stepCount)
	{
		for (const room of this.roomList)
		{
			room.step(stepCount);
		}

		for (const person of this.personList)
		{
			person.step(stepCount);
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

	goHome()
	{
		for (room of this.roomList)
		{
			room.goHome();
		}
	}

	goToWork()
	{
		for (room of this.roomList)
		{
			room.goToWork();
		}
	}
}


function night() 
{
	state.goHome();
}

function day() 
{
	state.goToWork();
}



