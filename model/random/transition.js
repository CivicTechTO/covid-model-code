/*
 *	Go to corner rooms via roads
 */


/*
 *	There is one main E/W road halfway up the model
 *  There are a set of equally spaced N/S feeder roads
 *  Path finding is
 *		Go E/W to the nearest feeder road
 *		Go N/S to the main road
 *		Go E/W to the feeder road nearest the dest
 *		Go N/S to the dest y co-ordinate
 *		Go E/W to the dest
 */

function roomChoice(type, args, x, y, config) 
{
	let roomSize = config.roomSize;

	switch (type)
	{
	case 1:
		return new Room(x, y, roomSize, roomSize);
		break;

	case 2:
		return new RandomRoom(x, y, roomSize, roomSize, args.halfEdge, args.start, args.pause);
		break;
	}
}

class ResetRoom extends Shift
{
	constructor()
	{
		super();
	}

	startShift()
	{
		for (const room of state.roomList)
		{
			room.resetEvents();
		}
	}
}

class Sit extends Event
{
	constructor(room, time)
	{
		super(room, time);
	}

	action()
	{
		this.room.change(new Rules());
	}
}

class Millabout extends Event
{
	constructor(room, time, args)
	{
		super(room, time);

		this.args = args;
	}

	action()
	{
		this.room.change(new RandomRules(this.args.halfEdge, this.args.start, this.args.pause));
	}
}

class TransitionState extends State
{
	constructor(config, width, height)
	{
		super(config, width, height);
		let shift = new ResetRoom();
		this.week = [shift, shift];
	}

	fill(config)
	{
		for (var i = 0; i < config.roomSpec.length; i++) 
		{
			let type = config.roomSpec[i].type;
			let args = config.roomSpec[i].args;
			let x = config.roomSpec[i].x;
			let y = config.roomSpec[i].y;
			
			let room = roomChoice(type, args, x, y, config);

			room.addEvent(new Sit(room, config.sit));		
			room.addEvent(new Millabout(room, config.millabout, config.roomSpec[i].args));		

			this.roomList[i] = room;
		}

		for (var i = 0; i < config.count; i++) 
		{
			let person = new Person();
			this.personList[i] = person;
			this.roomList[i % this.roomList.length].insert(person);
		}
	}
}

const canvas = document.getElementById('canvas');

var state = new TransitionState(config, canvas.width, canvas.height);
state.fill(config);

window.requestAnimationFrame(animate);

// for (var i = 100 - 1; i >= 0; i--) 
// {
// 	state.step(FRAME);
// }
