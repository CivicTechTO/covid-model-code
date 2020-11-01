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

function roomChoice(type, x, y, config) 
{
	switch (type)
	{
	case 1:
		return new Room(x, y, config.roomSize, config.roomSize)
	}
}

class VariousState extends State
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
		for (var i = 0; i < config.roomSpec.length; i++) 
		{
			let type = config.roomSpec[i].type;
			let x = config.roomSpec[i].x;
			let y = config.roomSpec[i].y;
			this.roomList[i] = roomChoice(type, x, y, config);
		}

		for (var i = 0; i < config.count; i++) 
		{
			let person = new Person();
			this.personList[i] = person;
			this.roomList[i % this.roomList.length].insert(person);
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

var state = new VariousState(config, canvas.width, canvas.height);
state.fill(config);

window.requestAnimationFrame(animate);
