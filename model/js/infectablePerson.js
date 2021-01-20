class InfectablePerson extends Person
{
	constructor()
	{
		super();

		this.infected = new Infection();
		this.progression = new Progression(-1);

		this.exposure = 0;
	}

	infectable()
	{
		return this.progression.infectable();
	}

	infectious()
	{
		return this.progression.infectious();
	}

	load()
	{
		return this.infected.load * this.progression.factor();
	}

	decay()
	{
		this.exposure = (this.exposure > state.reset ? this.exposure * state.decay : 0.0);
	}

	compress()
	{
		let result = Math.log1p(this.exposure) / Math.log(state.base);
		
		for (var i = 0; i < state.logCount; i++) 
		{
			
			result = Math.log1p(result) / Math.log(2);
		}

		if (this.stats)
		{
			state.addStat(0, result);
		}

		return result;
	}

	expose()
	{
		let p = 1 - Math.pow(1 - this.compress(), state.pScale);
		
		if (this.stats)
		{
			state.addStat(1,p);
		}

		if (Math.random() < p)
		{
			setInfectedAt(state.clock);
			this.infect(makeInfectious());
		}
	}

	infect(infectious)
	{
		this.infected = infectious;
		this.progression = new NotYet(state.clock);
	}

	step()
	{
		if (this.progression.canProgress())
		{
			if (this.progression.transition() <= state.clock)
			{
				this.progression = this.progression.progress();
			}
		}

		super.step();
	}


	draw(context)
	{
		this.infected.draw(context, this.current);
		this.progression.draw(context, this.current);
	}
}

