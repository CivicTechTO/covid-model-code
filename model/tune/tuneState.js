class TuneState extends InfectState
{
	constructor(configuration, width, height)
	{
		super(configuration, width, height);

		this.susceptible = this.activeConfig.susceptible;
		this.infectious = this.activeConfig.infectious;

		this.reset = this.activeConfig.reset;
		this.decay = this.activeConfig.decay;
		this.base = this.activeConfig.base;
		this.logCount = this.activeConfig.logCount;
		this.pScale = this.activeConfig.pScale;
		
		this.distance = 1;

		this.ventilation = this.activeConfig.ventilation;
		this.loudness = this.activeConfig.loudness;

		this.tune = {ventilation: 1, loud: 40}

		this.run = false;

		this.infecting = true;

		this.tuneFlag = true;
	}

	makePerson()
	{
		return new InfectablePerson();
	}
	
	fill()
	{
		this.setDays(this.activeConfig);

		this.level = exceedingly();

		let room = new Room(400, 50, 100, 100, 1);
		room.fillColour = "gray";
		this.roomList.push(room);

		this.start();
	}

	start()
	{
		this.clock = 0;

		let vertical = 100;
		let base = 20;

		let infected = this.makePerson();
		infected.stats = false;
		infected.infect(this.level.value);

		let other = this.makePerson();
		other.stats = true;

		infected.setNewCurrent(new Point(400 + base, vertical));
		other.setNewCurrent(new Point(400 + base + this.distance, vertical));

		this.personList = [];

		this.personList.push(infected);
		this.personList.push(other);

		let room = this.roomList[0];
		room.loud = state.tune.loud;
		room.ventilation = state.tune.ventilation;

		room.personSet = new Set();

		room.insert(infected);
		room.insert(other);

		this.startStats();
	}

	startStats()
	{
		this.stats = {};
		this.stats.increment = [];
		this.stats.factor = [];
		this.stats.exposure =[];
		this.stats.numbered = [[], []];
	}

	addStat(which, value)
	{
		this.stats.numbered[which].push(value);
	}

	addIncrement(value)
	{
		this.stats.increment.push(value);
	}

	stepStats()
	{
		this.stats.factor.push(this.personList[0].factor());
		this.stats.exposure.push(this.personList[1].exposure);
	}

	drawStats(factorContext, incrementContext, otherContext, exposeContext, pContext)
	{
		this.display('loadvalue', this.personList[0].loadValue);
		this.display('progress', this.personList[0].progressIndex);		

		this.drawAStat(factorContext, this.stats.factor, 'maxfactor');
		this.drawAStat(incrementContext, this.stats.increment, 'maxincrement');
		this.drawAStat(otherContext, this.stats.exposure, 'maxother');
		this.drawAStat(exposeContext, this.stats.numbered[0], 'maxexpose');
		this.drawAStat(pContext, this.stats.numbered[1], 'maxp');
	}

	drawAStat(context, valueList, elementName)
	{
		let max = this.plot(context, valueList);
		this.display(elementName, max);
	}

	display(elementName, value)
	{
		const element = document.getElementById(elementName);
		element.textContent = value.toFixed(10);
	}

	plot(context, valueList)
	{
		const size = 200;
		let max = 0;

		context.fillStyle = "lightblue";
		context.fillRect(0, 0, size, size);

		if (valueList.length > 0)
		{
			max = valueList.reduce(function(a, b) {return Math.max(a, b);});


			if (max > 0)
			{
				context.beginPath();

				context.strokeStyle = "red";
				context.moveTo(0, size);

				const dx = size / valueList.length;
				const dy = size / max;

				let x = 0;
				for (const value of valueList)
				{
					context.lineTo(x, size - dy * value);
					x += dx;
				}

				context.stroke();
			}

		}

		return max;
	}

	setDays(config)
	{
		this.days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		this.currentDay = 0;
		this.startHour = config.startHour;
		this.currentHour = config.startHour;
		this.currentMinute = 0;
	}

	updateTime()
	{
		let nextDay = Math.floor((Math.floor(this.tickToHour(this.clock)) + this.startHour) / 24);

		if (nextDay !== this.currentDay)
		{
			this.currentDay = nextDay;

			const dayElement = document.getElementById('day');
			dayElement.textContent = (nextDay + 1).toString();

			const nameElement = document.getElementById('name');
			nameElement.textContent = this.days[nextDay % 7];
		}

		let hour = (Math.floor(this.tickToHour(this.clock)) + this.startHour) % 24;
		if (hour !== this.currentHour)
		{
			this.currentHour = hour;

			const hourElement = document.getElementById('hour');
			hourElement.textContent = hour.toString();
		}

		let minute = Math.floor(this.tickToMinute(this.clock)) % 60;
		if (minute !== this.currentMinute)
		{
			this.currentMinute = minute;

			const minuteElement = document.getElementById('minutes');
			minuteElement.textContent = minute.toString().padStart(2, '0');
		}

		if (this.oldSteps !== this.stepsPerFrame)
		{
			this.oldSteps = this.stepsPerFrame;

			const stepElement = document.getElementById('steps');
			stepElement.textContent = this.stepsPerFrame.toString();
		}
	}

	step()
	{
		super.step();

		this.updateTime();
	
		for (const person of this.personList)
		{
			person.initLoad();
		}

		for (const room of this.roomList)
		{
			room.spread();
		}	

		for (const person of this.personList)
		{
			if (person.infectable())
			{
				person.expose();				
			}
		}

		this.stepStats();
	}
}

