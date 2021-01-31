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
			progress.time = dayToTick(progress.time);
		}

		this.cross = config.cross;

		this.reset = config.reset;
		this.decay = config.decay;
		this.base = config.base;
		this.logCount = config.logCount;
		this.pScale = config.pScale;
		
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

	}
}

