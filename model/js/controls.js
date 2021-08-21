function show(name, type) 
{
	const element = document.getElementById(name);
	element.style.display = type;
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

function drawControls()
{
	drawPlay();
	drawRun();
	drawSpeed();

	drawMask();
	drawTest();
	drawTrace();
	drawIsolate();

	state.drawRoomstates();
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

function drawSpeed() 
{
	if (state.stepsPerFrame === choices.slow)
	{
		setText("speed", "Slow");
		setColour("speed", state.activeConfig.hotColour);
	}
	else
	{
		setText("speed", "Fast");
		setColour("speed", state.activeConfig.coldColour);
	}
}

function startGame() 
{
	runGame();

	drawControls();
}

function toggleRun() 
{
	state.run = !state.run;

	if (state.run)
	{
		state.past = null;
		window.requestAnimationFrame(state.animate);
	}

	drawControls();
}

function toggleSpeed() 
{
	const choices = state.activeConfig.stepsPerFrame;

	if (state.stepsPerFrame === choices.slow)
	{
		state.setSteps(choices.fast);
	}
	else
	{
		state.setSteps(choices.slow);
	}

	drawControls();
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

toggleRoomState(roomType)
{
	if (state.roomState[roomType])
	{
		state.roomState[roomType] = false;
	}
	else
	{
		state.roomState[roomType] = true;
	}

	drawControls();
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

