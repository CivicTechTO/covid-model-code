
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
		for(const dwelling of state.dwellingList)
		{
			dwelling.change(new SeatRules(dwelling.getSpeed()));
		}

		state.goHome();
	}
}

class Daytime extends Shift
{
	constructor(start, pause)
	{
		super();
		this.start = start;
		this.pause = pause;
	}

	startShift()
	{
		for (const dwelling of state.dwellingList)
		{
			dwelling.change(new TotalRandomRules(dwelling.getSpeed(), this.start, this.pause));
		}
	}
}

class Day extends Daytime
{
	constructor(start, pause)
	{
		super(start, pause);
	}

	startShift()
	{
		super.startShift();

		state.goToWork();
	}
} 

class Sunday extends Daytime
{
	constructor(start, pause, churchSpec)
	{
		super(start, pause);
		this.churchSpec = churchSpec;
	}

	startShift()
	{
		super.startShift();

		let speed = this.churchSpec.speed;
		let halfEdge = this.churchSpec.halfEdge;
		let start = this.churchSpec.start;
		let pause = this.churchSpec.pause;

		for (const church of state.churchList)
		{
			church.clearEvents();
			church.change(new RandomRules(speed, halfEdge, start, pause));
			church.addEvent(new Sit(church, this.churchSpec.millingTime, this.churchSpec.separation));
			church.addEvent(new Millabout(church, this.churchSpec.sitTime, this.churchSpec));
		}

		state.goToChurch();
	}
} 

class MigrateShift extends Shift
{
	constructor(config)
	{
		super();
		this.migrateConfig = {... config};
	}

	startShift()
	{
		this.migrateConfig.choices = makeChoices(state.choiceList(), this.migrateConfig.other);
	}

	migrate(personList)
	{
		this.move(this.migrateConfig, personList);
	}

	move(which, personList)
	{
		if (which.chance > Math.random())
		{
			for (const person of personList)
			{
				if (which.home > Math.random())
				{
					person.goHome();
				}
				else
				{
					person.setItinerary(chooseOne(chooseOne(which.choices)));
				}
			}
		}
	}
}

class InitialShift extends MigrateShift
{
	constructor(start, pause, initialConfig, migrateConfig)
	{
		super(migrateConfig);
		this.start = start;
		this.pause = pause;
		this.initial = {... initialConfig};
		this.initial.chance = 1;
	}

	startShift()
	{
		this.createParties(this.initial);

		super.startShift();

		this.initial.choices = makeChoices(state.choiceList(), this.initial.other);

		for (const person of state.notHosts)
		{
			this.move(this.initial, [person]);
		}

		for (const dwelling of state.dwellingList)
		{
			dwelling.change(new TotalRandomRules(dwelling.getSpeed(), this.start, this.pause));
		}
	}

	createParties(which)
	{
		state.hosts = new Set();
		state.notHosts = new Set();
		state.partyList = [];

		for (const person of state.personList)
		{
			if (which.hostChance > Math.random())
			{
				state.hosts.add(person);
				state.partyList.push(person.home);
				person.goHome();
			}
			else
			{
				state.notHosts.add(person);
			}
		}
	}
}
