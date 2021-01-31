class InfectablePerson extends Person
{
	constructor()
	{
		super();

		this.infected = new Infection();
		this.progression = new Progression();

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

	sickness()
	{
		return this.progression.sickness();
	}

	isSick()
	{
		const sickness = this.progression.sickness();
		return sickness === C.HOMESICK || sickness === C.WARDSICK || sickness === C.ICUSICK || sickness === C.DEAD;
	}

	isDead()
	{
		return this.progression.sickness() === C.DEAD;
	}

	inHospital()
	{
		let result = false;

		if (this.inRoom)
		{
			result = this.inRoom.equals(state.hallway) || this.inRoom.equals(state.ward) || this.inRoom.equals(state.icu); 
		}

		return result;
	}

	inICU()
	{
		let result = false;

		if (this.inRoom)
		{
			result = this.inRoom.equal(state.icu); 
		}

		return result;
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
		if (this.progression.infectable())
		{
			let p = 1 - Math.pow(1 - this.compress(), state.pScale);
			
			if (this.stats)
			{
				state.addStat(1,p);
			}

			if (Math.random() < p)
			{
				if (this.stats)
				{
					setInfectedAt(state.clock);
				}
				this.infect(makeInfectious());
			}
		}
	}

	infect(infectious)
	{
		this.infected = infectious;
		this.progression.progress(state.clock);
	}

	step()
	{
		super.step();

		if (this.progression.canProgress())
		{
			if (this.progression.transition() <= state.clock)
			{
				this.progression.progress(state.clock);

				if (this.progression.change())
				{
					this.doChange();
				}
			}
		}
	}

	doChange()
	{
		switch(this.sickness())
		{
		case C.WELL:
			if (this.inHospital())
			{
				this.goHome();
			}
			break;

		case C.INFECTED:
			break;

		case C.HOMESICK:
			this.goHome();
			break;

		case C.WARDSICK:
			if (!this.inHospital())
			{
				if (!state.ward.isFull())
				{
					this.goToRoom(state.ward);
				}
				else
				{
					this.goToRoom(state.hallway);
				}
			}
			else
			{
				if (this.inICU())
				{
					if (!state.ward.isFull())
					{
						this.goToRoom(state.ward);
					}
					else
					{
						this.goToRoom(state.hallway);
					}
				}
			}
			break;

		case C.ICUSICK:
			if (!state.icu.isFull())
			{
				this.goToRoom(state.icu);
			}
			else
			{
				if (!state.ward.isFull())
				{
					this.goToRoom(state.ward);
				}
				else
				{
					this.goToRoom(state.hallway);
				}
			}
			break;

		case C.DEAD:
			this.goToRoom(state.cemetary);
			break;
		}
	}

	draw(context)
	{
		context.strokeStyle = this.progression.getStyle();

		if (!this.isDead())
		{
			this.infected.draw(context, this.current);
		}
		this.progression.draw(context, this.current);
	}
}

