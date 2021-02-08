

const canvas = document.getElementById('canvas');

var C = makeConstants();

var state = new TuneState(config, canvas.width, canvas.height);
state.fill(config);

function drawStats()
{
	const factor = document.getElementById('factor').getContext('2d');
	const other = document.getElementById('other').getContext('2d');
	const expose = document.getElementById('expose').getContext('2d');
	const pchart = document.getElementById('pchart').getContext('2d');

	state.drawStats(factor, other, expose, pchart);
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

function setSlightly()
{
	state.level = new MakeSlightly();
	showLevel();
}

function setVery()
{
	state.level = new MakeVery();
	showLevel();
}

function setExceedingly()
{
	state.level = new MakeExceedingly();
	showLevel();
}

function showLevel()
{
	const levelElement = document.getElementById('level');
	levelElement.textContent = state.level.name();
}

function showAll()
{
	showDistance();
	showLoud();
	showVentilation();
	showLevel();
}

function setInfectedAt(clock)
{
	const infectedAtElement = document.getElementById('infectedat');
	infectedAtElement.textContent = tickToHour(clock).toString();
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
