class InfectState extends State
{
	constructor(config, width, height)
	{
		super(config, width, height);

		this.deadSpeed = config.deadSpeed;
		
		this.susceptible = config.susceptible;
		this.infectious = config.infectious;
		
		this.progression = config.progression;

		this.cross = config.cross;

		this.infectConfig = config.infection;

		this.ventilation = config.ventilation;
		this.loudness = config.loudness;

		this.infectRecord = new Record();
		this.deadRecord = new Record();
		this.recordFns = [infectIncrement, infectDecrement, deadIncrement];
		this.update = false;

		this.pop = config.pop;

		this.infecting = true;

		this.mode = 0;

		this.fillImages(config);

		this.run = true;
	}

	fillImages(config)
	{
		this.imageList = [];

		for (const id of config.imageList)
		{
			this.imageList.push(document.getElementById(id));
		}
	}

	makePerson()
	{
		return new InfectablePerson();
	}
	
	initialize()
	{
		this.personList[0].infect(C.INFECTIOUS.EXTREMELY);
		this.personList[0].progressIndex = C.PROGRESS.PEAK;
		this.personList[0].church = this.churchList[0];

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

			// const r = computeR();
			// const r0Element = document.getElementById('r0');
			// r0Element.textContent = r.r0.toFixed(3);

			// const rtElement = document.getElementById('rt');
			// rtElement.textContent = r.rt.toFixed(2);

			this.update = false;
		}

	}
}

