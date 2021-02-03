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

		for (let person of this.personList)
		{
			person.infect(new ExceedinglyInfectious());
			person.progression.index = 6;
		}
	}
}