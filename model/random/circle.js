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

class CircleState extends State
{
	constructor(config, width, height)
	{
		super(config, width, height);

		this.tick = 0;
		this.which = 0;
		this.when = config.when;

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

	step(stepCount) 
	{
		super.step(stepCount);

		if (0 === this.tick % this.when)
		{
			this.which = (this.which + 1) % this.roomList.length;
	
			for (const room of this.roomList)
			{
				room.leaveFor(this.roomList[this.which]);
			}
		}

		state.tick += 1;
	}
}

const canvas = document.getElementById('canvas');

var state = new CircleState(config, canvas.width, canvas.height);
state.fill(config);

window.requestAnimationFrame(animate);
