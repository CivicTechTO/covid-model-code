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

function gameHide(which, show)
{
	const hideList = document.getElementsByClassName(which);
	for (const element of hideList)
	{
		element.hidden = show;
	}
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
	drawPlay();
	drawRun();
	drawSpeed();

	drawMasks();
	drawTests();
	drawTrace();
	drawIsolate();

	state.drawRoomButtons();
}

function drawPlay()
{
	if (state.game)
	{
		document.getElementById("start-game").disabled = true;
	}
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

function startGame() 
{
	drawControls();
	runGame();
}

function startRunning()
{
	drawControls();
	
	state.past = null;
	window.requestAnimationFrame(state.animate);
}

function toggleRun() 
{
	state.run = !state.run;

	if (state.run)
	{
		startRunning();
	}

	drawControls();
}

function setSpeed(spec)
{
	state.speedSpec = spec;

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
	state.announce = "announce-lose";
	setText("score-text-lose", "You survived " + state.tickToDay(state.clock) + " days.");
	showGrid("announce-outer");
	showGrid("announce-lose");
	document.getElementById("all-controls").disabled = true;
}

function announceWon() 
{
	state.announce = "announce-win";
	setText("score-text-win", "You have " + formatScore() + " of your political capital remaining.");
	showGrid("announce-outer");
	showGrid("announce-win");
	document.getElementById("all-controls").disabled = true;
}

function quit()
{
	hide(state.announce);
	hide("announce-outer");
	document.getElementById("all-controls").disabled = false;
}

function play()
{
	hide(state.announce);
	hide("announce-outer");
	document.getElementById("all-controls").disabled = false;
	runGame();
}

