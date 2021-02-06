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
		const rooms = [this.home, this.home, this.home, state.hallway, state.ward, state.icu, state.cemetary];

		let index = this.sickness();

console.log("before", index, JSON.stringify(rooms[index].isFull), rooms[index].isFull());
		while(rooms[index].isFull())
		{
			index--;
		}

console.log("after", index);
		return rooms[index];
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

