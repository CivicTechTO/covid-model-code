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

class CircleRoom extends Room
{
	constructor(x, y, width, height)
	{
		super(x, y, width, height);
	}

	leaveFor(to)
	{
		for (const person of this.personSet)
		{
			transfer(this.personSet, state.travelers, person);
			person.setItinerary(this, to);
		}

	}
}


class CircleState extends State
{
	constructor(config, width, height)
	{
		super(config, width, height);

		this.tick = 0;
		this.which = 0;
		this.when = config.when;

		for (var i = 0; i < config.roomLocation.length; i++) 
		{
			let x = config.roomLocation[i].x;
			let y = config.roomLocation[i].y;
			this.roomList[i] = new CircleRoom(x, y, config.roomSize, config.roomSize)
		}

		for (var i = 0; i < config.count; i++) 
		{
			let person = new Person();
			this.personList[i] = person;
			this.roomList[0].insert(person);
		}
	}

	step(deltaT) 
	{
		super.step(deltaT);

		if (0 === this.tick % this.when)
		{
			this.which = (this.which + 1) % this.roomList.length;
	
			for (const room of this.roomList)
			{
				room.leaveFor(this.roomList[this.which]);
			}
		}
		else
		{
			for (const room of this.roomList)
			{
				room.step(deltaT);
			}
		}

		state.tick += 1;
	}
}

const canvas = document.getElementById('canvas');

var state = new CircleState(config, canvas.width, canvas.height);

window.requestAnimationFrame(animate);
