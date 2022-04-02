class GameState extends TownState
{
	constructor(configuration, playGame)
	{
		super(configuration);

		this.game = false;
		this.score = 0;
		this.netScore = persistent.capitalSpec.value;
		this.scoreFormat = new Intl.NumberFormat(navigator.language, {maximumFractionDigits: 0});
		this.scoreDate = -1;

		this.masksSpec = this.activeConfig.masks.specs.none;
		this.testsSpec = this.activeConfig.tests.none;
		this.traceSpec = this.activeConfig.trace.specs.none;
		this.isolateSpec = this.activeConfig.isolate.none;

// Interventions all happen at 8AM

		this.useMasks = this.masksSpec.value;
		this.useTestsValue = this.testsSpec.value;
		this.useTraceValue = this.traceSpec.value;
		this.useIsolateValue = this.isolateSpec.value;

		this.roomButtons = [];
		this.useRoomState = [];

		this.interventionMaxScore = this.computeInterventionMaxScore();
		
		let graphedValues = this.activeConfig.graphedValues.illustration;
		if (playGame) graphedValues = this.activeConfig.graphedValues.game;

		if (document.getElementById (C.SLIDER))
  			this.chartList = new SliderCharts (this, graphedValues, C.SLIDER);
		else if (document.getElementById (C.CHART_DESCRIPTIONS.MOVING.id))
			this.chartList = new TwinCharts (this, graphedValues);
		else this.chartList = new SingleChart (this, graphedValues);

		this.run = true;
		this.past = null;
		this.animate = animate;

		this.setGame();

		this.trace = 
			{
				deferred: this.activeConfig.trace.deferred
				, forward: {from: this.activeConfig.trace.forward.from, to: this.activeConfig.trace.forward.to} 
				, backward: 
					{
						random: {from: this.activeConfig.trace.backward.random.from, to: this.activeConfig.trace.backward.random.to}
						, hospital: {from: this.activeConfig.trace.backward.hospital.from, to: this.activeConfig.trace.backward.hospital.to}
						, trace: {from: this.activeConfig.trace.backward.trace.from, to: this.activeConfig.trace.backward.trace.to}
					}
				, both: 
					{
						random: {from: this.activeConfig.trace.both.random.from, to: this.activeConfig.trace.both.random.to}
						, hospital: {from: this.activeConfig.trace.both.hospital.from, to: this.activeConfig.trace.both.hospital.to}
						, trace: {from: this.activeConfig.trace.both.trace.from, to: this.activeConfig.trace.both.trace.to}
					}
				, new: true
				, limit: 0
				, traceOnDay: []
				, testOnDay: []
			}
		
		this.debugPerson = false;
	}

	getMask()
	{
		return this.useMasksValue > Math.random();
	}

	isolateSickThis()
	{
		return this.useIsolateValue.sick > Math.random();
	}

	isolateHomeSickThis()
	{
		return this.useIsolateValue.homeSick > Math.random();
	}

	isolateTestThis(person)
	{
		return this.useIsolateValue.sick > 0.0;
	}

	testThis()
	{
		return this.useTestsValue.sample > Math.random();
	}

	isTesting()
	{
		return this.useTestsValue.sample != 0.0;
	}

	getTraceLimit()
	{
		return this.useTestsValue.trace.limit;
	}

	getTrace()
	{
		return this.useTraceValue;
	}

	setGame()
	{
		this.game = true;
		this.mode = persistent.displaySickSpec.value;
		this.animate = gameAnimate;

		this.setSecondsPerStep(persistent.secondsPerStepSpec.value);

		classShow("early-show", isEarly());
		classShow("game-show", true);

		gameOn(true);

		setText("limit", "/" + this.savedConfig.limit.toString());
		showInline("limit");
		showInline("score-block");		
	}

	fill()
	{
		super.fill();
		this.fillRoomTypes();
		this.fillRoomButtons();

		this.drawRoomButtons();
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
		this.fillWorkType(this.activeConfig.workType.factory, C.ROOMTYPE.FACTORY, C.WORKTYPE.FACTORY, C.TOOLTIPS.FACTORY, this.factoryList);
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
		this.roomButtons[C.ROOMTYPE.FACTORY] = new OpenButton("factory");
		this.roomButtons[C.ROOMTYPE.GROCERIES] = new OpenButton("groceries");
		this.roomButtons[C.ROOMTYPE.OUTSIDE] = new OpenButton("outside");
		this.roomButtons[C.ROOMTYPE.PARTIES] = new OpenButton("house");

		this.copyRoomButtons();
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
				this.wearMasks();

				this.setHistoryIndex();

				this.personList.forEach(person => person.resetHistory());
				this.roomList.forEach(room => room.resetHistory());

				this.getTrace().initialize();
	
				this.getTrace().newDay();

				this.evaluatePeople();
				this.personList.forEach(person => {if (person.randomTest()) this.getTrace().randomTrace(person)});

				this.getTrace().followup();

				this.scoreDate = today;
				this.setInterventions();
				
				this.score += adjustDamage(this.opportunityScore());
				this.score += adjustDamage(this.damageScore());
				this.score += adjustIntervention(this.interventionScore());
				
				this.netScore = persistent.capitalSpec.value - this.score;
				
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
			person.evaluateTested();
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
		result += this.isolateSpec.cost;

		return result;
	}
	
	maxScoreOthers()
	{
		let result = 0;

		result += this.activeConfig.masks.specs.enforce.cost;
		result += this.activeConfig.tests.heavy.cost;
		result += this.activeConfig.trace.specs.backward.cost;
		result += this.activeConfig.isolate.enforce.cost;

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
		result += !this.roomButtons[C.ROOMTYPE.FACTORY].get() ? scoreArray[C.ROOMTYPE.FACTORY] : 0;
//		result += !this.roomButtons[C.ROOMTYPE.GROCERIES].get() ? scoreArray[C.ROOMTYPE.GROCERIES] : 0;
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

    getScore ()
	{
        return (Math.max(0, this.netScore) / persistent.capitalSpec.value) * 100;
	}
	
	setInterventions()
	{
		this.useMasksValue = this.masksSpec.value;
		this.useIsolateValue = this.isolateSpec.value;
		this.useIsolateHomeSick = this.isolateSpec.homeSick;
		this.useTestsValue = this.testsSpec.value;
		this.useTraceValue = this.traceSpec.value;

		this.copyRoomButtons();
	}

	copyRoomButtons()
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

	wearMasks()
	{
		recordReset(C.RECORD.MASKS);

		for (const person of this.personList)
		{
			person.mask = this.getMask();

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
		this.roomButtons[C.ROOMTYPE.FACTORY].draw();
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

