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

function testHistory()
{
	let actionIndex = 0;

	resetResults();
	
	state = new TestState(makeConfig(), 4, 20);

	while (state.clock < actionList[actionList.length - 1][0])
	{
		while (actionList[actionIndex][0] === state.clock)
		{
			const action = actionList[actionIndex];

			state.personList[action[1]].setItinerary(state.roomList[action[2]]);

			actionIndex++;
		}

		state.step();
	}

	for (var i = 0; i < testList.length; i++) 
	{
		const test = testList[i]
	
		const person = state.personList[test[0]];
		const actual = person.contacts(test[1], test[2]);
		const label = person.id.toString() + " " + test[1].toString() + " " + test[2].toString();

		displayResult(label, pickPeople(test[3]), actual);
	}
}

var actionList = 
[
	  [100, 0, 10]
	, [200, 0, 0]
	, [300, 1, 10]
	, [400, 3, 10]
	, [500, 3, 3]
	, [600, 1, 1]
	, [700, 2, 10]
	, [800, 2, 2]
	, [8840, 0, 10]
	, [8940, 3, 10]
	, [9040, 0, 0]
	, [9140, 1, 10]
	, [9240, 1, 1]
	, [9340, 2, 10]
	, [9440, 3, 3]
	, [9540, 2, 2]
	, [86400, 0, 0]
];

var testList = 
[
	  [0, 0, 8640, []]
	, [1, 0, 8640, [3]]
	, [2, 0, 8640, []]
	, [3, 0, 8640, [1]]
	, [0, 8640, 17280, [3]]
	, [1, 8640, 17280, [3]]
	, [2, 8640, 17280, [3]]
	, [3, 8640, 17280, [0, 1, 2]]
];
