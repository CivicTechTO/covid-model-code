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
		this.isolateAt = false;
		this.isolation = false;
		this.positiveAt = false;
		this.testedAt = false;
	}
	
	isolate()
	{
		if (!this.isIsolating())
		{
			this.isolateAt = state.clock;

			recordIncrement(C.RECORD.ISOLATED);

			if (this.home.residents > 1)
			{
				this.sendToIsolation();
			}
			else
			{
				this.setItinerary(this.home);
				recordIncrement(C.RECORD.ISOLATIONHOME);
			}
		}
	}

	sendToIsolation()
	{
		const isolation = state.findIsolation();

		if (isolation)
		{
			this.setItinerary(isolation);
			this.isolation = isolation;

			recordIncrement(C.RECORD.ISOLATIONROOM);
		}
		else
		{
			this.setItinerary(this.home);
			recordIncrement(C.RECORD.ISOLATIONOVERFLOW);
		}
	}

	isolationTransition()
	{
		this.isolateAt = false;
		recordDecrement(C.RECORD.ISOLATED);

		if (this.isolation)
		{
			this.isolation = false;
			recordDecrement(C.RECORD.ISOLATIONROOM);
		}
		else
		{
			if (this.home.residents > 1)
			{
				recordDecrement(C.RECORD.ISOLATIONOVERFLOW);
			}
			else
			{
				recordDecrement(C.RECORD.ISOLATIONHOME);
			}
		}
	}

	evaluateIsolate()
	{
		if (this.isIsolating())
		{
			if (this.isolateAt + state.activeConfig.longEnough.isolation < state.clock)
			{
				if (this.isolation)
				{
					this.setItinerary(this.home);
				}

				this.isolationTransition();
			}
		}
	}

	isIsolating()
	{
		return this.isolateAt != false;
	}

	test()
	{
		let result = false;

		if (!this.testedAt)
		{
			if (state.testThis())
			{
				this.setTested();

				if (C.TESTSPOSITIVE.includes(this.sickness()))
				{
					result = true;

					this.setPositive();

					if (state.isolateTestThis(this))
					{
						this.isolate();
					}

					state.getTrace().trace(this);
				}
			}
		}

		return result;
	}
	
	setPositive()
	{
		if (!this.isPositive())
		{
			this.positiveAt = state.clock;
			recordIncrement(C.RECORD.POSITIVE);
		}
	}

	setTested()
	{
		if (!this.isTested())
		{
			this.testedAt = state.clock;
			recordIncrement(C.RECORD.TESTS);
		}
	}

	evaluateTested()
	{
		if (this.isTested())
		{
			if (this.testedAt + state.activeConfig.longEnough.test < state.clock)
			{
				this.testedAt = false;
				recordDecrement(C.RECORD.TESTS);
			}
		}
	}

	isTested()
	{
		return this.testedAt != false;
	}

	evaluatePositive()
	{
		if (this.isPositive())
		{
			if (this.positiveAt + state.activeConfig.longEnough.positive < state.clock)
			{
				this.positiveAt = false;
				recordDecrement(C.RECORD.POSITIVE);
			}
		}
	}

	isPositive()
	{
		return this.positiveAt != false;
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
			const increase = this.currentLoad * state.secondsPerStep / 2;
			const cumulative = (this.exposure * (1 - Math.pow(decay, state.secondsPerStep))) / Math.log(state.secondsPerStep);
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

				if (this.inRoom)
				{
					this.inRoom.infected++;
				}

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

	checkSpeed()
	{
		if (this.sickness() === C.SICKNESS.DEAD)
		{
			this.speed = state.activeConfig.deadSpeed;
		}
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
					state.score += adjustDamage(progression.score);
				}
			}
		}
	}

	goToRoom(toRoom)
	{
		if (!(this.isIsolating() || C.FIXEDROOM.includes(this.sickness())))
		{
			if (this.sickness() === C.SICKNESS.HOMESICK)
			{
				this.setItinerary(this.home);
			}
			else
			{
				if (toRoom.isOpen())
				{
					this.setItinerary(toRoom);
				}
				else
				{
					this.setItinerary(this.home);					
				}
			}
		}
	}

	draw(context)
	{
		if (state.debugDraw)
		{
			const size = state.personSize + 1;
//	result.SICKNESS = {WELL: 0, INCUBATING: 1, ASYMPTOMATIC: 2, SICK: 3, HOMESICK: 4, WARDSICK: 5, ICUSICK: 6, DEAD: 7, RECOVERED: 8}
			const colours =["#FF0000", "#00FF00","#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#000000", "#FFFFFF", "#888888"];
			context.fillStyle = colours[this.sickness()];
			context.fillRect(this.current.x - size, this.current.y - size, size, size);

			if (state.countDraw)
			{

			}
			
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
			return state.pop.scale * Math.log2(1 + (time / decay));
		}
		else
		{
			return 1;
		}
	}	
}


