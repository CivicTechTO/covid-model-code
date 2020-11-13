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

class DrawPerson extends Person
{
	constructor(type)
	{
		super();

		this.type = type;
	}

	draw(context)
	{
		switch(this.type)
		{
		case 0:
			context.strokeStyle = 'black';
		 	context.strokeRect(this.current.x, this.current.y, 1, 1);
		 	break;

		case 1:
			context.strokeStyle = 'red';
		 	context.strokeRect(this.current.x, this.current.y, 1, 1);
		 	break;

		case 2:
			context.strokeStyle = 'black';
		 	context.strokeRect(this.current.x, this.current.y, 1, 1);
		 	break;

		case 3:
			context.strokeStyle = 'black';
		 	context.strokeRect(this.current.x, this.current.y, 1, 1);
		 	break;

		case 4:
			context.strokeStyle = 'black';
		 	context.strokeRect(this.current.x, this.current.y, 1, 1);
		 	break;

		case 5:
			context.strokeStyle = 'black';
		 	context.strokeRect(this.current.x, this.current.y, 1, 1);
		 	break;

		case 6:
			context.strokeStyle = 'black';
		 	context.strokeRect(this.current.x, this.current.y, 1, 1);
		 	break;

		case 7:
			context.strokeStyle = 'black';
		 	context.strokeRect(this.current.x, this.current.y, 1, 1);
		 	break;

		case 8:
			context.strokeStyle = 'black';
		 	context.strokeRect(this.current.x, this.current.y, 1, 1);
		 	break;

		case 9:
			context.strokeStyle = 'black';
		 	context.strokeRect(this.current.x, this.current.y, 1, 1);
		 	break;

		case 10:
			context.strokeStyle = 'black';
		 	context.strokeRect(this.current.x, this.current.y, 1, 1);
		 	break;

		case 11:
			context.strokeStyle = 'black';
		 	context.strokeRect(this.current.x, this.current.y, 1, 1);
		 	break;

		case 12:
			context.strokeStyle = 'black';
		 	context.strokeRect(this.current.x, this.current.y, 1, 1);
		 	break;

		case 13:
			context.strokeStyle = 'black';
		 	context.strokeRect(this.current.x, this.current.y, 1, 1);
		 	break;

		case 14:
			context.strokeStyle = 'black';
		 	context.strokeRect(this.current.x, this.current.y, 3, 3);
		 	break;

		case 15:
			context.strokeStyle = 'black';
		 	context.strokeRect(this.current.x, this.current.y, 1, 1);
		 	break;

		case 16:
			context.strokeStyle = 'black';
		 	context.strokeRect(this.current.x, this.current.y, 1, 1);
		 	break;

		case 17:
			context.strokeStyle = 'black';
		 	context.strokeRect(this.current.x, this.current.y, 1, 1);
		 	break;

		case 18:
			context.strokeStyle = 'black';
		 	context.strokeRect(this.current.x, this.current.y, 1, 1);
		 	break;

		case 19:
			context.strokeStyle = 'blue';
		 	context.strokeRect(this.current.x, this.current.y, 1, 1);
		 	break;			
		}
	}

}

class DrawState extends State
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
			let person = new DrawPerson(i % 20);
			this.personList[i] = person;
			this.roomList[0].insert(person);
		}
	}
}

const canvas = document.getElementById('canvas');

var state = new DrawState(config, canvas.width, canvas.height);
state.fill(config);

window.requestAnimationFrame(animate);
