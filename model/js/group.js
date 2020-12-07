class Group
{
	constructor(room, deltaX, deltaY, columnCount, rowCount)
	{	
		this.room = room;
		this.deltaX = deltaX;
		this.deltaY = deltaY;
		this.columnCount = columnCount;
		this.rowCount = rowCount;

		this.personSet = new Set();
	}

	add(person)
	{
		if (this.isFull())
		{
			return false;
		}
		else
		{
			let which = this.personSet.size;
			let column = which % this.columnCount; 
			let row = Math.floor(which / this.columnCount); 
			let x = this.room.x + this.deltaX + (1 + column) * state.spacing;
			let y = this.room.y + this.deltaY + (1 + row) * state.spacing;

			person.moveTo(new Point(x, y), this.room.getSpeed());

			this.personSet.add(person);
			person.group = this;

			return true;
		}
	}

	delete(person)
	{
		person.group = null;
		return this.personSet.delete(person);
	}

	isFull()
	{
		return (this.personSet.size >= (this.rowCount * this.columnCount));
	}
}
