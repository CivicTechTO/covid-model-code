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
		this.roomState = [];
		this.useRoomState = [];
//		this.maskLevel = C.MASKLEVEL.NONE;

		this.interventionMaxScore = this.computeInterventionMaxScore();
		this.chartList = initializeCharts ()

		this.run = true;
		this.past = null;
		this.animate = animate;

		if (playGame)
		{
			this.setGame();
		}
	}

	setGame()
	{
		this.game = true;
		this.mode = 1;
		this.animate = gameAnimate;

		this.setStepsize(this.activeConfig.secondsPerTick.large);

		document.getElementById("game-controls").disabled = false;
		gameHide("game-hide", true);
		gameHide("game-show", false);

		setText("limit", "/" + state.savedConfig.limit.toString());
		showInline("limit");
		showInline("score-block");		
	}

	setExposition()
	{
		this.game = false;
		this.mode = 0;
	}
	
	setMaskLevel(level)
	{
		this.maskLevel = level;
	}

	fill()
	{
		super.fill();
		this.fillRoomTypes();
		this.fillRoomState();

		this.drawRoomstates();
		noMasks();
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
		this.fillWorkType(this.activeConfig.workType.meat, C.ROOMTYPE.MEAT, C.WORKTYPE.MEAT);
		this.fillWorkType(this.activeConfig.workType.office, C.ROOMTYPE.OFFICES, C.WORKTYPE.OFFICES);
		this.fillWorkType(this.activeConfig.workType.school, C.ROOMTYPE.SCHOOLS, C.WORKTYPE.SCHOOLS);
	}

	fillWorkType(config, type, workType)
	{
		for (var i = config.start; i <= config.end; i++) 
		{
			this.workList[i].roomType = type;
			this.workList[i].fillStyle = state.activeConfig.workStyle[workType];
		}
	}

	fillAType(roomList, type)
	{
		for (let room of roomList)
		{
			room.roomType = type;
		}
	}

	fillRoomState()
	{
		this.roomState[C.ROOMTYPE.OPEN] = true;
		this.roomState[C.ROOMTYPE.WORSHIP] = true;
		this.roomState[C.ROOMTYPE.RESTAURANTS] = true;
		this.roomState[C.ROOMTYPE.BARS] = true;
		this.roomState[C.ROOMTYPE.CLUBS] = true;
		this.roomState[C.ROOMTYPE.SCHOOLS] = true;
		this.roomState[C.ROOMTYPE.OFFICES] = true;
		this.roomState[C.ROOMTYPE.MEAT] = true;
		this.roomState[C.ROOMTYPE.GROCERIES] = true;
		this.roomState[C.ROOMTYPE.OUTSIDE] = true;
		this.roomState[C.ROOMTYPE.PARTIES] = true;

		this.copyRoomState();
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

		result += this.maxScoreRoomState();
		result += this.maxScoreOthers();

		return result;
	}

	interventionScore()
	{
		let result = 0;

		result += this.scoreRoomState();
		result += this.scoreOthers();

		return result;
	}

	scoreOthers()
	{
		const intervention = state.activeConfig.intervention;
		let result = 0;

		result += intervention.mask[this.maskLevel];

		return result;
	}
	
	maxScoreOthers()
	{
		const intervention = this.activeConfig.intervention;
		let result = 0;

		result += Math.max(... intervention.mask);

		return result;
	}
	
	scoreRoomState()
	{
		let result = 0;
		const scoreArray = this.activeConfig.intervention.room;

		result += !this.roomState[C.ROOMTYPE.OPEN] ? scoreArray[C.ROOMTYPE.OPEN] : 0;
		result += !this.roomState[C.ROOMTYPE.WORSHIP] ? scoreArray[C.ROOMTYPE.WORSHIP] : 0;
		result += !this.roomState[C.ROOMTYPE.RESTAURANTS] ? scoreArray[C.ROOMTYPE.RESTAURANTS] : 0;
		result += !this.roomState[C.ROOMTYPE.BARS] ? scoreArray[C.ROOMTYPE.BARS] : 0;
		result += !this.roomState[C.ROOMTYPE.CLUBS] ? scoreArray[C.ROOMTYPE.CLUBS] : 0;
		result += !this.roomState[C.ROOMTYPE.SCHOOLS] ? scoreArray[C.ROOMTYPE.SCHOOLS] : 0;
		result += !this.roomState[C.ROOMTYPE.OFFICES] ? scoreArray[C.ROOMTYPE.OFFICES] : 0;
		result += !this.roomState[C.ROOMTYPE.MEAT] ? scoreArray[C.ROOMTYPE.MEAT] : 0;
		result += !this.roomState[C.ROOMTYPE.GROCERIES] ? scoreArray[C.ROOMTYPE.GROCERIES] : 0;
		result += !this.roomState[C.ROOMTYPE.OUTSIDE] ? scoreArray[C.ROOMTYPE.OUTSIDE] : 0;
		result += !this.roomState[C.ROOMTYPE.PARTIES] ? scoreArray[C.ROOMTYPE.PARTIES] : 0;

		return result;
	}

	maxScoreRoomState()
	{
		const scoreArray = this.activeConfig.intervention.room;
		const sum = (accumulator, currentValue) => accumulator + currentValue;

		return scoreArray.reduce(sum);
	}

	setInterventions()
	{
		this.copyRoomState();
		this.setMasks();
	}

	copyRoomState()
	{
		for (var i = this.roomState.length - 1; i >= 0; i--) 
		{
			this.useRoomState[i] = this.roomState[i];
		}
	}

	getRoomState(roomType)
	{
		return this.useRoomState[roomType];
	}

	toggleRoomState(roomType)
	{
		if (this.roomState[roomType])
		{
			this.roomState[roomType] = false;
		}
		else
		{
			this.roomState[roomType] = true;
		}
		this.drawRoomstates();
	}

	setMasks()
	{
		recordReset(C.RECORD.MASKS | C.RECORD.INFECTOR | C.RECORD.INFECTEE);

		for (const person of this.personList)
		{
			person.mask = Math.random() < this.activeConfig.mask.chance[this.maskLevel];
			if (person.mask)
			{
				recordIncrement(C.RECORD.MASKS);
			}
		}
	}

	drawState(elementName, roomType)
	{
		if (this.roomState[roomType])
		{
			setText(elementName, "Close");
			setColour(elementName, state.activeConfig.closedColour);
		}
		else
		{
			setText(elementName, "Open");
			setColour(elementName, state.activeConfig.openColour);
		}
	}

	drawRoomstates()
	{
		this.drawState("worship", C.ROOMTYPE.WORSHIP);
		this.drawState("restaurants", C.ROOMTYPE.RESTAURANTS);
		this.drawState("bars", C.ROOMTYPE.BARS);
		this.drawState("clubs", C.ROOMTYPE.CLUBS);
		this.drawState("schools", C.ROOMTYPE.SCHOOLS);
		this.drawState("offices", C.ROOMTYPE.OFFICES);
		this.drawState("meat", C.ROOMTYPE.MEAT);
//		this.drawState("groceries", C.ROOMTYPE.GROCERIES);
		this.drawState("outside", C.ROOMTYPE.OUTSIDE);
		this.drawState("parties", C.ROOMTYPE.PARTIES);
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

