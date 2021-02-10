class InfectState extends State
{
	constructor(config, width, height)
	{
		super(config, width, height);

		this.deadSpeed = config.deadSpeed;
		
		this.susceptible = config.susceptible;
		this.infectious = config.infectious;
		
		this.progression = config.progression;
		for (let progress of this.progression)
		{
			progress.time = hourToTick(progress.time);
		}

		this.cross = config.cross;

		this.reset = config.reset;
		this.decay = config.decay;
		this.base = config.base;
		this.logCount = config.logCount;
		this.pScale = config.pScale;

		this.ventilation = config.ventilation;
		this.loudness = config.loudness;

		this.infectRecord = new Record();
		this.deadRecord = new Record();
		this.recordFns = [infectIncrement, infectDecrement, deadIncrement];
		this.update = false;

		this.drawList = new DrawList();

		this.run = true;
	}

	makePerson()
	{
		return new InfectablePerson();
	}
	
	fill(config)
	{
		this.personList[0].infect(new ExceedinglyInfectious());
		this.personList[0].progression.index = 3;
		this.personList[0].church = this.churchList[0];

		infectIncrement();
		this.update = true;
	}

	step()
	{
		super.step();

		for (const person of this.personList)
		{
			person.decay();
		}

		for (const room of this.roomList)
		{
			room.spread();
		}	

		for (const person of this.personList)
		{
			person.expose();
		}

		this.drawRecord();
	}

	drawRecord()
	{
		if (this.update)
		{
			const currentElement = document.getElementById('currentInfected');
			currentElement.textContent = this.infectRecord.current.toString();

			const maxElement = document.getElementById('maxInfected');
			maxElement.textContent = this.infectRecord.max.toString();

			const totalElement = document.getElementById('totalInfected');
			totalElement.textContent = this.infectRecord.total.toString();

			const deadElement = document.getElementById('dead');
			deadElement.textContent = this.deadRecord.current.toString();

			const rElement = document.getElementById('r');
			rElement.textContent = computeR().toString();

			this.update = false;
		}

	}
}

