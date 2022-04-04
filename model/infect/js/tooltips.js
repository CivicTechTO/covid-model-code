function connectTooltips()
{
	connect("person-tooltip", "person-tooltip-button");
	connect("info-tooltip", "info-tooltip-button");
	connect("general-tooltip", "general-tooltip-button");
	connect("speed-tooltip", "speed-tooltip-button");
	connect("start-infected-tooltip", "start-infected-tooltip-button");
	connect("game-speed-tooltip", "game-speed-tooltip-button");
	connect("capital-tooltip", "capital-tooltip-button");
	connect("display-sick-tooltip", "display-sick-tooltip-button");
	connect("game-tooltip", "game-tooltip-button");
	connect("masks-tooltip", "masks-tooltip-button");
	connect("tests-tooltip", "tests-tooltip-button");
	connect("trace-tooltip", "trace-tooltip-button");
	connect("isolate-tooltip", "isolate-tooltip-button");
	connect("worship-tooltip", "worship-tooltip-button");
	connect("restaurants-tooltip", "restaurants-tooltip-button");
	connect("bars-tooltip", "bars-tooltip-button");
	connect("clubs-tooltip", "clubs-tooltip-button");
	connect("schools-tooltip", "schools-tooltip-button");
	connect("offices-tooltip", "offices-tooltip-button");
	connect("factory-tooltip", "factory-tooltip-button");
	connect("outside-tooltip", "outside-tooltip-button");
	connect("house-tooltip", "house-tooltip-button");
	connect("bunkhouse-tooltip", "bunkhouse-tooltip-button");
	connect("isolation-tooltip", "isolation-tooltip-button");
	connect("icu-tooltip", "icu-tooltip-button");
	connect("ward-tooltip", "ward-tooltip-button");
	connect("waiting-tooltip", "waiting-tooltip-button");
	connect("cemetary-tooltip", "cemetary-tooltip-button");
}

function connect(name, button)
{
	document.getElementById(button).addEventListener("click", setTooltip(name));
}

function setTooltip(name)
{
	return function(mouse)
	{
		showTooltip(mouse, name);
	}
}


function showTooltip(mouse, name)
{
	hideTooltips();
	placeTooltip(mouse, show(name, "block"));
}

function placeTooltip(mouse, element)
{
	const x = mouse.pageX;
	const y = mouse.pageY;

	element.style.left = x.toString() + "px";
	element.style.top = y.toString() + "px";

	const root = document.documentElement;

	const rootRight = root.clientWidth;
	const rootBottom = root.clientHeight;

	const bounds = element.getBoundingClientRect();

	let deltaX = 0;
	let deltaY = 0;

	deltaX = Math.min(0, rootRight - bounds.right);
	let newX = x + deltaX;
	newX = Math.max(0, newX);

	deltaY = Math.min(0, rootBottom - bounds.bottom);
	let newY = y + deltaY;
	newY = Math.max(0, newY);

	element.style.left = newX.toString() + "px";
	element.style.top = newY.toString() + "px";

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

	showTooltip(mouse, tooltip);
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
