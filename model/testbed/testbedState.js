class TestbedState extends TownState
{
	constructor(config, width, height)
	{
		config.count = 1;
		super(config, width, height);
	}

	initialize()
	{
		this.stepsPerFrame = 1;

		// this.progression[2].alt.p = 1.0;
		// this.progression[6].alt.p = 1.0;
		// this.progression[9].alt.p = 1.0;
		// this.progression[13].alt.p = 1.0;

		for (let person of this.personList)
		{
			if (person.infectable())
			{
				person.infect(0);
console.log("start", person.progressIndex, this.getProgression(person.progressIndex));
			}
		}
	}
}
