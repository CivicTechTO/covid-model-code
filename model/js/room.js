
class Room
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
		person.setCurrent(this.place(person));
	}

	place(person)
	{
		this.personSet.add(person);

		let columnCount = this.width - 8;
		let count = this.personSet.size;
		let x = this.x + 4 + count % columnCount;
		let y = this.y + 4 + Math.floor(count / columnCount);

		return new Point(x,y);
	}

	draw(context)
	{
		context.strokeStyle = 'black';
		context.lineWidth = 1;
		context.strokeRect(this.x, this.y, this.width, this.height);	
	}
}
