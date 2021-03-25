class InfectState extends State
{
	constructor(config, width, height)
	{
		super(config, width, height);

		this.deadSpeed = this.config.deadSpeed;
		
		this.susceptible = this.config.susceptible;
		this.infectious = this.config.infectious;
		
		this.infectConfig = this.config.infection;

		this.ventilation = this.config.ventilation;
		this.loudness = this.config.loudness;

		this.record = this.makeRecord();

		this.pop = this.config.pop;

		this.infecting = true;

		this.mode = 0;

		this.fillImages(this.config);

		this.run = true;
	}

	makeMap(progression)
	{
		let result = new Map();

		for (const row of progression)
		{
			result.set(row.index, row.data)
		}

		return result;
	}

	getProgression(index)
	{
		return this.progression.get(index);
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

	fill()
	{
		super.fill();

		this.record.well.current = this.config.count;
		this.record.well.max = this.config.count;
		this.record.well.total = this.config.count;
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

