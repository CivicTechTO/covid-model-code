class InfectState extends State
{
	constructor(config, width, height)
	{
		super(config, width, height);

		this.susceptible = config.susceptible;
		this.infectious = config.infectious;
		this.progression = config.progression;
		this.reset = config.reset;
		this.decay = config.decay;
		this.base = config.base;
		this.logCount = config.logCount;
		this.pScale = config.pScale;
		
		let dayTick = 24 * 60 * 60 / config.realTick;
		this.contrast = config.contrast;
		this.transition = {};
		this.transition.notYet = config.progression.notYet.transition * dayTick;
		this.transition.noSymptoms = this.transition.notYet + config.progression.noSymptoms.transition * dayTick;
		this.transition.peak = this.transition.noSymptoms + config.progression.peak.transition * dayTick;
		this.transition.declining = this.transition.peak + config.progression.declining.transition * dayTick;

		this.run = true;
	}

	makePerson()
	{
		return new InfectablePerson();
	}
	
	fill(config)
	{
		this.personList[0].infect(new ExceedinglyInfectious());
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
