function showTooltip(name, stream, place)
{
	restack(placeTooltip(show(name, "block"), stream, place));
}

function placeTooltip(element, stream, place)
{
	const spec = state.activeConfig.tooltips;
	const left = spec.base + stream * spec.streamXDelta + place * spec.placeDelta;
	const top = spec.base + stream * spec.streamYDelta + place * spec.placeDelta;
	
	element.style.left = left.toString() + "em";
	element.style.top = top.toString() + "em";

	return element;
}

function hideTooltips()
{
	hideClass("tooltip");
}

function showRoom(mouse)
{
	const room = state.findRoom(mouse.offsetX, mouse.offsetY);
	let tooltip; 

	if (room === undefined)
	{
		tooltip = C.TOOLTIPS.ROAD;
	}
	else
	{
		tooltip = room.tooltip;
	}

	let element = restack(show(tooltip, "block"));
	element.style.top = mouse.clientY.toString() + "px";
	element.style.left = mouse.clientX.toString() + "px";
}

function connectRooms() 
{
	document.getElementById("display").onclick = showRoom;
}
