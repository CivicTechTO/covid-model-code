class State 
{
	constructor(configuration, width, height)
	{
		this.savedConfig = configuration;
		this.activeConfig = deepCopy(configuration);

		this.size = configuration.size;

		this.background = configuration.background;
		
		this.setSteps(1);
		this.setStepsize(30);

		this.personSize = configuration.personSize;
		
		this.main = configuration.main;
		this.road = configuration.road;
		this.churchRoads = configuration.churchRoads;

		this.spacing = configuration.spacing;

		this.roomList = [];
		
		this.personList = [];

		this.clock = 0;

		this.shift = 0;

		this.debug = false;
		this.tuneFlag = false;

		this.past = null;
	}

	tickToSecond(tick)
	{
		return tick * this.secondsPerTick;
	}

	tickToMinute(tick)
	{
		return Math.floor(tick / ((60 / this.secondsPerTick)));
	}

	tickToHour(tick)
	{
		return Math.floor(tick / (((60 * 60) / this.secondsPerTick)));
	}

	tickToDay(tick)
	{
		return Math.floor(tick / (((24 * 60 * 60) / this.secondsPerTick)));
	}

	secondToTick(second)
	{
		return second / this.secondsPerTick;
	}

	minuteToTick(second)
	{
		return second * 60 / this.secondsPerTick;
	}

	hourToTick(hour) 
	{
		return hour * ((60 * 60) / this.secondsPerTick);
	}

	dayToTick(day) 
	{
		return day * ((24 * 60 * 60) / this.secondsPerTick);
	}

	perSecondToPerTick(speed)
	{
		return speed * this.secondsPerTick;
	}

	scaleTime()
	{
		this.activeConfig.shiftLength = this.hourToTick(this.savedConfig.shiftLength);

		this.activeConfig.moveSpeed = this.perSecondToPerTick(this.savedConfig.moveSpeed);
		this.activeConfig.leaveSpeed = this.perSecondToPerTick(this.savedConfig.leaveSpeed);
		this.activeConfig.deadSpeed = this.perSecondToPerTick(this.savedConfig.deadSpeed);
		this.activeConfig.moveVariation = this.perSecondToPerTick(this.savedConfig.moveVariation);
		this.activeConfig.travelSpeed = this.perSecondToPerTick(this.savedConfig.travelSpeed);
		this.activeConfig.travelVariation = this.perSecondToPerTick(this.savedConfig.travelVariation);

		this.activeConfig.workSpeed = this.perSecondToPerTick(this.savedConfig.workSpeed);

		this.activeConfig.dwelling.start = this.minuteToTick(this.savedConfig.dwelling.start);
		this.activeConfig.dwelling.pause = this.minuteToTick(this.savedConfig.dwelling.pause);
		this.activeConfig.dwelling.speed = this.perSecondToPerTick(this.savedConfig.dwelling.speed);

		this.activeConfig.church.speed = this.perSecondToPerTick(this.savedConfig.church.speed);
		this.activeConfig.church.start = this.minuteToTick(this.savedConfig.church.start);
		this.activeConfig.church.pause = this.minuteToTick(this.savedConfig.church.pause);
		this.activeConfig.church.millingTime = this.minuteToTick(this.savedConfig.church.millingTime);
		this.activeConfig.church.sitTime = this.minuteToTick(this.savedConfig.church.sitTime);

		this.activeConfig.restaurant.speed = this.perSecondToPerTick(this.savedConfig.restaurant.speed);
		this.activeConfig.pub.speed = this.perSecondToPerTick(this.savedConfig.pub.speed);

		this.activeConfig.club.speed = this.perSecondToPerTick(this.savedConfig.club.speed);
		this.activeConfig.club.start = this.minuteToTick(this.savedConfig.club.start);
		this.activeConfig.club.pause = this.minuteToTick(this.savedConfig.club.pause);

		this.activeConfig.outside.speed = this.perSecondToPerTick(this.savedConfig.outside.speed);
		this.activeConfig.outside.start = this.minuteToTick(this.savedConfig.outside.start);
		this.activeConfig.outside.pause = this.minuteToTick(this.savedConfig.outside.pause);
		
		this.activeConfig.hospital.speed = this.perSecondToPerTick(this.savedConfig.hospital.speed);
		this.activeConfig.cemetary.speed = this.perSecondToPerTick(this.savedConfig.cemetary.speed);

		let progression = [];

		for (let input of this.savedConfig.progression)
		{
			let progress = deepCopy(input);

			progression.push(progress);
			
			if (progress.data.time !== undefined)
			{
				progress.data.time = this.hourToTick(progress.data.time);
			}
		}

		this.activeConfig.progression = progression;
	}

	setSteps(steps)
	{
		this.stepsPerFrame = steps;
	}

	setStepsize(stepSize)
	{
		this.secondsPerTick = stepSize;

		this.scaleTime();

		this.progression = this.makeMap(this.activeConfig.progression);

		this.setWeek();
	}

	makeMap(progression)
	{
		let result = new Map();

		for (const row of progression)
		{
			result.set(row.index, row.data)
		}

		return result;
	}

	setWeek()
	{
		this.week = [];

		this.week.push(new Sunday(this.activeConfig.dwelling.start, this.activeConfig.dwelling.pause, this.activeConfig.church));

		this.pushInitial(this.activeConfig.dwelling.start, this.activeConfig.dwelling.pause, this.activeConfig.sundayAfternoon.initial, this.activeConfig.sundayAfternoon.migrate);
		this.pushMigrate(this.activeConfig.sundayEve.migrate);
		this.pushMigrate(this.activeConfig.sundayNight.migrate);
		this.week.push(new Night());
		this.week.push(new Shift());
		
		for (let i = 0 ; i < 4 ; i++)
		{
			this.week.push(new Day(this.activeConfig.dwelling.start, this.activeConfig.dwelling.pause));
			this.week.push(new Shift());
			this.pushInitial(this.activeConfig.dwelling.start, this.activeConfig.dwelling.pause, this.activeConfig.weekdayEve.initial, this.activeConfig.weekdayEve.migrate);
			this.pushMigrate(this.activeConfig.weekdayNight.migrate);
			this.week.push(new Night());
			this.week.push(new Shift());
		}

		this.week.push(new Day(this.activeConfig.dwelling.start, this.activeConfig.dwelling.pause));
		this.week.push(new Shift());
		this.pushInitial(this.activeConfig.dwelling.start, this.activeConfig.dwelling.pause, this.activeConfig.fridayEve.initial, this.activeConfig.fridayEve.migrate);
		this.pushMigrate(this.activeConfig.fridayNight.migrate);
		this.week.push(new Night());
		this.week.push(new Shift());

		this.pushInitial(this.activeConfig.dwelling.start, this.activeConfig.dwelling.pause, this.activeConfig.saturdayMorning.initial, this.activeConfig.saturdayMorning.migrate);
		this.pushMigrate(this.activeConfig.saturdayAfternoon.migrate);
		this.pushMigrate(this.activeConfig.saturdayEve.migrate);
		this.pushMigrate(this.activeConfig.saturdayNight.migrate);
		this.week.push(new Night());
		this.week.push(new Shift());
	}

	pushInitial(start, pause, initialConfig, migrateConfig)
	{
		let chance = migrateConfig.chance;

		this.week.push(new InitialShift(start, pause, initialConfig, migrateConfig));
	}

	pushMigrate(migrateConfig)
	{
		this.week.push(new MigrateShift(migrateConfig));
	}

	fill()
	{

	}
	
	initialize()
	{

	}

	step()
	{
		this.clock++;
		let nextShift = Math.floor(this.clock / this.activeConfig.shiftLength) % this.week.length;

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



