

const canvas = document.getElementById('canvas');

var C = makeConstants();

var state = new TuneState(makeConfig(), canvas.width, canvas.height);
state.fill();

function drawStats()
{
	const factor = document.getElementById('factor').getContext('2d');
	const increment = document.getElementById('increment').getContext('2d');
	const other = document.getElementById('other').getContext('2d');
	const expose = document.getElementById('expose').getContext('2d');
	const pchart = document.getElementById('pchart').getContext('2d');

	state.drawStats(factor, increment, other, expose, pchart);
}

function incrementDistance(value)
{
	state.distance += value;
	showDistance();
}

function showDistance()
{
	const distanceElement = document.getElementById('distance');
	distanceElement.textContent = state.distance.toString();
}

function setVentilation(value)
{
	state.tune.ventilation = value;
	showVentilation();
}

function showVentilation() 
{
	const ventilationElement = document.getElementById('ventilation');
	ventilationElement.textContent = state.tune.ventilation.toString();
}

function setLoud(value)
{
	state.tune.loud = value;
	showLoud();
}

function showLoud()
{
	const loudElement = document.getElementById('loud');
	loudElement.textContent = state.tune.loud.toString();
}

function slightly()
{
	return {name: "Slightly", value: state.infectious.valueList[C.INFECTIOUS.SLIGHTLY]}
}

function setSlightly()
{
	state.level = slightly();
	showLevel();
}

function very()
{
	return {name: "Very", value: state.infectious.valueList[C.INFECTIOUS.VERY]};
}

function setVery()
{
	state.level = very();
	showLevel();
}

function exceedingly()
{
	return {name: "Exceedingly", value: state.infectious.valueList[C.INFECTIOUS.EXCEEDINGLY]};
}

function setExceedingly()
{
	state.level = exceedingly();
	showLevel();
}

function showLevel()
{
	const levelElement = document.getElementById('level');
	levelElement.textContent = state.level.name;
}

function toggle()
{
	state.infecting = ! state.infecting;
	showToggle();
}

function showToggle()
{
	const toggleElement = document.getElementById('infecting');

	if (state.infecting)
	{
		toggleElement.textContent = 'Yes';
	}
	else
	{
		toggleElement.textContent = 'No';
	}
}

function showAll()
{
	showDistance();
	showLoud();
	showVentilation();
	showLevel();
	showToggle();
}

function setInfectedAt(clock)
{
	const infectedAtElement = document.getElementById('infectedat');
	infectedAtElement.textContent = state.tickToHour(clock).toString();
}

function reset() 
{
	const infectedAtElement = document.getElementById('infectedat');
	infectedAtElement.textContent = 'Not';

	showAll();
	state.start();
}

function start()
{
	showAll();
	state.run = true;

	window.requestAnimationFrame(tuneAnimate);
}

function stop() 
{
	state.run = false;
}

function tuneAnimate(timestamp)
{
	let deltaT = (past ? timestamp - past : FRAME);
	past = timestamp;
	stepCount = Math.max(state.stepsPerFrame, Math.round(deltaT / FRAME));

	for (var i = 0; i < stepCount; i++) 
	{
		state.step();
	}

	draw();
	drawStats();

	if (state.run)
	{
		window.requestAnimationFrame(tuneAnimate);
	}
}

// let context = canvas.getContext('2d');

// state.draw(context);

showAll();
window.requestAnimationFrame(tuneAnimate);

// for (var i = 2; i >= 0; i--) 
// {
//  	state.step(FRAME);
// }

// draw();
// drawStats();
