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
			person.moveTo(this.place(this.personSet.size), this.room.getSpeed());

			this.personSet.add(person);
			person.group = this;

			return true;
		}
	}

	place(which)
	{
		let column = which % this.columnCount; 
		let row = Math.floor(which / this.columnCount); 
		let x = this.room.x + this.deltaX + (1 + column) * state.spacing;
		let y = this.room.y + this.deltaY + (1 + row) * state.spacing;

		return new Point(x,y);
	}

	replace()
	{
		let index = 0;
		for (let person of this.personSet)
		{
			person.moveTo(this.place(index++));
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
