class GameState extends TownState
{
	constructor(configuration, width, height, playGame)
	{
		super(configuration, width, height);

		this.game = false;
		this.score = 0;
		this.netScore = this.activeConfig.startScore;
		this.scoreFormat = new Intl.NumberFormat(navigator.language, {maximumFractionDigits: 0});
		this.scoreDate = -1;

		this.masksSpec = this.activeConfig.masks.specs.none;
		this.testsSpec = this.activeConfig.tests.none;
		this.traceSpec = this.activeConfig.trace.none;

// Interventions all happen at 8AM

		this.useMasks = this.masksSpec.value;
		this.useTests = this.testsSpec.value;
		this.useTrace = this.traceSpec.value;
		this.useIsolate = false;
		this.roomButtons = [];
		this.useRoomState = [];

		this.interventionMaxScore = this.computeInterventionMaxScore();
		this.chartList = initializeCharts ();

		this.run = true;
		this.past = null;
		this.animate = animate;

		if (playGame)
		{
			this.setGame();
		}
		else
		{
			this.notGame();
		}
	}

	getMasks()
	{
		return this.useMasks;
	}

	getIsolate()
	{
		return this.useIsolate;
	}

	getTests()
	{
		return this.useTests;
	}

	isTesting()
	{
		return this.useTests.value != this.activeConfig.tests.value;
	}

	getTrace()
	{
		return this.useTrace;
	}

	notGame()
	{
		this.game = false;
		this.mode = 0;
		this.animate = animate;

		this.setSecondsPerStep(this.activeConfig.secondsPerStep.small);

		document.getElementById("game-controls").disabled = true;
		gameHide("game-hide", false);
		gameHide("game-show", true);
	}

	setGame()
	{
		this.game = true;
		this.mode = 1;
		this.animate = gameAnimate;

		this.setSecondsPerStep(this.activeConfig.secondsPerStep.large);

		document.getElementById("game-controls").disabled = false;
		gameHide("game-hide", true);
		gameHide("game-show", false);

		setText("limit", "/" + state.savedConfig.limit.toString());
		showInline("limit");
		showInline("score-block");		
	}

	fill()
	{
		super.fill();
		this.fillRoomTypes();
		this.fillRoomButtons();
		this.fillIsolate();

		this.drawRoomButtons();
	}

	fillIsolate()
	{
		const yesColour = this.activeConfig.hotColour;
		const noColour = this.activeConfig.coldColour;
		this.isolationButton = new BooleanButton("isolate", drawControls, yesColour, noColour, false); 
	}


	fillRoomTypes()
	{
		this.fillAType(this.dwellingList, C.ROOMTYPE.PARTIES);
		this.fillAType(this.churchList, C.ROOMTYPE.WORSHIP);
		this.fillAType(this.restaurantList, C.ROOMTYPE.RESTAURANTS);
		this.fillAType(this.pubList, C.ROOMTYPE.BARS);
		this.fillAType(this.clubList, C.ROOMTYPE.CLUBS);
		this.fillAType(this.outsideList, C.ROOMTYPE.OUTSIDE);

		this.fillWorkListType();
	}

	fillWorkListType()
	{
		this.fillWorkType(this.activeConfig.workType.meat, C.ROOMTYPE.MEAT, C.WORKTYPE.MEAT, C.TOOLTIPS.MEAT, this.meatList);
		this.fillWorkType(this.activeConfig.workType.office, C.ROOMTYPE.OFFICES, C.WORKTYPE.OFFICES, C.TOOLTIPS.OFFICES, this.officeList);
		this.fillWorkType(this.activeConfig.workType.school, C.ROOMTYPE.SCHOOLS, C.WORKTYPE.SCHOOLS, C.TOOLTIPS.SCHOOLS, this.schoolList);
	}

	fillWorkType(config, type, workType, tooltip, list)
	{
		for (var i = config.start; i <= config.end; i++) 
		{
			let room = this.workList[i];
			
			room.roomType = type;
			room.fillStyle = state.activeConfig.workStyle[workType];
			room.tooltip = tooltip;

			list.push(room);
		}
	}

	fillAType(roomList, type)
	{
		for (let room of roomList)
		{
			room.roomType = type;
		}
	}

	fillRoomButtons()
	{
		this.roomButtons[C.ROOMTYPE.OPEN] = new OpenButton("");
		this.roomButtons[C.ROOMTYPE.WORSHIP] = new OpenButton("worship");
		this.roomButtons[C.ROOMTYPE.RESTAURANTS] = new OpenButton("restaurants");
		this.roomButtons[C.ROOMTYPE.BARS] = new OpenButton("bars");
		this.roomButtons[C.ROOMTYPE.CLUBS] = new OpenButton("clubs");
		this.roomButtons[C.ROOMTYPE.SCHOOLS] = new OpenButton("schools");
		this.roomButtons[C.ROOMTYPE.OFFICES] = new OpenButton("offices");
		this.roomButtons[C.ROOMTYPE.MEAT] = new OpenButton("meat");
		this.roomButtons[C.ROOMTYPE.GROCERIES] = new OpenButton("groceries");
		this.roomButtons[C.ROOMTYPE.OUTSIDE] = new OpenButton("outside");
		this.roomButtons[C.ROOMTYPE.PARTIES] = new OpenButton("parties");

		this.copyroomButtons();
	}

	step()
	{
		super.step();

		const today = this.tickToDay(this.clock);

		if (today !== this.scoreDate)
		{
			const now = this.tickToHour(this.clock);

			if (this.activeConfig.game.update > now % 24)
			{
				this.evaluatePeople();

				this.scoreDate = today;
				this.setInterventions();
				
				this.score += adjustDamage(this.opportunityScore());
				this.score += adjustDamage(this.damageScore());
				this.score += adjustIntervention(this.interventionScore());
				
				this.netScore = this.activeConfig.startScore - this.score;
				
				this.showScore();

				atNewDay();
			}
		}

	}

	evaluatePeople()
	{
		for (let person of this.personList)
		{
			person.evaluateIsolate();
			person.evaluatePositive();
		}
	}

	opportunityScore()
	{
		const opportunity = this.activeConfig.damage.opportunity;
		return Math.pow(this.record.hallway.current * opportunity.amount, opportunity.exponent);
	}

	damageScore()
	{
		const out = this.activeConfig.damage.out;
		const hallway = this.activeConfig.damage.hallway;
		const icu = this.activeConfig.damage.icu;
		const ward = this.activeConfig.damage.ward;
		
		let result = 0;

		for (const person of this.personList)
		{
			if (person.inICU())
			{
				result += icu[person.sickness()];
			}
			else
			{
				if (person.inWard())
				{
					result += ward[person.sickness()];
				}
				else
				{
					if (person.inHallway())
					{
						result += hallway[person.sickness()];
					}
					else
					{
						result += out[person.sickness()];
					}
				}
			}
		}

		return result;
	}

	computeInterventionMaxScore()
	{
		let result = 0;

		result += this.maxScoreroomButtons();
		result += this.maxScoreOthers();

		return result;
	}

	interventionScore()
	{
		let result = 0;

		result += this.scoreroomButtons();
		result += this.scoreOthers();

		return result;
	}

	scoreOthers()
	{
		let result = 0;

		result += this.masksSpec.cost;
		result += this.testsSpec.cost;
		result += this.traceSpec.cost;

		return result;
	}
	
	maxScoreOthers()
	{
		let result = 0;

		result += this.activeConfig.masks.specs.enforce.cost;
		result += this.activeConfig.tests.heavy.cost;
		result += this.activeConfig.trace.backward.cost;

		return result;
	}
	
	scoreroomButtons()
	{
		let result = 0;
		const scoreArray = this.activeConfig.intervention.room;

		result += !this.roomButtons[C.ROOMTYPE.OPEN].get() ? scoreArray[C.ROOMTYPE.OPEN] : 0;
		result += !this.roomButtons[C.ROOMTYPE.WORSHIP].get() ? scoreArray[C.ROOMTYPE.WORSHIP] : 0;
		result += !this.roomButtons[C.ROOMTYPE.RESTAURANTS].get() ? scoreArray[C.ROOMTYPE.RESTAURANTS] : 0;
		result += !this.roomButtons[C.ROOMTYPE.BARS].get() ? scoreArray[C.ROOMTYPE.BARS] : 0;
		result += !this.roomButtons[C.ROOMTYPE.CLUBS].get() ? scoreArray[C.ROOMTYPE.CLUBS] : 0;
		result += !this.roomButtons[C.ROOMTYPE.SCHOOLS].get() ? scoreArray[C.ROOMTYPE.SCHOOLS] : 0;
		result += !this.roomButtons[C.ROOMTYPE.OFFICES].get() ? scoreArray[C.ROOMTYPE.OFFICES] : 0;
		result += !this.roomButtons[C.ROOMTYPE.MEAT].get() ? scoreArray[C.ROOMTYPE.MEAT] : 0;
		result += !this.roomButtons[C.ROOMTYPE.GROCERIES].get() ? scoreArray[C.ROOMTYPE.GROCERIES] : 0;
		result += !this.roomButtons[C.ROOMTYPE.OUTSIDE].get() ? scoreArray[C.ROOMTYPE.OUTSIDE] : 0;
		result += !this.roomButtons[C.ROOMTYPE.PARTIES].get() ? scoreArray[C.ROOMTYPE.PARTIES] : 0;

		return result;
	}

	maxScoreroomButtons()
	{
		const scoreArray = this.activeConfig.intervention.room;
		const sum = (accumulator, currentValue) => accumulator + currentValue;

		return scoreArray.reduce(sum);
	}

	setInterventions()
	{
		this.useMasks = this.masksSpec.value;
		this.useIsolate = this.isolationButton.get();
		this.useTests = this.testsSpec.value;
		this.useTrace = this.traceSpec.value;
		this.copyroomButtons();
	}

	copyroomButtons()
	{
		for (var i = this.roomButtons.length - 1; i >= 0; i--) 
		{
			this.useRoomState[i] = this.roomButtons[i].get();
		}
	}

	getRoomState(roomType)
	{
		return this.useRoomState[roomType];
	}

	setMasks()
	{
		recordReset(C.RECORD.MASKS | C.RECORD.INFECTOR | C.RECORD.INFECTEE);

		for (const person of this.personList)
		{
			person.mask = Math.random() < this.masksSpec.value;

			if (person.mask)
			{
				recordIncrement(C.RECORD.MASKS);
			}
		}
	}

	drawRoomButtons()
	{
		this.roomButtons[C.ROOMTYPE.WORSHIP].draw();
		this.roomButtons[C.ROOMTYPE.RESTAURANTS].draw();
		this.roomButtons[C.ROOMTYPE.BARS].draw();
		this.roomButtons[C.ROOMTYPE.CLUBS].draw();
		this.roomButtons[C.ROOMTYPE.SCHOOLS].draw();
		this.roomButtons[C.ROOMTYPE.OFFICES].draw();
		this.roomButtons[C.ROOMTYPE.MEAT].draw();
//		this.roomButtons[C.ROOMTYPE.GROCERIES].draw();
		this.roomButtons[C.ROOMTYPE.OUTSIDE].draw();
		this.roomButtons[C.ROOMTYPE.PARTIES].draw();
	}

	showScore()
	{
		if (this.game)
		{
			setText("score", formatScore());		
			showInline("score-block");	
		}
	}
}

// ???

// function getIsolate()
// {
// 	state.getIsolate();
// }

// function setIsolate(value)
// {
// 	state.setIsolate(value);
// }
