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

class NextRoom extends Shift
{
	constructor()
	{
		super();
		this.which = 0;
	}

	startShift()
	{
		this.which = (this.which + 1) % state.roomList.length;

		for (const person of state.personList)
		{
			person.setItinerary(state.roomList[this.which]);
		}
	}
}

class CircleState extends State
{
	constructor(config, width, height)
	{
		super(config, width, height);
		let shift = new NextRoom();
		this.week = [shift, shift];

		this.limit = config.limit;
		this.limitCount = 0;

		this.shortShiftLength = config.shortShiftLength;
		this.longShiftLength = config.longShiftLength;
	}

	fill(config)
	{
		for (var i = 0; i < config.roomSpec.length; i++) 
		{
			let x = config.roomSpec[i].x;
			let y = config.roomSpec[i].y;
			let speed = config.roomSpec[i].speed;
			this.roomList[i] = new Room(x, y, config.roomSize, config.roomSize, speed);
		}

		for (var i = 0; i < config.count; i++) 
		{
			let person = new Person();
			this.personList[i] = person;
			this.roomList[0].insert(person);
		}
	
		setShort();
	}
}

function limitedAnimate(timestamp)
{
	if (0 === state.limit ||  state.limit > state.limitCount++)
	{
		window.requestAnimationFrame(limitedAnimate);
	}

	let deltaT = (past ? timestamp - past : FRAME);
	past = timestamp;
	stepCount = Math.round(deltaT / FRAME);

	const context = document.getElementById('canvas').getContext('2d');

	context.save();

	state.draw(context);

	context.restore();

	state.step(stepCount);
}

function setShort() 
{
	setShift(state.shortShiftLength);
}

function setLong() 
{
	setShift(state.longShiftLength);
}

function setShift(length) 
{
	state.shiftLength = length;
	const nameElement = document.getElementById('length');
	nameElement.textContent = length.toString();
}

/*
 *		Execution starts here
 */

 
const canvas = document.getElementById('canvas');

var state = new CircleState(config, canvas.width, canvas.height);
state.fill(config);

window.requestAnimationFrame(limitedAnimate);

// for (var i = 0; i < 200; i++)
// {
// 	state.step(1);
// }
