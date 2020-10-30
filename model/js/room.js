
class Place
{
	constructor(x, y, width, height)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.personSet = new Set();
	}

	insert(person)
	{
		person.setCurrent(this.place(person, this.personSet.size));
		this.personSet.add(person);
	}

	arrive(person)
	{
		person.moveTo(this.place(person, this.personSet.size));
		transfer(state.travelers, this.personSet, person);
	}
	
	beSeated()
	{
		let i = 0;
		for (const person of this.personSet)
		{
			person.moveTo(this.place(person, i++));
		}
	}

	place(person, which)
	{
		let columnCount = Math.floor((this.width - 4) / 4);
		let x = this.x + 4 + 4 * (which % columnCount);
		let y = this.y + 4 + 4 * Math.floor(which / columnCount);

		return new Point(x,y);
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
