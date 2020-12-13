
class Shift
{
	constructor(){}

	startShift(){}

	move()
	{
		return 0;
	}

	whereList()
	{
		return [];
	}

	migrate(personList)
	{

	}
}

class Night extends Shift
{
	constructor()
	{
		super();
	}

	startShift()
	{
		state.goHome();
	}
}

class Day extends Shift
{
	constructor()
	{
		super();
	}

	startShift()
	{
		state.goToWork();
	}
} 

class Sunday extends Shift
{
	constructor(churchSpec)
	{
		super();
		this.churchSpec = churchSpec;
	}

	startShift()
	{
		let speed = this.churchSpec.speed;
		let halfEdge = this.churchSpec.halfEdge;
		let start = this.churchSpec.start;
		let pause = this.churchSpec.pause;

		for (const church of state.churchList)
		{
			church.clearEvents();
			church.change(new RandomRules(speed, halfEdge, start, pause));
			church.addEvent(new Sit(church, this.churchSpec.millingTime));
			church.addEvent(new Millabout(church, this.churchSpec.sitTime, this.churchSpec));
		}

		state.goToChurch();
	}
} 

class MigrateShift extends Shift
{
	constructor(chance, migrateHome, migrateChoices)
	{
		super();
		
		this.chance = chance;
		this.migrateHome = migrateHome;
		this.migrateChoices = migrateChoices;
	}

	migrate(personList)
	{
		if (this.chance > Math.random())
		{
			for (const person of personList)
			{
				if (this.migrateHome > Math.random())
				{
					person.goHome();
				}
				else
				{
					person.setItinerary(chooseOne(chooseOne(this.migrateChoices)));
				}
			}
		}
	}
}

class InitialShift extends MigrateShift
{
	constructor(chance, migrateHome, migrateChoices, initialHome, initialChoices)
	{
		super(chance, migrateHome, migrateChoices);
		this.initialHome = initialHome;
		this.initialChoices = initialChoices;
	}

	startShift()
	{
		for (const person of state.personList)
		{
			if (this.initialHome > Math.random())
			{
				person.goHome();
			}
			else
			{
				person.setItinerary(chooseOne(chooseOne(this.initialChoices)));
			}
		}
	}
}
