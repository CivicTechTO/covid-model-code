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

		this.makeRooms(roomCount);
		this.makePeople(personCount);


	}

	makeRooms(roomCount)
	{
		this.roomList = nStack(1, roomCount, 1, 1, 40, 40, makeSeat(this.activeConfig.spacing, this.activeConfig.moveSpeed));
	}

	makePeople(personCount)
	{
		this.personList = [];

		for (var i = 0; i < personCount; i++) 
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
