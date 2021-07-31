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

function toggleMode() 
{
	if (state.game)
	{
		state.setExposition();

		document.getElementById("game-controls").disabled = true;
		gameHide("game-hide", false);
		gameHide("game-show", true);
		setText("mode", "Game");
		setColour("mode", state.activeConfig.coldColour);

		hide("limit");
	}
	else
	{
		state.setGame();
		
		document.getElementById("game-controls").disabled = false;
		gameHide("game-hide", true);
		gameHide("game-show", false);
		setText("mode", "Exposition");
		setColour("mode", state.activeConfig.hotColour);

		setText("limit", "/" + state.savedConfig.limit.toString());
		showInline("limit");
		showInline("score-block");		
	}
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

function toggleStep() 
{
	const choices = state.activeConfig.secondsPerTick;

	if (state.secondsPerTick === choices.small)
	{
		setText("stepsize", "Small");
		setColour("stepsize", state.activeConfig.hotColour);
		state.setStepsize(choices.large);
	}
	else
	{
		setText("stepsize", "Large");
		setColour("stepsize", state.activeConfig.coldColour);
		state.setStepsize(choices.slow);
	}
}

function gameHide(which, show)
{
	const hideList = document.getElementsByClassName(which);
	for (const element of hideList)
	{
		element.hidden = show;
	}
}

// function setSteps(steps) 
// {
// 	state.stepsPerFrame = steps;
// 	setText("steps", state.stepsPerFrame.toString());
// 	state.setSteps(steps);
// }

// function setStepsize(seconds) 
// {
// 	state.secondsPerTick = seconds;
// 	setText("stepsize", state.secondsPerTick.toString());
// 	state.setStepsize(seconds);
// }

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
}

function lightTest() 
{
	setText("test", "Light");
}

function heavyTest() 
{
	setText("test", "Heavy");
}

function noTrace() 
{
	setText("trace", "None");
}

function forwardTrace() 
{
	setText("trace", "Forward");
}

function backwardTrace() 
{
	setText("trace", "Backward");
}

function noIsolate() 
{
	setText("isolate", "None");
}

function homeIsolate() 
{
	setText("isolate", "At Home");
}

function onePublic() 
{
	setText("isolate", "One Public");
}

function twoPublic() 
{
	setText("isolate", "Two Public");
}

