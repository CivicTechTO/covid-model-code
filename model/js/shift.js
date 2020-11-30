
class Shift
{
	constructor(){}

	startShift(){}
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

class OtherShift extends Shift
{
	constructor(home, other)
	{
		super();
		
		this.home = home;
		this.other = other;
	}

	startShift()
	{
		for (const person of state.personList)
		{
			if (this.home > Math.random())
			{
				person.goHome();
			}
			else
			{
				person.setItinerary(chooseOne(chooseOne(this.other)));
			}
		}
	}
}
