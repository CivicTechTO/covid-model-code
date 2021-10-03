var state;
var C = makeConstants();

class IdentifiablePerson extends Person
{
	constructor(id)
	{
		super();

		this.id = id;
	}
}

class TestState extends State
{
	constructor(configuration, personCount, roomCount)
	{
		super(configuration);
		
		this.setSecondsPerStep(configuration.secondsPerStep.large);

		this.makeRooms(roomCount);
		this.makePeople(personCount);

		this.scoreDate = -1;
	}

	makeRooms(roomCount)
	{
		this.roomList = nStack(1, roomCount, 1, 1, 40, 40, makeSeat(this.activeConfig.spacing, 10));
	}

	makePeople(personCount)
	{
		this.personList = [];

		for (let i = 0; i < personCount; i++) 
		{
			this.personList[i] = new IdentifiablePerson(i);
			this.roomList[i].insert(this.personList[i]);
		}
	}

	scaleTime()
	{

		this.activeConfig.moveSpeed = this.perSecondToPerTick(this.savedConfig.moveSpeed);
		this.activeConfig.leaveSpeed = this.perSecondToPerTick(this.savedConfig.leaveSpeed);
		this.activeConfig.deadSpeed = this.perSecondToPerTick(this.savedConfig.deadSpeed);
		this.activeConfig.moveVariation = this.perSecondToPerTick(this.savedConfig.moveVariation);
		this.activeConfig.travelSpeed = this.perSecondToPerTick(this.savedConfig.travelSpeed);
		this.activeConfig.travelVariation = this.perSecondToPerTick(this.savedConfig.travelVariation);
	}

	setSecondsPerStep(stepSize)
	{
		this.secondsPerStep = stepSize;

		this.scaleTime();
	}

	step()
	{
		this.clock++;

		const today = this.tickToDay(this.clock);

		if (today !== this.scoreDate)
		{
			this.scoreDate = today;
			
			const now = this.tickToHour(this.clock);

			if (this.activeConfig.game.update > now % 24)
			{
				this.setHistoryIndex();
				this.personList.forEach(person => person.resetHistory());
				this.roomList.forEach(room => room.resetHistory());				
			}
		}
		
		for (let person of this.personList)
		{
			person.step();
		}
	}

}


function makeSeat(spacing, speed) 
{
	return function (x, y, width, height) 
	{
		let room = new Room(x, y, width, height);
		room.rules = new SeatRulesSpace(spacing, speed);

		return room;
	}

}
