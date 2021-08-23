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
			runGame();
		}
		else
		{
			window.requestAnimationFrame(animate);
		}
	}
}

function runGame()
{
	destroyCharts();
	startup(true);
	startRunning();
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
				reportInfected();
				announceLost();
			}
			else
			{
				if (won())
				{
					reportInfected();
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

function startup(playGame)
{
	const canvas = document.getElementById('canvas');

	state = new GameState(makeConfig(), canvas.width, canvas.height, playGame);
	state.fill();
	state.initialize();

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
	if (0 !== (which & C.RECORD.INFECTOR)) {state.record.infector.increment();}
	if (0 !== (which & C.RECORD.INFECTEE)) {state.record.infectee.increment();}

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
	if (0 !== (which & C.RECORD.INFECTOR)) {state.record.infector.decrement();}
	if (0 !== (which & C.RECORD.INFECTEE)) {state.record.infectee.decrement();}

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
	if (0 !== (which & C.RECORD.INFECTOR)) {state.record.infector.reset();}
	if (0 !== (which & C.RECORD.INFECTEE)) {state.record.infectee.reset();}

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
	return state.scoreFormat.format(Math.max(0, state.netScore));
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

function debug(argument) 
{
	if (state.debug) 
	{
		console.log(argument);
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


