function show(name) 
{
	const element = document.getElementById(name);
	element.style.display = "block";
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

function toggleRun() 
{
	if (state.run)
	{
		setText("run", "Start")
		state.run = false;
	}
	else
	{
		setText("run", "Stop")
		state.run = true;
		state.past = null;
		document.getElementById("stepsize-controls").disabled = true;

		window.requestAnimationFrame(animate);
	}
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
	}
	else
	{
		state.setGame();
		document.getElementById("game-controls").disabled = false;
		gameHide("game-hide", true);
		gameHide("game-show", false);
		setText("mode", "Exposition");
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

function setSteps(steps) 
{
	state.stepsPerFrame = steps;
	setText("steps", state.stepsPerFrame.toString());
	state.setSteps(steps);
}

function setStepsize(seconds) 
{
	state.secondsPerTick = seconds;
	setText("stepsize", state.secondsPerTick.toString());
	state.setStepsize(seconds);
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
	state.setMaskLevel(C.MASKLEVEL.NONE);
}

function encourageMasks() 
{
	setText("masks", "Encourage");
	state.setMaskLevel(C.MASKLEVEL.ENCOURAGE);
}

function requireMasks() 
{
	setText("masks", "Require");
	state.setMaskLevel(C.MASKLEVEL.REQUIRE);
}

function enforceMasks() 
{
	setText("masks", "Enforce");
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

