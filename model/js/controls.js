function show(name) 
{
	const element = document.getElementById(name);
	element.style.display = "block";
}

function showInline(name) 
{
	const element = document.getElementById(name);
	element.style.display = "inline-block";
}

function showGrid(name) 
{
	const element = document.getElementById(name);
	element.style.display = "grid";
}

function hide(name) 
{
	const element = document.getElementById(name);
	element.style.display = "none";
}

function showPage(name) 
{
	show(name);
	const tab = document.getElementById(name + "Choice");
	tab.style.backgroundColor =	"#87CEEB"
}

function hidePage(name) 
{
	hide(name);
	const tab = document.getElementById(name + "Choice");
	tab.style.backgroundColor =	"#77BEDB"
}

function setText(name, text) 
{
	document.getElementById(name).textContent = text;
}

function setColour(name, colour) 
{
	document.getElementById(name).style.backgroundColor = colour;
}

function copyColour(toElement, fromElement) 
{
	const colour = document.getElementById(fromElement).style.backgroundColor;
	document.getElementById(toElement).style.backgroundColor = colour;
}

function startGame() 
{
	state.game = true;
	document.getElementById("start-game").disabled = true;

	if (!state.run)
	{
		runGame();
	}
}

function toggleRun() 
{
	if (state.run)
	{
		stopRunning();
	}
	else
	{
		startRunning();
	}
}

function stopRunning()
{
	state.run = false;

	setText("run", "Run");
	setColour("run", state.activeConfig.coldColour);
}

function startRunning()
{
	state.run = true;
	state.past = null;

	setText("run", "Pause");
	setColour("run", state.activeConfig.hotColour);

	window.requestAnimationFrame(state.animate);
}

function toggleSpeed() 
{
	const choices = state.activeConfig.stepsPerFrame;

	if (state.stepsPerFrame === choices.slow)
	{
		showFast();
		state.setSteps(choices.fast);
	}
	else
	{
		showSlow();
		state.setSteps(choices.slow);
	}
}

function showFast() 
{
	setText("speed", "Slow");
	setColour("speed", state.activeConfig.hotColour);
}

function showSlow() 
{
	setText("speed", "Fast");
	setColour("speed", state.activeConfig.coldColour);
}

function gameHide(which, show)
{
	const hideList = document.getElementsByClassName(which);
	for (const element of hideList)
	{
		element.hidden = show;
	}
}

function pickDisplay()
{
	hidePage("charts");
	showPage("display");
}

function pickCharts()
{
	hidePage("display");
	showPage("charts");
}

function noMasks() 
{
	setText("masks", "None");
	setColour("masks", state.activeConfig.mask.colour.none);
	state.setMaskLevel(C.MASKLEVEL.NONE);
}

function encourageMasks() 
{
	setText("masks", "Encourage");
	setColour("masks", state.activeConfig.mask.colour.encourage);
	state.setMaskLevel(C.MASKLEVEL.ENCOURAGE);
}

function requireMasks() 
{
	setText("masks", "Require");
	setColour("masks", state.activeConfig.mask.colour.require);
	state.setMaskLevel(C.MASKLEVEL.REQUIRE);
}

function enforceMasks() 
{
	setText("masks", "Enforce");
	setColour("masks", state.activeConfig.mask.colour.enforce);
	state.setMaskLevel(C.MASKLEVEL.ENFORCE);
}

function noTest() 
{
	setText("test", "None");
	setColour("test", state.activeConfig.test.colour.none);
	state.setTest(C.TESTLEVEL.NONE);
}

function lightTest() 
{
	setText("test", "Light");
	setColour("test", state.activeConfig.test.colour.light);
	state.setTest(C.TESTLEVEL.LIGHT);
}

function heavyTest() 
{
	setText("test", "Heavy");
	setColour("test", state.activeConfig.test.colour.heavy);
	state.setTest(C.TESTLEVEL.HEAVY);
}

function noTrace() 
{
	setText("trace", "None");
	setColour("trace", state.activeConfig.trace.colour.none);
	state.setTrace(C.TRACE.NONE);
}

function forwardTrace() 
{
	setText("trace", "Forward");
	setColour("trace", state.activeConfig.trace.colour.forward);
	state.setTrace(C.TRACE.FORWARD);
}

function backwardTrace() 
{
	setText("trace", "Backward");
	setColour("trace", state.activeConfig.trace.colour.backward);
	state.setTrace(C.TRACE.BACKWARD);
}

function toggleIsolate() 
{
	if (state.isolate)
	{
		state.isolate = false;
		setText("isolate", "None");
		setColour("isolate", state.activeConfig.hotColour)
	}
	else
	{
		state.isolate = true;
		setText("isolate", "Isolating");
		setColour("isolate", state.activeConfig.coldColour)
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
	setText("score-text-win", "You have " + formatScore() + " political points remaining.");
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


function leftScreen()
{
	show("left");
	hide("right");
}

function rightScreen()
{
	show("right");
	hide("left");
}
