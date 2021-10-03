function resetResults()
{
	const results = document.getElementById("results");

	while (results.firstChild) 
	{
		results.removeChild(results.firstChild);
	}	
}

function displayResult(label, expected, actual) 
{
	const wrapper = document.createElement("div");

	wrapper.appendChild(document.createTextNode(label));
	
	if (compareTest(expected, actual))
	{
		wrapper.appendChild(document.createTextNode(" passed"));
	}
	else
	{
		wrapper.appendChild(document.createTextNode(" failed: expected: ["));
		wrapper.appendChild(document.createTextNode(toAString(expected)));
		wrapper.appendChild(document.createTextNode("] got: ["));
		wrapper.appendChild(document.createTextNode(toAString(actual)));
		wrapper.appendChild(document.createTextNode("]"));
	}

	const results = document.getElementById("results");
	results.appendChild(wrapper);
}

function compareTest(expected, actual) 
{
	if (expected.size != actual.size) return false;

	for (const person of expected) if (!actual.has(person)) return false;

	return true;
}

function toAString(set)
{
	let result = "";
	let separator = "";

	set.forEach((person) => 
		{
			let temp = separator; 
			separator = ", "; 
			result += temp + person.id.toString(); 
			return;
		});

	return result;
}

function testTest()
{
	resetResults();

	state = new TestState(makeConfig(), 10, 10);

	displayResult("Test 0", pickPeople([]), pickPeople([]));
	displayResult("Test 1", pickPeople([0, 1, 2]), pickPeople([2, 1, 0]));
	displayResult("Test 2", pickPeople([1, 2, 3]), pickPeople([]));
	displayResult("Test 3", pickPeople([4, 5, 6]), pickPeople([7]));
	displayResult("Test 4", pickPeople([4, 5, 6]), pickPeople([4, 5, 7]));
}

function pickPeople(indexList) 
{
	let result = new Set();
	indexList.forEach(index => result.add(state.personList[index]));

	return result;
}

function actionToTick(action) 
{
	return state.dayToTick(action[0]) + state.hourToTick(action[1]);
}

function testHistory()
{
	let actionIndex = 0;
	resetResults();
	
	state = new TestState(makeConfig(), 10, 20);
	state.fillHistory();

	while (state.clock < state.dayToTick(END))
	{
		while (actionIndex < actionList.length && actionToTick(actionList[actionIndex]) === state.clock)
		{
			const action = actionList[actionIndex];
			const person = state.personList[action[2]];
			const toRoom = state.roomList[action[3]];

			person.setItinerary(toRoom);

			actionIndex++;
		}

		state.step();
	}

	for (var i = 0; i < testList.length; i++) 
	{
		const test = testList[i]
	
		const person = state.personList[test[0]];
		const actual = person.contacts(state.dayToTick(test[1]), state.dayToTick(test[2]));
		const label = person.id.toString() + " " + test[1].toString() + " " + test[2].toString();

		displayResult(label, pickPeople(test[3]), actual);
	}
}

function displayHistory()
{
	const showMap = (dayNumber, x, y, person, history) => console.log("room", x, y, "day", dayNumber, "person", person.id, "history", JSON.stringify(history));
	const showDay = (dayNumber, day, x, y) => day.forEach((history, person, map) => showMap(dayNumber, x, y, person, history));
	const showRoom = (room) => room.history.forEach((day, dayNumber) => showDay(dayNumber, day, room.x, room.y));
	state.roomList.forEach(room => showRoom(room));
}

const END = 5;

var actionList = 
[
	  [0, 1, 0, 10]
	, [0, 4, 0, 0]
	, [0, 6, 1, 10]
	, [0, 7, 3, 10]
	, [0, 10, 3, 3]
	, [0, 11, 1, 1]
	, [0, 12, 2, 10]
	, [0, 15, 2, 2]
	, [1, 0, 8, 10]
	, [1, 1, 4, 10]
	, [1, 2, 7, 10]
	, [1, 4, 4, 4]
	, [1, 5, 5, 10]
	, [1, 8, 5, 5]
	, [1, 9, 6, 10]
	, [1, 11, 7, 7]
	, [1, 13, 6, 6]
	, [1, 20, 8, 8]
	, [2, 0, 8, 11]
	, [2, 0, 9, 12]
	, [2, 1, 0, 11]
	, [2, 2, 1, 11]
	, [2, 4, 0, 0]
	, [2, 5, 1, 1]
	, [2, 7, 0, 12]
	, [2, 10, 0, 12]
	, [2, 20, 8, 8]
	, [2, 20, 9, 9]
];

var testList = 
[
	  [0, 0, 1, []]
	, [1, 0, 1, [3]]
	, [2, 0, 1, []]
	, [3, 0, 1, [1]]
	, [4, 1, 2, [7, 8]]
	, [5, 1, 2, [7, 8]]
	, [6, 1, 2, [7, 8]]
	, [7, 1, 2, [4, 5, 6, 8]]
	, [0, 0, 2, []]
	, [1, 0, 2, [3]]
	, [2, 0, 2, []]
	, [3, 0, 2, [1]]
	, [4, 0, 2, [7, 8]]
	, [5, 0, 2, [7, 8]]
	, [6, 0, 2, [7, 8]]
	, [7, 0, 2, [4, 5, 6, 8]]
	, [0, 2, 3, [1, 8, 9]]
	, [0, 0, 3, [1, 8, 9]]
	, [1, 0, 3, [0, 3, 8]]
];
