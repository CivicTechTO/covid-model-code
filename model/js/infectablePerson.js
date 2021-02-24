class InfectablePerson extends Person
{
	constructor()
	{
		super();

		this.at = 0;
		this.index = 0;
		this.exposure = 0;
	}

	canProgress()
	{
		return state.progression[this.index].time !== undefined;
	}

	infectable()
	{
		return state.progression[this.index].sick === state.C.PROGRESS.WELL;
	}

	infectious()
	{
		return state.progression[this.index].start !== 0.0 || state.progression[this.index].end !== 0.0;
	}

	sickness()
	{
		return state.progression[this.index].sick;
	}

	change()
	{
		return state.progression[this.index].delta >= 0;
	}

	delta()
	{
		return state.progression[this.index].delta;
	}

	transition()
	{
		return state.progression[this.index].time + this.at;
	}

	progress(at)
	{
		this.at = at;
		let progression = state.progression[this.index];

		if (progression.worse.p > Math.random())
		{
			this.index = progression.worse.next;
		}
		else
		{
			this.index = progression.next;
		}
	}

	factor() 
	{		
		const progression = state.progression[this.index];
		const slope = (progression.end - progression.start) / progression.time;
		return progression.start + slope * (state.clock - this.at);
	}

	load()
	{
		return this.loadValue * this.factor();
	}

	isSick()
	{
		const sickness = this.sickness();
		return sickness === C.HOMESICK || sickness === C.WARDSICK || sickness === C.ICUSICK || sickness === C.DEAD;
	}

	isDead()
	{
		return this.sickness() === C.DEAD;
	}

	inHospital()
	{
		return this.inHallway() || this.inWard() || this.inICU();
	}

	inICU()
	{
		return this.inRoom && this.inRoom.equals(state.icu); 
	}

	inWard()
	{
		return this.inRoom && this.inRoom.equals(state.ward); 
	}

	inHallway()
	{
		return this.inRoom && this.inRoom.equals(state.hallway); 
	}

	decay()
	{
		this.exposure = (this.exposure > state.infectConfig.reset ? this.exposure * state.infectConfig.decay : 0.0);
	}

	compress(maximum, log)
	{
		let result;

		if (log)
		{
			result = Math.log(this.exposure) / Math.log(maximum);
		}
		else
		{
			result = this.exposure / maximum;
		}
		
		if (this.stats)
		{
			state.addStat(0, result);
		}

		return result;
	}

	expose()
	{
		if (this.infectable())
		{
			const maximum = state.infectConfig.maximum;
			const choices = state.infectConfig.params;
			const config = choices[state.infectConfig.which];
			let p = 1 - Math.pow(1 - this.compress(maximum, config.log), config.pScale);
			
			if (this.stats)
			{
				state.addStat(1, p);
			}

			if (state.infecting && Math.random() < p)
			{
				if (this.stats)
				{
					setInfectedAt(state.clock);
				}

				this.infect(pick(state.infectious.pList, state.infectious.valueList));
			}
		}
	}

	infect(infectious)
	{
		this.infected = infectious;
		this.progress(state.clock);
		infectIncrement();
		state.update = true;
	}

	step()
	{
		super.step();

		if (this.canProgress())
		{
			if (this.transition() <= state.clock)
			{
				this.progress(state.clock);

				if (!state.statFlag && this.progression.change())
				{
					let toRoom = this.findRoom();

					if (!toRoom.equals(this.inRoom))
					{
						this.goToRoom(toRoom);
					}
				}

				if (this.delta() >= 0)
				{
					state.recordFns[this.delta()]();
					state.update = true;
				}
			}
		}
	}

	findRoom()
	{
		const rooms = [this.home, this.home, this.home, state.hallway, state.ward, state.icu, state.cemetary];

		return rooms[this.sickness()];
	}

	draw(context)
	{
		context.strokeStyle = this.progression.getStyle();
		context.lineWidth = 1;

		this.progression.draw(context, this.current);
	}
}

