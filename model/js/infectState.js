class InfectState extends State
{
	constructor(configuration)
	{
		super(configuration);
		
		this.susceptible = this.activeConfig.susceptible;
		this.infectious = this.activeConfig.infectious;
		
		this.ventilation = this.activeConfig.ventilation;
		this.loudness = this.activeConfig.loudness;

		this.record = this.makeRecord();

		this.pop = this.activeConfig.pop;

		this.infecting = true;

		this.mode = 0;

		this.fillImages(this.activeConfig);

		this.run = false;
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
				, masks: new Record() 
				, infector: new Record() 
				, infectee: new Record() 
				, isolated: new Record()
				, isolationRoom: new Record()
				, isolationHome: new Record()
				, isolationOverflow: new Record()
				, positive: new Record()
				, tests: new Record()
				, traceTests: new Record()
				, tracePositives: new Record()
				, randomTests: new Record()
				, randomPositives: new Record()
				, hospitalPositives: new Record()
				, hospitalTests: new Record()
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

		this.record.well.current = this.activeConfig.count;
		this.record.well.max = this.activeConfig.count;
		this.record.well.total = this.activeConfig.count;
	}

	makePerson()
	{
		return new InfectablePerson();
	}
	
	initialize()
	{
		if(persistent.startSpec.value)
		{
			this.personList[0].infect(this.infectious.valueList[C.INFECTIOUS.EXCEEDINGLY]);
			this.personList[0].progressIndex = C.PROGRESS.PEAK;
			this.personList[0].church = this.churchList[0];

			recordIncrement(C.RECORD.INFECTIOUS | C.RECORD.SICK);
			recordDecrement(C.RECORD.INCUBATING);
		}
	}

	step()
	{
		super.step();

		for (const person of this.personList)
		{
			if (person.infectable() && this.activeConfig.infectProbability > Math.random())
			{
				person.infect(pick(this.infectious.pList, this.infectious.valueList));
			}
		}

		for (const person of this.personList)
		{
			person.initLoad();
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
		this.drawARecord("Tests", this.record.tests);
		this.drawARecord("Isolated", this.record.isolated);
		this.drawARecord("IsolationRoom", this.record.isolationRoom);
		this.drawARecord("IsolationHome", this.record.isolationHome);
		this.drawARecord("IsolationOverflow", this.record.isolationOverflow);
		this.drawARecord("Positive", this.record.positive);
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
		this.drawARecord("TraceTests", this.record.traceTests);
		this.drawARecord("TracePositives", this.record.tracePositives);
		this.drawARecord("RandomTests", this.record.randomTests);
		this.drawARecord("RandomPositives", this.record.randomPositives);
		this.drawARecord("HospitalPositives", this.record.hospitalPositives);
		this.drawARecord("HospitalTests", this.record.hospitalTests);
		this.drawARecord("Masks", this.record.masks);

		// this.drawARecord("Infector", this.record.infector);
		// this.drawARecord("Infectee", this.record.infectee);

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

