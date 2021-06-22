class InfectablePerson extends Person
{
	constructor()
	{
		super();

		this.at = 0;
		this.progressIndex = 0;
		this.exposure = 0;
		this.loadValue = 0.0;
		this.currentLoad = 0.0;
		this.mask = false;
	}

	canProgress()
	{
		return state.getProgression(this.progressIndex).time !== undefined;
	}

	infectable()
	{
		return this.progressIndex === C.PROGRESS.WELL;
	}

	infectious()
	{
		return state.getProgression(this.progressIndex).start !== 0.0 || state.getProgression(this.progressIndex).end !== 0.0;
	}

	sickness()
	{
		return state.getProgression(this.progressIndex).sick;
	}

	transition()
	{
		return state.getProgression(this.progressIndex).time + this.at;
	}

	progress(at)
	{
		this.at = at;
		let progression = state.getProgression(this.progressIndex);

		if (progression.alt.p > Math.random())
		{
			this.progressIndex = progression.alt.next;
		}
		else
		{
			this.progressIndex = progression.next;
		}

		progression = state.getProgression(this.progressIndex);
		recordIncrement(progression.increment);
		recordDecrement(progression.decrement);
	}

	factor() 
	{		
		const progression = state.getProgression(this.progressIndex);
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

	initLoad()
	{
		this.currentLoad = 0.0;
	}

	expose()
	{
		if (this.infectable())
		{
			const decay = state.activeConfig.infection.decay;
			const increase = this.currentLoad * state.secondsPerTick / 2;
			const cumulative = (this.exposure * (1 - Math.pow(decay, state.secondsPerTick))) / Math.log(state.secondsPerTick);
			this.exposure = increase + cumulative;
			if (this.exposure < state.activeConfig.infection.reset)
			{
				this.exposure = 0.0;
			}
			
			const pRaw = this.exposure / state.activeConfig.infection.pScale;
			let pDamped = 1 - Math.pow(1 - pRaw, 1 / state.activeConfig.infection.damping);
			
			if (this.stats)
			{
				state.addStat(0, pRaw);
				state.addStat(1, pDamped);
			}

			if (state.infecting && Math.random() < pDamped)
			{
				this.infect(pick(state.infectious.pList, state.infectious.valueList));

				if (this.stats)
				{
					setInfectedAt(state.clock);
				}
			}
		}
	}

	infect(loadValue)
	{
		this.loadValue = loadValue;
		this.at = state.clock;
		this.progressIndex = C.PROGRESS.INFECTED;

		recordIncrement(C.RECORD.INFECTED | C.RECORD.INCUBATING);
		recordDecrement(C.RECORD.WELL);
	}

	step()
	{
		super.step();

		if (this.canProgress())
		{
			if (this.transition() <= state.clock)
			{
				this.progress(state.clock);

				if (!state.tuneFlag)
				{
					let progression = state.getProgression(this.progressIndex);
					state.manager.transition(this, progression.increment, progression.decrement);
				}
			}
		}
	}

	goToRoom(toRoom)
	{
		if (!C.FIXEDROOM.includes(this.sickness()) && toRoom.isOpen())
		{
			this.setItinerary(toRoom);
		}
	}

	draw(context)
	{
		if (state.debugDraw)
		{
			const size = state.personSize + 1;
//	result.SICKNESS = {WELL: 0, ASYMPTOMATIC: 1, SICK: 2, HOMESICK: 3, WARDSICK: 4, ICUSICK: 5, DEAD: 6, RECOVERED: 7}
			const colours =["#FF0000", "#00FF00","#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#000000", "#FFFFFF"];
			context.fillStyle = colours[this.sickness()];
			context.fillRect(this.current.x - size, this.current.y - size, size, size);
		}
		else
		{
			const image = state.imageList[state.getProgression(this.progressIndex).display[state.mode].image];
			const scale = this.scale();
			const size = scale * (2 * state.personSize) + 1;
			const offset = scale * state.personSize;

			context.drawImage(image, this.current.x - offset, this.current.y - offset, size, size);
		}
	}

	scale()
	{
		const decay = state.pop.decay;
		const time = decay - (state.clock - this.at);
		const pop = state.getProgression(this.progressIndex).display[state.mode].pop;
		
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


