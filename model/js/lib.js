function deepCopy(inObject)
{
	let outObject, value, key

	if (typeof inObject !== "object" || inObject === null) 
	{
		return inObject // Return the value if inObject is not an object
	}

	outObject = Array.isArray(inObject) ? [] : {}

	for (key in inObject) 
	{
		value = inObject[key]
		outObject[key] = deepCopy(value)
	}

	return outObject
}

function intersection(set1, set2)
{
	return new Set(Array.from(set1).filter(element => set2.has(element)));
}

function union(set1, set2)
{
	let result = new Set();
	
	set1.forEach(element => result.add(element));
	set2.forEach(element => result.add(element));

	return result;
}

function pop(set)
{
	let result = null;

	if (set.size > 0)
	{
		result = set.values().next().value;
		set.delete(result);
	}

	return result;
}

function rand(end)
{
	return Math.floor(end * Math.random());
}

function pick(pList, valueList)
{
	let pick = Math.random();

	for (var i = 0; i < pList.length; i++) 
	{
		pick -= pList[i];

		if (pick < 0)
		{
			return valueList[i];
		}
	}
}

function clamp(lower, upper, value) 
{
	return (lower > value ? lower : (upper < value ? upper : value));
}

function computeLevel(levels)
{
	return levels.low + (rand((levels.high - levels.low) + 1));
}

function computeColour(colours, scale)
{
	const red = scaleColour(colours.high.r, colours.low.r, scale);
	const green = scaleColour(colours.high.g, colours.low.g, scale);
	const blue = scaleColour(colours.high.b, colours.low.b, scale);
	return formatColours(red, green, blue);
}

function scaleColour(high, low, scale) 
{
	return low + (high - low) * scale;
}

function formatColours(red, green, blue)
{
	return `rgb(${red}, ${green}, ${blue})`;
}

const FRAME = 1000 / 60;

function animate(timestamp)
{
	if (state.run)
	{
		runModel(timestamp)

		if (state.game)
		{
			newGame();
			startRunning();
		}
		else
		{
			window.requestAnimationFrame(animate);
		}
	}
}

function isEarly()
{
	return 0 === persistent.displaySickSpec.value;
}

function newGame()
{
	state.chartList.destroy();
	startup(makeConfig(), true);
}

function runModel(timestamp)
{
	let deltaT = (state.past ? timestamp - state.past : FRAME);
	state.past = timestamp;
	let stepCount = Math.max(state.speedSpec.value, Math.round(deltaT / FRAME));

	while (state.run && stepCount-- > 0)
	{
		state.step();
		state.run = state.run && !won() && !lost();
	}

	draw();
}

function won()
{
	return state.clock >= state.activeConfig.limit
}

function lost()
{
	return state.netScore <= 0;
}

function gameAnimate(timestamp)
{
	if (state.run)
	{
		runModel();

		if (state.run)
		{
			window.requestAnimationFrame(gameAnimate);
		}
		else
		{
			draw();
			
			if (lost())
			{
				announceLost();
			}
			else
			{
				if (won())
				{
					announceWon();
				}
			}
		}
	}
}

function reportInfected()
{
	reportRooms("Work", state.workList);
	reportRooms("Meat packing", state.meatList);
	reportRooms("Office", state.officeList);
	reportRooms("School", state.schoolList);
	reportRooms("House", state.houseList);
	reportRooms("Bunkhouse", state.bunkHouseList);
	reportRooms("Church", state.churchList);
	reportRooms("Restaurant", state.restaurantList);
	reportRooms("Pub", state.pubList);
	reportRooms("Club", state.clubList);
	reportRooms("Park", state.outsideList);
}

function reportRooms(name, list)
{
	console.log(name, sumInfected(list));
}

function sumInfected(list) 
{
	let result = 0;

	for (const room of list)
	{
		result += room.infected;
	}

	return result;
}

function makeInfectedColourMap()
{
	let result = new Map();

// workStyle is indexed by C.WORKTYPE = {SCHOOLS:0, OFFICES: 1, MEAT: 2};
	let workStyle = state.activeConfig.workStyle;

	result.set("meatList", workStyle[C.WORKTYPE.MEAT]); 
	result.set("officeList", workStyle[C.WORKTYPE.OFFICES]);
	result.set("schoolList", workStyle[C.WORKTYPE.SCHOOLS]);
	result.set("houseList", state.activeConfig.house.style);
	result.set("bunkHouseList", state.activeConfig.bunkHouse.style);
	result.set("churchList", state.activeConfig.church.style);
	result.set("restaurantList", state.activeConfig.restaurant.style);
	result.set("pubList", state.activeConfig.pub.style);
	result.set("clubList", state.activeConfig.club.style);
	result.set("outsideList", state.activeConfig.outside.style);

	return result;
}

function startup(config, playGame)
{
	const canvas = document.getElementById('canvas');

	state = new GameState(config, playGame);
	state.fill();
	state.initialize();

	initialTime();

	state.debugDraw = false;
	state.countDraw = false;
	state.debugCount = 0;

	state.week[0].startShift();

	draw();
}


function draw() 
{
	const context = document.getElementById('canvas').getContext('2d');
	context.save();
	state.draw(context);
	context.restore();
}

class Point
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}

	equals(other)
	{
		return this.x === other.x && this.y === other.y;
	}
}

class History
{
	constructor(time)
	{
		this.from = time;
		this.to = -1;
	}

	depart(time)
	{
		this.to = time;
	}

	overlaps(other)
	{
		let thisTo = (this.to > 0 ? this.to : state.clock);
		let otherTo = (other.to > 0 ? other.to : state.clock);

		return !(thisTo < other.from || otherTo < this.from);
	}
}

// function transfer(fromSet, toSet, member) 
// {
// 	toSet.add(member);
// 	fromSet.delete(member);
// }


function chooseOne(choices) 
{
	return choices[rand(choices.length)];
}

function makeChoices(optionList, weightList) 
{
	let result = [];

	for (var i = 0; i < optionList.length; i++) 
	{
		for (var j = 0; j < weightList[i]; j++) 
		{
			result.push(optionList[i]);
		}
	}

	return result;
}

function recordIncrement(which)
{
	if (0 !== (which & C.RECORD.INFECTED)) {state.record.infected.increment();}		
	if (0 !== (which & C.RECORD.INFECTIOUS)) {state.record.infectious.increment();}
	if (0 !== (which & C.RECORD.SICK)) {state.record.symptoms.increment();}
	if (0 !== (which & C.RECORD.HOMESICK)) {state.record.homeSick.increment();}
	if (0 !== (which & C.RECORD.WARDSICK)) {state.record.wardSick.increment();}
	if (0 !== (which & C.RECORD.ICUSICK)) {state.record.icuSick.increment();}
	if (0 !== (which & C.RECORD.DEAD)) {state.record.dead.increment();}
	if (0 !== (which & C.RECORD.HALLWAY)) {state.record.hallway.increment();}
	if (0 !== (which & C.RECORD.RECOVERED)) {state.record.recovered.increment();}
	if (0 !== (which & C.RECORD.WELL)) {state.record.well.increment();}
	if (0 !== (which & C.RECORD.INCUBATING)) {state.record.incubating.increment();}
	if (0 !== (which & C.RECORD.MASKS)) {state.record.masks.increment();}
	if (0 !== (which & C.RECORD.ISOLATED)) {state.record.isolated.increment();}
	if (0 !== (which & C.RECORD.ISOLATIONROOM)) {state.record.isolationRoom.increment();}
	if (0 !== (which & C.RECORD.ISOLATIONHOME)) {state.record.isolationHome.increment();}
	if (0 !== (which & C.RECORD.ISOLATIONOVERFLOW)) {state.record.isolationOverflow.increment();}
	if (0 !== (which & C.RECORD.POSITIVE)) {state.record.positive.increment();}
	if (0 !== (which & C.RECORD.TESTS)) {state.record.tests.increment();}
	if (0 !== (which & C.RECORD.TRACE_TESTS)) {state.record.traceTests.increment();}
	if (0 !== (which & C.RECORD.TRACE_POSITIVES)) {state.record.tracePositives.increment();}
	if (0 !== (which & C.RECORD.RANDOM_TESTS)) {state.record.randomTests.increment();}
	if (0 !== (which & C.RECORD.RANDOM_POSITIVES)) {state.record.randomPositives.increment();}
	if (0 !== (which & C.RECORD.HOSPITAL_POSITIVES)) {state.record.hospitalPositives.increment();}
	if (0 !== (which & C.RECORD.HOSPITAL_TESTS)) {state.record.hospitalTests.increment();}

	if (which !== 0)
	{
		state.drawAllRecords();
	}
}

function recordDecrement(which)
{
	if (0 !== (which & C.RECORD.INFECTED)) {state.record.infected.decrement();}
	if (0 !== (which & C.RECORD.INFECTIOUS)) {state.record.infectious.decrement();}
	if (0 !== (which & C.RECORD.SICK)) {state.record.symptoms.decrement();}
	if (0 !== (which & C.RECORD.HOMESICK)) {state.record.homeSick.decrement();}
	if (0 !== (which & C.RECORD.WARDSICK)) {state.record.wardSick.decrement();}
	if (0 !== (which & C.RECORD.ICUSICK)) {state.record.icuSick.decrement();}
	if (0 !== (which & C.RECORD.DEAD)) {state.record.dead.decrement();}
	if (0 !== (which & C.RECORD.HALLWAY)) {state.record.hallway.decrement();}
	if (0 !== (which & C.RECORD.RECOVERED)) {state.record.recovered.decrement();}
	if (0 !== (which & C.RECORD.WELL)) {state.record.well.decrement();}
	if (0 !== (which & C.RECORD.INCUBATING)) {state.record.incubating.decrement();}
	if (0 !== (which & C.RECORD.MASKS)) {state.record.masks.decrement();}
	if (0 !== (which & C.RECORD.ISOLATED)) {state.record.isolated.decrement();}
	if (0 !== (which & C.RECORD.ISOLATIONROOM)) {state.record.isolationRoom.decrement();}
	if (0 !== (which & C.RECORD.ISOLATIONHOME)) {state.record.isolationHome.decrement();}
	if (0 !== (which & C.RECORD.ISOLATIONOVERFLOW)) {state.record.isolationOverflow.decrement();}
	if (0 !== (which & C.RECORD.POSITIVE)) {state.record.positive.decrement();}
	if (0 !== (which & C.RECORD.TESTS)) {state.record.tests.decrement();}
	if (0 !== (which & C.RECORD.TRACE_TESTS)) {state.record.traceTests.decrement();}
	if (0 !== (which & C.RECORD.TRACE_POSITIVES)) {state.record.tracePositives.decrement();}
	if (0 !== (which & C.RECORD.RANDOM_TESTS)) {state.record.randomTests.decrement();}
	if (0 !== (which & C.RECORD.RANDOM_POSITIVES)) {state.record.randomPositives.decrement();}
	if (0 !== (which & C.RECORD.HOSPITAL_POSITIVES)) {state.record.hospitalPositives.decrement();}
	if (0 !== (which & C.RECORD.HOSPITAL_TESTS)) {state.record.hospitalTests.decrement();}

	if (which !== 0)
	{
		state.drawAllRecords();
	}
}

function recordReset(which)
{
	if (0 !== (which & C.RECORD.INFECTED)) {state.record.infected.reset();}
	if (0 !== (which & C.RECORD.INFECTIOUS)) {state.record.infectious.reset();}
	if (0 !== (which & C.RECORD.SICK)) {state.record.symptoms.reset();}
	if (0 !== (which & C.RECORD.HOMESICK)) {state.record.homeSick.reset();}
	if (0 !== (which & C.RECORD.WARDSICK)) {state.record.wardSick.reset();}
	if (0 !== (which & C.RECORD.ICUSICK)) {state.record.icuSick.reset();}
	if (0 !== (which & C.RECORD.DEAD)) {state.record.dead.reset();}
	if (0 !== (which & C.RECORD.HALLWAY)) {state.record.hallway.reset();}
	if (0 !== (which & C.RECORD.RECOVERED)) {state.record.recovered.reset();}
	if (0 !== (which & C.RECORD.WELL)) {state.record.well.reset();}
	if (0 !== (which & C.RECORD.INCUBATING)) {state.record.incubating.reset();}
	if (0 !== (which & C.RECORD.MASKS)) {state.record.masks.reset();}
	if (0 !== (which & C.RECORD.ISOLATED)) {state.record.isolated.reset();}
	if (0 !== (which & C.RECORD.ISOLATIONROOM)) {state.record.isolationRoom.reset();}
	if (0 !== (which & C.RECORD.ISOLATIONHOME)) {state.record.isolationHome.reset();}
	if (0 !== (which & C.RECORD.ISOLATIONOVERFLOW)) {state.record.isolationOverflow.reset();}
	if (0 !== (which & C.RECORD.POSITIVE)) {state.record.positive.reset();}
	if (0 !== (which & C.RECORD.TESTS)) {state.record.tests.reset();}
	if (0 !== (which & C.RECORD.TRACE_TESTS)) {state.record.traceTests.reset();}
	if (0 !== (which & C.RECORD.TRACE_POSITIVES)) {state.record.tracePositives.reset();}
	if (0 !== (which & C.RECORD.RANDOM_TESTS)) {state.record.randomTests.reset();}
	if (0 !== (which & C.RECORD.RANDOM_POSITIVES)) {state.record.randomPositives.reset();}
	if (0 !== (which & C.RECORD.HOSPITAL_POSITIVES)) {state.record.hospitalPositives.reset();}
	if (0 !== (which & C.RECORD.HOSPITAL_TESTS)) {state.record.hospitalTests.reset();}

	if (which !== 0)
	{
		state.drawAllRecords();
	}
}

function adjustDamage(cost)
{
	let result = 0;

	if (state.game)
	{
		result = cost * (1 - (state.interventionScore() / state.interventionMaxScore) * state.activeConfig.damage.scale);
	}

	return result;
}

function adjustIntervention(cost)
{
	let result = 0;

	if (state.game)
	{
		const total = state.record.symptoms.total;
		const factor = 1 - ((total / state.count) * state.activeConfig.intervention.scale);
		result = cost * factor;
	}

	return result;
}

function formatScore()
{
	return state.scoreFormat.format(state.getScore()) + "%";
}

function computeR()
{
// EXP((LN(Population/((1/(case[current]/(case[start]*Population)))-1)))/(current-start))
	const delta = state.record.infect.current - 1;
	const ratio = state.record.infect.current/(1*state.count)
	const r0 = Math.exp(Math.log(state.count/(1/ratio)-1)/delta)
	const factor = (state.count - state.record.infect.total) / state.record.infect.total;
	return {r0: r0, rt: r0 * factor};
}

function initialTime()
{
	const dayElement = document.getElementById('day');
	dayElement.textContent = "1";

	const nameElement = document.getElementById('name');
	nameElement.textContent = state.days[0];

	const hourElement = document.getElementById('hour');
	hourElement.textContent = state.startHour.toString().padStart(2, "0");

	const minuteElement = document.getElementById('minutes');
	minuteElement.textContent = "00";
}


function debug(argument) 
{
	if (state.debug) 
	{
		console.log(argument);
	}
}

function balanceTests()
{
	let total = state.record.tests.total;
	let random = state.record.randomTests.total;
	let hospital = state.record.hospitalTests.total;
	let trace = state.record.traceTests.total;

	if (random + hospital + trace !== total)
	{
		console.log("Tests out of balance", total, random, hospital, trace);
	}
}

function balancePositives()
{
	let total = state.record.positive.total;
	let random = state.record.randomPositives.total;
	let hospital = state.record.hospitalPositives.total;
	let trace = state.record.tracePositives.total;

	if (random + hospital + trace !== total)
	{
		console.log("Positives out of balance", total, random, hospital, trace);
	}
}

// function validate() 
// {
// 	let hallway = state.hallway;
// 	let wardPool = state.wardPool;
// 	let ward = state.ward;
// 	let icuPool = state.icuPool;
// 	let icu = state.icu;

// 	for (const person of state.personList)
// 	{
// 		if 
// 		(
// 			person.sickness() === C.WARDSICK 
// 			&& !(wardPool.has(person) 
// 			|| hospitalHas(ward, person) 
// 			|| ward.equals(person.toRoom) 
// 			)
// 		)
// 		{
// 			console.log("Ward sick person not in ward or ward pool");
// 		}

// 		if (person.sickness() === C.ICUSICK 
// 			&& !(icuPool.has(person) 
// 			|| hospitalHas(icu, person) 
// 			|| icu.equals(person.toRoom)
// 			|| ward.equals(person.toRoom) 
// 			|| hallway.equals(person.toRoom)
// 			))
// 		{
// 			console.log("ICU sick person not in ICU or ICU pool");
// 		}
// 	}

// 	for (const person of wardPool)
// 	{
// 		if (person.sickness() !== C.WARDSICK)
// 		{
// 			console.log("Person in ward pool not ward sick")
// 		}
// 	}

// 	for (const person of icuPool)
// 	{
// 		if (person.sickness() !== C.ICUSICK)
// 		{
// 			console.log("Person in ICU pool not ICU sick")
// 		}
// 	}
// }

// function hospitalHas(hospital, person)
// {
// 	let beds = hospital.rules.beds;

// 	let result = false;

// 	for (const bed of beds)
// 	{
// 		if (bed.personSet.has(person))
// 		{
// 			result = true;
// 			break;
// 		}
// 	}

// 	return result;
// }


