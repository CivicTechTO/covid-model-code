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

		window.requestAnimationFrame(animate);
	}
}

function toggleMode() 
{
	if (state.game)
	{
		state.setExposition();
		document.getElementById("game-controls").disabled = true;
		setText("mode", "Game");
	}
	else
	{
		state.setGame();
		document.getElementById("game-controls").disabled = false;
		setText("mode", "Exposition");
	}
}

function setSteps(steps) 
{
	state.stepsPerFrame = steps;
	setText("steps", state.stepsPerFrame.toString());
}

function setStepsize(seconds) 
{
	state.realTick = seconds;
	setText("stepsize", state.realTick.toString());
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
}

function encourageMasks() 
{
	setText("masks", "Encourage");
}

function requireMasks() 
{
	setText("masks", "Require");
}

function enforceMasks() 
{
	setText("masks", "Enforce");
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

