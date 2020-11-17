
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
	constructor()
	{
		super();
	}

	startShift()
	{
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
