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
	let tooltip; 

	if (state.debugPerson)
	{
		tooltip = "debug";

		const person = state.findPerson(mouse.offsetX, mouse.offsetY);

		if (person === undefined)
		{
			debugMessage("No person selected");
		}
		else
		{
			debugPerson(person);
		}
	}
	else
	{
		const room = state.findRoom(mouse.offsetX, mouse.offsetY);

		if (room === undefined)
		{
			tooltip = C.TOOLTIPS.ROAD;
		}
		else
		{
			tooltip = room.tooltip;
		}
	}

	let element = restack(show(tooltip, "block"));
	element.style.top = mouse.clientY.toString() + "px";
	element.style.left = mouse.clientX.toString() + "px";
}

function resetContents()
{
	const contents = document.getElementById("debug-contents");

	while (contents.firstChild) 
	{
		contents.removeChild(contents.firstChild);
	}	
}

function debugPerson(person)
{
	resetContents();

	const wrapper = document.createElement("div");

	wrapper.appendChild(document.createElement("div").appendChild(document.createTextNode("Person")));

	showPoint(wrapper, "current: ", person.current);
	showPoint(wrapper, "dest: ", person.dest);

	showRoomPointer(wrapper, "in: ", person.inRoom);
	showRoomPointer(wrapper, "to: ", person.toRoom);
	showRoomPointer(wrapper, "home: ", person.home);

	showValue(wrapper, "progressIndex: ", person.progressIndex);

	const contents = document.getElementById("debug-contents");
	contents.appendChild(wrapper);
}

function showValue(inElement, label, value) 
{
	let wrapper = document.createElement("div");

	wrapper.appendChild(document.createTextNode(label));
	wrapper.appendChild(document.createTextNode(value.toString()));

	inElement.appendChild(wrapper);
}

function showPoint(inElement, label, point) 
{
	let wrapper = document.createElement("div");

	wrapper.appendChild(document.createTextNode(label));

	if (point)
	{
		wrapper.appendChild(document.createTextNode("x " + point.x.toString() + " y " + point.y.toString()));
	}
	else
	{
		wrapper.appendChild(document.createTextNode("No point"));
	}

	inElement.appendChild(wrapper);
}

function showRoomPointer(inElement, label, room) 
{
	let wrapper = document.createElement("div");

	wrapper.appendChild(document.createTextNode(label));

	if (room)
	{
		wrapper.appendChild(document.createTextNode("x " + room.x.toString() + " y " + room.y.toString()));
	}
	else
	{
		wrapper.appendChild(document.createTextNode("No room"));
	}

	inElement.appendChild(wrapper);
}

function debugMessage(message)
{
	resetContents();

	const wrapper = document.createElement("div");

	wrapper.appendChild(document.createTextNode(message));

	const contents = document.getElementById("debug-contents");
	contents.appendChild(wrapper);
}

function connectRooms() 
{
	document.getElementById("display").onclick = showRoom;
}
