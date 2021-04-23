class GameState extends TownState
{
	constructor(config, width, height)
	{
		super(config, width, height);

		this.game = false;
		this.scoreDate = -1;
		this.roomState = [];
		this.useRoomState = [];
	}

	setGame()
	{
		this.game = true;
	}

	setExposition()
	{
		this.game = false;
	}
	
	fill()
	{
		super.fill();
		this.fillRoomTypes();
		this.fillRoomState();
	}

	fillRoomTypes()
	{
		this.fillAType(this.churchList, C.ROOMTYPE.WORSHIP);
		this.fillAType(this.restaurantList, C.ROOMTYPE.RESTAURANTS);
		this.fillAType(this.pubList, C.ROOMTYPE.BARS);
		this.fillAType(this.clubList, C.ROOMTYPE.CLUBS);
		this.fillAType(this.outsideList, C.ROOMTYPE.OUTSIDE);

		this.fillWorkListType();
	}

	fillWorkListType()
	{
		this.fillWorkType(this.config.workType.meat, C.ROOMTYPE.MEAT);
		this.fillWorkType(this.config.workType.office, C.ROOMTYPE.OFFICES);
		this.fillWorkType(this.config.workType.school, C.ROOMTYPE.SCHOOLS);
	}

	fillWorkType(config, type)
	{
		for (var i = config.start; i <= config.end; i++) 
		{
			this.workList[i].roomType = type;
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

		this.copyRoomState();
	}

	copyRoomState()
	{
		for (var i = this.roomState.length - 1; i >= 0; i--) 
		{
			this.useRoomState[i] = this.roomState[i];
		}
	}

	step()
	{
		super.step();

		const today = this.tickToDay(this.clock);

		if (today !== this.scoreDate)
		{
			const now = this.tickToHour(this.clock);

			if (this.config.game.update > now % 24)
			{
				this.scoreDate = today;
console.log("It's 3 am do you know what the score is?");
				this.copyRoomState();
			}
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

	drawState(elementName, roomType)
	{
		if (this.roomState[roomType])
		{
			setText(elementName, "Close");
		}
		else
		{
			setText(elementName, "Open");
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
		this.drawState("groceries", C.ROOMTYPE.GROCERIES);
		this.drawState("outside", C.ROOMTYPE.OUTSIDE);
	}
}
