class State 
{
	constructor(config, width, height)
	{
		this.size = config.size;

		this.background = config.background;
		
		this.stepsPerFrame = config.stepsPerFrame;
		this.realTick = config.realTick;		// Thisshould be early

		this.scaleTime(config);

		this.personSize = config.personSize;
		
		this.moveSpeed = config.moveSpeed;
		this.leaveSpeed = config.leaveSpeed;
		this.moveVariation = config.moveVariation;
		this.travelSpeed = config.travelSpeed;
		this.travelVariation = config.travelVariation;

		this.main = config.main;
		this.road = config.road;
		this.churchRoads = config.churchRoads;

		this.spacing = config.spacing;

		this.roomList = [];
		
		this.personList = [];

		this.clock = 0;

		this.week = [new Shift()];
		this.shiftLength = config.shiftLength;
		this.shift = 0;

		this.debug = false;
		this.tuneFlag = false;
	}

	tickToSecond(tick)
	{
		return tick * this.realTick;
	}

	tickToMinute(tick)
	{
		return Math.floor(tick / ((60 / this.realTick)));
	}

	tickToHour(tick)
	{
		return Math.floor(tick / (((60 * 60) / this.realTick)));
	}

	tickToDay(tick)
	{
		return Math.floor(tick / (((24 * 60 * 60) / this.realTick)));
	}

	secondToTick(second)
	{
		return second / this.realTick;
	}

	minuteToTick(second)
	{
		return second * 60 / this.realTick;
	}

	hourToTick(hour) 
	{
		return hour * ((60 * 60) / this.realTick);
	}

	dayToTick(day) 
	{
		return day * ((24 * 60 * 60) / this.realTick);
	}

	perSecondToPerTick(speed)
	{
		return speed * this.realTick;
	}

	scaleTime(config)
	{
		config.shiftLength = this.hourToTick(config.shiftLength);

		config.moveSpeed = this.perSecondToPerTick(config.moveSpeed);
		config.leaveSpeed = this.perSecondToPerTick(config.leaveSpeed);
		config.deadSpeed = this.perSecondToPerTick(config.deadSpeed);
		config.moveVariation = this.perSecondToPerTick(config.moveVariation);
		config.travelSpeed = this.perSecondToPerTick(config.travelSpeed);
		config.travelVariation = this.perSecondToPerTick(config.travelVariation);

		config.workSpeed = this.perSecondToPerTick(config.workSpeed);

		config.dwelling.start = this.minuteToTick(config.dwelling.start);
		config.dwelling.pause = this.minuteToTick(config.dwelling.pause);
		config.dwelling.speed = this.perSecondToPerTick(config.dwelling.speed);

		config.church.speed = this.perSecondToPerTick(config.church.speed);
		config.church.start = this.minuteToTick(config.church.start);
		config.church.pause = this.minuteToTick(config.church.pause);
		config.church.millingTime = this.minuteToTick(config.church.millingTime);
		config.church.sitTime = this.minuteToTick(config.church.sitTime);

		config.restaurant.speed = this.perSecondToPerTick(config.restaurant.speed);
		config.pub.speed = this.perSecondToPerTick(config.pub.speed);
		config.club.speed = this.perSecondToPerTick(config.club.speed);

		config.outside.speed = this.perSecondToPerTick(config.outside.speed);
		config.outside.start = this.minuteToTick(config.outside.start);
		config.outside.pause = this.minuteToTick(config.outside.pause);
		
		config.hospital.speed = this.perSecondToPerTick(config.hospital.speed);
		config.cemetary.speed = this.perSecondToPerTick(config.cemetary.speed);

		for (let progress of config.progression)
		{
			if (progress.time !== undefined)
			{
				progress.time = this.hourToTick(progress.time);

			}
		}
	}

	fill(config)
	{

	}
	
	initialize()
	{

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
			room.migrate(this.week[this.shift]);
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
		// let width = this.size.width;
		// let height = this.size.height;

		context.fillStyle = this.background;
		context.fillRect(0, 0, this.size.width, this.size.height);

		for (const room of this.roomList)
		{
			room.draw(context);
		}

		const startX = this.road.space * this.road.first;
		const endX = this.road.space * this.road.last;

		context.strokeStyle = this.road.style;
		context.lineWidth = this.road.width;

		context.beginPath();
		context.moveTo(startX, this.main);
		context.lineTo(endX, this.main);

		for (var i = this.road.first; i <= this.road.last; i++) 
		{
			const x = i * this.road.space;

			if (this.churchRoads.includes(i))
			{
				context.moveTo(x, this.main);

			}
			else
			{
				context.moveTo(x, 0);
			}

			context.lineTo(x, this.size.height);
		}

		context.stroke();

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
			if (!person.isSick())
			{
				person.goHome();
			}
		}
	}

	goToWork()
	{
		for (const person of this.personList)
		{
			if (!person.isSick())
			{
				person.goToWork();
			}
		}
	}

	goToChurch()
	{
		for (const person of this.personList)
		{
			if (!person.isSick())
			{
				person.goToChurch();
			}
		}
	}
}



