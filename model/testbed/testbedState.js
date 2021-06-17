class TestbedState extends TownState
{
	constructor(configuration, width, height)
	{
		configuration.count = 10;
		super(configuration, width, height);
	}

	initialize()
	{
		this.setSteps(1);

		// this.progression[2].alt.p = 1.0;
		// this.progression[6].alt.p = 1.0;
		// this.progression[9].alt.p = 1.0;
		// this.progression[13].alt.p = 1.0;

		for (let person of this.personList)
		{
			if (person.infectable())
			{
				person.infect(0);
			}
		}
	}
}
