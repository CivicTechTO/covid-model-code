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


class State
{
	constructor(config, width, height)
	{
		this.size = config.size;
		this.speed = config.speed;

		this.main = config.main;
		this.feederSpace = config.feederSpace;

		this.tick = 0;
		this.when = Math.floor(config.when / config.speed);
		this.which = 0;

		this.roomList = [];
		for (var i = 0; i < config.roomLocation.length; i++) 
		{
			let x = config.roomLocation[i].x;
			let y = config.roomLocation[i].y;
			this.roomList[i] = new Room(x, y, config.roomSize, config.roomSize)
		}

		this.personList = [];

		for (var i = 0; i < config.count; i++) 
		{
			let person = new Person();
			this.personList[i] = person;
			this.roomList[0].insert(person);
		}
	}
}


function step(state, deltaT) 
{
	let width = state.size.width;
	let height = state.size.height;

	let stepDelta = state.speed * Math.round(deltaT / FRAME);

	state.tick += 1;

	if (0 == state.tick % state.when)
	{
		state.which = (state.which + 1) % 4;
	}

	// for (var i = state.personList.length - 1; i >= 0; i--) 
	// {
	// 	move(state.personList[i], stepDelta);
	// }

	return state;
}

function draw(context, state)
{
	var width = state.size.width;
	var height = state.size.height;

	context.fillStyle = 'LightBlue';
	context.fillRect(0, 0, width, height);

	for (const room of state.roomList)
	{
		room.draw(context);
	}

	for (const person of state.personList)
	{
		person.draw(context);
	}
}


const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

var state = new State(config, canvas.width, canvas.height);

draw(context, state);

// window.requestAnimationFrame(animate);
