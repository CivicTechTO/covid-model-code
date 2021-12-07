
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

connectRooms();

startup(config, false);

startRunning();

// let context = canvas.getContext('2d');
//draw(context);

// state.step();

// setSteps(1000);

// for (var i = 100000; i >= 0; i--) 
// {
// 	state.step(FRAME);
// }
