class TestbedState extends TownState
{
	constructor(config, width, height)
	{
		config.count = 10;
		super(config, width, height);
	}

	fill(config)
	{
		super.fill(config);

		this.stepsPerFrame = 1;

		for (let person of this.personList)
		{
			if (person.infectable())
			{
				person.infect(new ExceedinglyInfectious());
			}
			person.progression.index = 9;
			person.goToRoom(person.findRoom());
		}
	}
}
