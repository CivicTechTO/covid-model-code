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
	const element = document.getElementById(name);
	element.textContent = text;
}

function start()
{
	state.run = true;

	window.requestAnimationFrame(animate);
}

function stop() 
{
	state.run = false;
}

function pickDisplay()
{
	hidePage("controls");
	hidePage("charts");
	showPage("display");
}

function pickControls() 
{
	hidePage("display");
	hidePage("charts");
	showPage("controls");
}

function pickCharts()
{
	hidePage("display");
	hidePage("controls");
	showPage("charts");
}

function setGame() 
{
	setText("type", "Game");
	show("game-controls");
}

function setExposition() 
{
	setText("type", "Exposition");
	hide("game-controls");
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

function closeWorship()
{
	setText("worship", "Closed");
}

function openWorship()
{
	setText("worship", "Open");
}

function closeRestaurants()
{
	setText("restaurants", "Closed");
}

function openRestaurants()
{
	setText("restaurants", "Open");
}

function closeBars()
{
	setText("bars", "Closed");
}

function openBars()
{
	setText("bars", "Open");
}

function closeClubs()
{
	setText("clubs", "Closed");
}

function openClubs()
{
	setText("clubs", "Open");
}

function closeSchools()
{
	setText("schools", "Closed");
}

function openSchools()
{
	setText("schools", "Open");
}

function closeOffices()
{
	setText("offices", "Closed");
}

function openOffices()
{
	setText("offices", "Open");
}

function closeMeat()
{
	setText("meat", "Closed");
}

function openMeat()
{
	setText("meat", "Open");
}

function closeGroceries()
{
	setText("groceries", "Closed");
}

function openGroceries()
{
	setText("groceries", "Open");
}

