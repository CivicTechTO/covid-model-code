
var C = makeConstants();
var config = makeConfig();
var state;
var persistent = 
	{
		startSpec: config.startState.infected
		, capitalSpec: config.capital.high
		, displaySickSpec: config.displaySick.late
		, gameStarted: false
	};

connectTooltips();
connectRooms();

setup(config, false);

