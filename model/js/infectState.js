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

		this.infectedRecord = new Record();
		this.infectiousRecord = new Record();
		this.symptomsRecord = new Record();
		this.homeSickRecord = new Record();
		this.wardSickRecord = new Record();
		this.icuSickRecord = new Record();
		this.hallwayRecord = new Record();
		this.deadRecord = new Record();
		this.recoveredRecord = new Record();
		this.wellRecord = new Record();

		this.update = false;

		this.pop = config.pop;

		this.infecting = true;

		this.mode = 0;

		this.fillImages(config);

		this.run = true;
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

		this.wellRecord.current = config.count;
		this.wellRecord.max = config.count;
		this.wellRecord.total = config.count;
	}

	makePerson()
	{
		return new InfectablePerson();
	}
	
	initialize()
	{
		this.personList[0].infect(C.INFECTIOUS.EXTREMELY);
		this.personList[0].progressIndex = C.PROGRESS.PEAK;
		this.personList[0].church = this.churchList[0];

		increment(C.RECORD.INFECTIOUS | C.RECORD.SICK);

		this.update = true;
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

this.computeTrackIndex();	

if (this.recoveredRecord.current !== this.trackIndex[1] + this.trackIndex[10])
{
console.log("recovered not equal", this.recoveredRecord.current, this.trackIndex[1] + this.trackIndex[10]);
}

if (0 === this.clock % 1000)
{
console.log(JSON.stringify(this.trackIndex));
}
	}

computeTrackIndex()
{
this.trackIndex = [];
for (let i = 0; i < 15 ; i++)
{
this.trackIndex.push(0);
}
for (const person of this.personList)
{
this.trackIndex[person.progressIndex]++;
}
}
	drawAllRecords()
	{
		if (this.update)
		{
			this.drawARecord("Infected", this.infectedRecord);
			this.drawARecord("Infectious", this.infectiousRecord);
			this.drawARecord("Symptomatic", this.symptomsRecord);
			this.drawARecord("HomeSick", this.homeSickRecord);
			this.drawARecord("WardSick", this.wardSickRecord);
			this.drawARecord("ICUSick", this.icuSickRecord);
			this.drawARecord("Hallway", this.hallwayRecord);
			this.drawARecord("Recovered", this.recoveredRecord);
			this.drawARecord("Well", this.wellRecord);
			this.drawARecord("Dead", this.deadRecord);

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

