function show(name, type) 
{
	const element = document.getElementById(name);
	element.style.display = type;

	return element;
}

function showInline(name) 
{
	show(name, "inline-block");
}

function showGrid(name) 
{
	show(name, "grid");
}

function hide(name) 
{
	const element = document.getElementById(name);
	element.style.display = "none";
}

function classShow(which, show)
{
	const hideList = document.getElementsByClassName(which);
	for (const element of hideList)
	{
		element.hidden = !show;
	}
}

function gameOn(isGame)
{
	document.getElementById("in-game-controls").disabled = !isGame;
}

function hideClass(which)
{
	const hideList = document.getElementsByClassName(which);
	for (const element of hideList)
	{
		element.style.display = "none";
	}
}

function setText(name, text) 
{
	document.getElementById(name).textContent = text;
}

function setColour(name, colour) 
{
	document.getElementById(name).style.backgroundColor = colour;
}

function setSource(name, source) 
{
	document.getElementById(name).src = source;
}

function setDisabled(name, disabled)
{
	document.getElementById(name).disabled = disabled;
}

function drawValue(name, spec)
{
	setText(name, spec.label);
	setColour(name, spec.colour);
}

function restack(element)
{
	element.style.zIndex = state.maxZ++;

	return element;
}

function drawControls()
{
//	drawPlay();
//	drawRun();
	drawSpeed();

	drawStart();
	drawCapital();
	drawDisplaySick();

	drawMasks();
	drawTests();
	drawTrace();
	drawIsolate();

	state.drawRoomButtons();
}

function drawRun()
{
	if (state.run)
	{
		setText("run", "Pause");
		setColour("run", state.activeConfig.hotColour);
	}
	else
	{
		setText("run", "Run");
		setColour("run", state.activeConfig.coldColour);
	}
}

function launch(game) 
{
	hide("run-box");
	setText("what-is-running", game ? "The game" : "The simulation")
	persistent.gameStarted = game;

	newGame(game);
	drawControls();
	startRunning();
}

function startRunning()
{
	drawControls();
	
	state.past = null;
	window.requestAnimationFrame(state.animate);
}

function stop() 
{
	state.run = false;
}

function setSpeed(spec)
{
	state.speedSpec = spec;

	drawControls();
}

function setStart(spec)
{
	persistent.startSpec = spec;

	drawControls();
}

function drawStart()
{
	drawValue("starting", persistent.startSpec);
}

function setCapital(spec)
{
	persistent.capitalSpec = spec;

	drawControls();
}

function drawCapital()
{
	drawValue("capital", persistent.capitalSpec);
}

function drawDisplaySick()
{
	drawValue("display-sick", persistent.displaySickSpec);
}

function setDisplaySick(spec)
{
	persistent.displaySickSpec = spec;

	drawControls();
}

function drawSpeed() 
{
	drawValue("speed", state.speedSpec);
}


function setMasks(spec)
{
	state.masksSpec = spec;

	drawControls();
}

function drawMasks() 
{
	drawValue("masks", state.masksSpec);
}

function setTests(spec)
{
	state.testsSpec = spec;

	if (spec.value.trace.test == 0.0)
	{
		setTrace(state.activeConfig.trace.specs.none);
	}

	drawControls();
}

function drawTests() 
{
	drawValue("tests", state.testsSpec);
	setDisabled("depends-on-tests", state.testsSpec.value.trace.test == 0.0);
}

function setTrace(spec)
{
	if (spec !== state.traceSpec)
	{
		state.traceSpec = spec;
		state.trace.new = true;
	}

	drawControls();
}

function drawTrace() 
{
	drawValue("trace", state.traceSpec);
}

function setIsolate(spec)
{
	state.isolateSpec = spec;

	drawControls();
}

function drawIsolate() 
{
	drawValue("isolate", state.isolateSpec);
}

class OpenButton extends BooleanButton
{
	constructor(name)
	{
		super(name, drawControls, state.activeConfig.openColour, state.activeConfig.closedColour, true);
	}
}

function announceLost()
{
	let lostChart = state.chartList.getLostChart ();
	state.announce = "announce-lose";
	setText("score-text-lose", "You survived " + state.tickToDay(state.clock) + " days.");
	showGrid("announce-outer");
	showGrid("announce-lose");
	// !!! lostChart.display ();
	disableControls(true);
}

function announceWon() 
{
	let wonChart = state.chartList.getWonChart ();
	state.announce = "announce-win";
	setText("score-text-win", "You have " + formatScore() + " of your political capital remaining.");
	showGrid("announce-outer");
	showGrid("announce-win");
	// !!! wonChart.display ();
	disableControls(true)
}

function ok()
{
	persistent.gameStarted = false;
	
	hide(state.announce);
	hide("announce-outer");
	disableControls(false);
	gameOn(false);
	runNothing();
}

function disableControls(disable) 
{
	document.getElementById("lower-controls").disabled = disable;
}
