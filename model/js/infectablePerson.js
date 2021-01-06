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

	expose()
	{
		if (this.exposure > state.infectLevel)
		{
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

