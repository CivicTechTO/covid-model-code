function topLeft(context, point, outer, contrast)
{
	square(context, point.x - state.personSize, point.y - state.personSize, outer, contrast)
}

function topRight(context, point, outer, contrast)
{
	square(context, point.x, point.y - state.personSize, outer, contrast)
}

function bottomLeft(context, point, outer, contrast)
{
	square(context, point.x - state.personSize, point.y, outer, contrast)
}

function bottomRight(context, point, outer, contrast)
{
	square(context, point.x, point.y, outer, contrast)
}

function square(context, x, y, outer, contrast)
{		
	let size = state.personSize;

	context.strokeStyle = outer;
	context.lineWidth = 1;

	context.strokeRect(x, y, size, size);	
	context.fillStyle = contrast;
	context.fillRect(x, y, size, size);	
}
