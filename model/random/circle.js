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

		for (const room of state.roomList)
		{
			room.leaveFor(state.roomList[this.which]);
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
	}

	fill(config)
	{
		for (var i = 0; i < config.roomLocation.length; i++) 
		{
			let x = config.roomLocation[i].x;
			let y = config.roomLocation[i].y;
			this.roomList[i] = new Room(x, y, config.roomSize, config.roomSize)
		}

		for (var i = 0; i < config.count; i++) 
		{
			let person = new Person();
			this.personList[i] = person;
			this.roomList[0].insert(person);
		}
	}
}

const canvas = document.getElementById('canvas');

var state = new CircleState(config, canvas.width, canvas.height);
state.fill(config);

window.requestAnimationFrame(animate);

// for (var i = 0; i < 200; i++)
// {
// 	state.step(1);
// }
