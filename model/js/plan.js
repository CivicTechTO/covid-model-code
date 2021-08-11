
function row(x, y, width, frontageList)
{
	let result = [];
	let current = y;

	for (frontage of frontageList)
	{
		result.push(new Room(x, current, width, frontage));
		current += frontage;
	}

	return result;
}

function stack(count, x, y, width, height) 
{
	let result = [];
	let current = y;

	for (var i = 0 ; i < count ; i++)
	{
		result.push(new Room(x, current, width, height));
		current += height;
	}

	return result;
}

function twoStack(count, x, y, width, height) 
{
	let result = [];
	let current = y;

	for (var i = 0 ; i < count ; i++)
	{
		result.push(new Room(x, current, width, height));
		result.push(new Room(x + width, current, width, height));
		current += height;
	}

	return result;
}

function NStack(rowSize, rowCount, x, y, width, height, makeRoom) 
{
	let result = [];

	for (var i = 0 ; i < rowCount ; i++)
	{
		for (var j = 0 ; j < rowSize ; j++)
		{
			result.push(makeRoom(x + j * width, y + i * height, width, height));
		}
	}

	return result;
}
