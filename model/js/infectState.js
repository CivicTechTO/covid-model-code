class InfectState extends State
{
	constructor(config, width, height)
	{
		super(config, width, height);

		this.deadSpeed = config.deadSpeed;
		
		this.susceptible = config.susceptible;
		this.infectious = config.infectious;
		
		this.progression = config.progression;

		this.cross = config.cross;

		this.infectConfig = config.infection;

		this.ventilation = config.ventilation;
		this.loudness = config.loudness;

		this.record = this.makeRecord();

		this.update = false;

		this.pop = config.pop;

		this.infecting = true;

		this.mode = 0;

		this.fillImages(config);

		this.run = true;
	}

	makeRecord()
	{
		return {
				  infected: new Record()
				, incubating: new Record()
				, infectious: new Record()
				, symptoms: new Record()
				, homeSick: new Record()
				, wardSick: new Record()
				, icuSick: new Record()
				, hallway: new Record()
				, dead: new Record()
				, recovered: new Record()
				, well: new Record() 
			}
	}

	fillImages(config)
	{
		this.imageList = [];

		for (const id of config.imageList)
		{
			this.imageList.push(document.getElementById(id));
		}
	}

	fill(config)
	{
		super.fill(config);

		this.record.well.current = config.count;
		this.record.well.max = config.count;
		this.record.well.total = config.count;
	}

	makePerson()
	{
		return new InfectablePerson();
	}
	
	initialize()
	{
		this.personList[0].infect(this.infectious.valueList[3]);
		this.personList[0].progressIndex = C.PROGRESS.PEAK;
		this.personList[0].church = this.churchList[0];

		increment(C.RECORD.INFECTIOUS | C.RECORD.SICK);
		decrement(C.RECORD.INCUBATING);

		this.update = true;
	}

	getProgression(index)
	{
		return this.progression[index];
	}

	step()
	{
		super.step();

		for (const person of this.personList)
		{
			person.decay();
		}

		for (const room of this.roomList)
		{
			room.spread();
		}	

		for (const person of this.personList)
		{
			person.expose();
		}

		this.drawAllRecords();
	}

	drawAllRecords()
	{
		if (this.update)
		{
			this.drawARecord("Infected", this.record.infected);
			this.drawARecord("Incubating", this.record.incubating);
			this.drawARecord("Infectious", this.record.infectious);
			this.drawARecord("Symptomatic", this.record.symptoms);
			this.drawARecord("HomeSick", this.record.homeSick);
			this.drawARecord("WardSick", this.record.wardSick);
			this.drawARecord("ICUSick", this.record.icuSick);
			this.drawARecord("Hallway", this.record.hallway);
			this.drawARecord("Recovered", this.record.recovered);
			this.drawARecord("Well", this.record.well);
			this.drawARecord("Dead", this.record.dead);

			// const r = computeR();
			// const r0Element = document.getElementById('r0');
			// r0Element.textContent = r.r0.toFixed(3);

			// const rtElement = document.getElementById('rt');
			// rtElement.textContent = r.rt.toFixed(2);

			this.update = false;
		}
	}

	drawARecord(nameBase, record)
	{
		this.drawValue('current' + nameBase, record.current);
		this.drawValue('max' + nameBase, record.max);
		this.drawValue('total' + nameBase, record.total);
	}

	drawValue(idName, value)
	{
		const element = document.getElementById(idName);
		element.textContent = value.toString();
	}
}

