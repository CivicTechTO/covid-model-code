class InfectablePerson extends Person
{
	constructor()
	{
		super();

		this.at = 0;
		this.progressIndex = 0;
		this.exposure = 0;
		this.loadValue = 0.0;
	}

	canProgress()
	{
		return state.progression[this.progressIndex].time !== undefined;
	}

	infectable()
	{
		return this.progressIndex === C.PROGRESS.WELL;
	}

	infectious()
	{
		return state.progression[this.progressIndex].start !== 0.0 || state.progression[this.progressIndex].end !== 0.0;
	}

	sickness()
	{
		return state.progression[this.progressIndex].sick;
	}

	change()
	{
		return state.progression[this.progressIndex].delta >= 0;
	}

	delta()
	{
		return state.progression[this.progressIndex].delta;
	}

	transition()
	{
		return state.progression[this.progressIndex].time + this.at;
	}

	progress(at)
	{
		this.at = at;
		let progression = state.progression[this.progressIndex];

		if (progression.alt.p > Math.random())
		{
			this.progressIndex = progression.alt.next;
		}
		else
		{
			this.progressIndex = progression.next;
		}

		progression = state.progression[this.progressIndex];
		increment(progression.increment);
		decrement(progression.decrement);
		state.update = progression.increment !== 0 || progression.decrement !== 0;
	}

	factor() 
	{		
		const progression = state.progression[this.progressIndex];
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
		return sickness === C.SICKNESS.HOMESICK || sickness === C.SICKNESS.WARDSICK 
			|| sickness === C.SICKNESS.ICUSICK || sickness === C.SICKNESS.DEAD;
	}

	isDead()
	{
		return this.sickness() === C.SICKNESS.DEAD;
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

	infect(loadValue)
	{
		this.loadValue = loadValue;
		this.at = state.clock;
		this.progressIndex = C.PROGRESS.INFECTED;

		increment(C.RECORD.INFECTED | C.RECORD.INCUBATING);
		decrement(C.RECORD.WELL);

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

				if (!state.statFlag && this.change())
				{
					let toRoom = this.findRoom();

					if (!toRoom.equals(this.inRoom))
					{
						this.goToRoom(toRoom);
					}
				}
			}
		}
	}

	findRoom()
	{
		const rooms = [this.home, this.home, this.home, state.hallway, state.ward, state.icu, state.cemetary, this.home];

		return rooms[this.sickness()];
	}

	draw(context)
	{
		const image = state.imageList[state.progression[this.progressIndex].display[state.mode].image];
		const scale = this.scale();
		const size = scale * (2 * state.personSize) + 1;
		const offset = scale * state.personSize;

		context.drawImage(image, this.current.x - offset, this.current.y - offset, size, size);
	}

	scale()
	{
		const decay = state.pop.decay;
		const time = decay - (state.clock - this.at);
		const pop = state.progression[this.progressIndex].display[state.mode].pop;
		
		if (pop && time > 1)
		{
			return Math.round(state.pop.scale * Math.log2(1 + (time / decay)));
		}
		else
		{
			return 1;
		}
	}	
}


