// Base and default rules class

class Rules
{
	constructor(place)
	{
		this.place = place;
	}

	insert(person)
	{
		person.setCurrent(seat(this.place, person, this.place.personSet.size));
		this.place.personSet.add(person);
	}

	arrive(person)
	{
		person.moveTo(seat(this.place, person, this.place.personSet.size));
		transfer(state.travelers, this.place.personSet, person);
	}

	transition()
	{
		let i = 0;
		for (const person of this.personSet)
		{
			person.moveTo(seat(this.place, person, i++));
		}
	}

	step(deltaT)
	{

	}

}

function seat(room, person, which)
{
	let spacing = state.spacing
	let columnCount = Math.floor((room.width - spacing) / spacing);
	let x = room.x + spacing + spacing * (which % columnCount);
	let y = room.y + spacing + spacing * Math.floor(which / columnCount);

	return new Point(x,y);
}

class Random extends Rules
{
	constructor(place, box)
	{
		super(place);
		this.box = box;
	}

	insert(person)
	{

	}

	arrive(person)
	{

	}

	transition()
	{

	}
}

class Place
{
	constructor(x, y, width, height)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.personSet = new Set();
		this.rules = new Rules(this);
	}

	insert(person)
	{
		this.rules.insert(person);
	}

	arrive(person)
	{
		this.rules.arrive(person);
	}
	
	door()
	{
		let midX = this.x + Math.floor(this.width / 2);
		let midY = this.y + Math.floor(this.height / 2);
		let nearest = state.findFeeder(midX);
		let side = (nearest < midX ? this.x : this.x + this.width);
		return new Point(side, midY);
	}

	step(deltaT)
	{
		this.rules.step(deltaT);

		for (const person of this.personSet)
		{
			person.step(deltaT);
		}
	}
}

class Room extends Place
{
	constructor(x, y, width, height)
	{
		super(x, y, width, height);
	}

	draw(context)
	{
		context.strokeStyle = 'black';
		context.lineWidth = 1;
		context.strokeRect(this.x, this.y, this.width, this.height);	
	}
}
