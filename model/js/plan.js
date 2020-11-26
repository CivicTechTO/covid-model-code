
function row(x, y, width, speed, frontageList)
{
	let result = [];
	let current = y;

	for (frontage of frontageList)
	{
		result.push(new Room(x, current, width, frontage, speed));
		current += frontage;
	}

	return result;
}

function stack(count, x, y, width, height, speed) 
{
	let result = [];
	let current = y;

	for (var i = 0 ; i < count ; i++)
	{
		result.push(new Room(x, current, width, height, speed));
		current += height;
	}

	return result;
}

function twoStack(count, x, y, width, height, speed) 
{
	let result = [];
	let current = y;

	for (var i = 0 ; i < count ; i++)
	{
		result.push(new Room(x, current, width, height, speed));
		result.push(new Room(x + width, current, width, height, speed));
		current += height;
	}

	return result;
}
