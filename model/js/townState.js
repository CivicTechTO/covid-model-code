
class TownState extends InfectState
{
	constructor(configuration, width, height)
	{
		super(configuration, width, height);

		this.count = this.activeConfig.count;

		this.workList = [];
		this.schoolList = [];
		this.meatList = [];
		this.officeList = [];

		this.houseList = [];
		this.bunkHouseList = [];
		this.dwellingList = [];

		this.isolationList = [];

		this.churchList = [];
		this.restaurantList = [];
		this.pubList = [];
		this.clubList = [];
		this.outsideList = [];
		this.partyList =[];

		this.workBack = this.activeConfig.workBack;

		this.hosts = new Set();
		this.notHosts = new Set();
	}

	choiceList()
	{
		return [this.churchList, this.restaurantList, this.pubList, this.clubList, this.outsideList, this.partyList];
	}

	fill()
	{
		super.fill();

		let crowd = [];

		this.churchSpec = this.activeConfig.church;

		this.fillHome(this.dwellingList, crowd);
		this.fillIsolation();
		this.fillWork();
		this.fillOther();

		this.fillPersons();

		this.setHomes(this.dwellingList, crowd);
		this.setWork();			// After setHomes
		this.setChurch();			// After setHomes
		this.setRestaurants();
		this.setPubs();

		this.setWeek();
		this.setDays();

		this.manager = new SicknessManager(this.activeConfig.hospital);
	}

	fillHome(dwellings, crowd)
	{
		this.fillBunkHouses(dwellings, crowd);
		this.fillHouses(dwellings, crowd);
	}

	fillBunkHouses(dwellings, crowd)
	{
		let count = this.activeConfig.bunkHouse.count;
		let width = this.activeConfig.bunkHouse.width;
		let height = this.activeConfig.bunkHouse.height;

		let offset = Math.round((this.activeConfig.road.space - width) / 2);
		let x = (this.activeConfig.bunkHouse.road * this.activeConfig.road.space) + offset;
		let top = (this.activeConfig.size.height - count * height) - this.activeConfig.bunkHouse.buffer;

		let bunkHouses = stack(count, x, top, width, height);
		
		for (const room of bunkHouses) 
		{
			room.fillStyle = this.activeConfig.bunkHouse.style;
			room.ventilation = computeLevel(this.activeConfig.bunkHouse.ventilation);
			room.loudness = computeLevel(this.activeConfig.bunkHouse.loudness);
			room.house = false;

			this.roomList.push(room);
			dwellings.push(room);
			this.bunkHouseList.push(room);

			crowd.push(this.activeConfig.bunkHouse.crowd);
		}
	}

	fillHouses(dwellings, crowd)
	{
		let count = this.activeConfig.house.count;
		let width = this.activeConfig.house.width;
		let height = this.activeConfig.house.height;
		let offset = Math.round((this.activeConfig.road.space - 2 * width) / 2);
		let top = (this.activeConfig.size.height - count * height) - this.activeConfig.house.buffer;

		for (var road = this.activeConfig.house.startRoad; road <= this.activeConfig.house.endRoad; road++) 
		{
			let x = road * this.activeConfig.road.space + offset;
			let houses = twoStack(count, x, top, width, height);
			
			for (const room of houses) 
			{
				room.fillStyle = this.activeConfig.house.style;
				room.ventilation = computeLevel(this.activeConfig.house.ventilation);
				room.loudness = computeLevel(this.activeConfig.house.loudness);
				room.house = true;

				this.houseList.push(room);
				this.roomList.push(room);
				dwellings.push(room);
				crowd.push(this.activeConfig.house.crowd);
			}
		}
	}

	fillIsolation()
	{
		const count = this.activeConfig.isolation.count;
		const width = this.activeConfig.isolation.width;
		const height = this.activeConfig.isolation.height;
		const row = this.activeConfig.isolation.row;
		const offset = Math.round((this.activeConfig.road.space - row * width) / 2);
		const x = this.activeConfig.isolation.road * this.activeConfig.road.space + offset;
		const top = this.activeConfig.isolation.top;

		this.isolationList = NStack(row, count, x, top, width, height, makeIsolation());

		for (let room of this.isolationList)
		{
			room.fillStyle = state.activeConfig.isolation.style;
			this.roomList.push(room);
		}
	}

	findIsolation()
	{
		let result = null;

		for (const room of this.isolationList)
		{
			if (!room.reserved)
			{
				result = room;
				break;
			}
		}

		return result;
	}

	fillWork()
	{
		let left = row(1, 1, this.activeConfig.depth, this.activeConfig.left);

		for (const room of left)
		{
			this.roomList.push(room);
			this.workList.push(room);
		}

		let x = this.activeConfig.size.width - (this.activeConfig.depth + 1);
		let right = row(x, 1, this.activeConfig.depth, this.activeConfig.right);

		for (const room of right)
		{
			this.roomList.push(room);
			this.workList.push(room);
		}

		let index = 0;
		for (const room of this.workList)
		{
			const allocation = this.activeConfig.workAllocation[index++];
			const crowd = Math.floor(allocation / room.height);
			room.change(new WorkRules(this.activeConfig.workBack, room, crowd));

			const scale = allocation / this.activeConfig.workScale.maxAllocation;

//			room.fillStyle = this.activeConfig.workStyle;

			const ventilationConfig = this.activeConfig.workScale.ventilation;
			room.ventilation = ventilationConfig.min + scale * (ventilationConfig.max - ventilationConfig.min);

			const loudnessConfig = this.activeConfig.workScale.loudness;
			room.loudness = loudnessConfig.min + scale * (loudnessConfig.max - loudnessConfig.min);
		}
	}

	fillOther()
	{
		this.fillChurch(2 * this.activeConfig.road.space, this.activeConfig.church);
		this.fillRestaurant(4 * this.activeConfig.road.space, this.activeConfig.restaurant);
		this.fillPub(5 * this.activeConfig.road.space, this.activeConfig.pub);
		this.fillClub(6 * this.activeConfig.road.space, this.activeConfig.club);

		this.fillChurch(7 * this.activeConfig.road.space, this.activeConfig.church);
		this.fillRestaurant(9 * this.activeConfig.road.space, this.activeConfig.restaurant);
		this.fillPub(10 * this.activeConfig.road.space, this.activeConfig.pub);
		this.fillClub(11 * this.activeConfig.road.space, this.activeConfig.club);
		
		this.fillChurch(12 * this.activeConfig.road.space, this.activeConfig.church);
		this.fillRestaurant(14 * this.activeConfig.road.space, this.activeConfig.restaurant);
		this.fillPub(15 * this.activeConfig.road.space, this.activeConfig.pub);
		this.fillClub(16 * this.activeConfig.road.space, this.activeConfig.club);

		this.fillOutside(this.activeConfig);

		this.fillHospital();
		this.fillCemetary();
	}

	fillCemetary()
	{
		let y = this.activeConfig.cemetary.y;
		let x = (this.activeConfig.cemetary.road * this.activeConfig.road.space) + this.activeConfig.cemetary.offset;
		let width = this.activeConfig.cemetary.width;

		this.cemetary = new Room(x, y, width, this.activeConfig.cemetary.height);
		this.cemetary.rules = new CemetaryRules();
		this.cemetary.ventilation = this.activeConfig.ventilation.max;
		this.cemetary.loudness = 0;
		this.cemetary.fillStyle = this.activeConfig.cemetary.style;
		this.roomList.push(this.cemetary);
	}

	fillHospital()
	{
		const x = (this.activeConfig.hospital.road * this.activeConfig.road.space) + this.activeConfig.hospital.offset;
		const width = this.activeConfig.hospital.width;
		const wardConfig = this.activeConfig.hospital.ward;
		const icuConfig = this.activeConfig.hospital.icu;
		const hallwayConfig = this.activeConfig.hospital.hallway;

		let y = this.activeConfig.hospital.y + icuConfig.height + wardConfig.height;
		this.hallway = new Room(x, y, width, hallwayConfig.height);
		this.hallway.rules = new HallwayRules();
		this.hallway.ventilation = this.activeConfig.ventilation.max;
		this.hallway.loudness = 0;
		this.hallway.fillStyle = this.activeConfig.hospital.style.hallway;
		this.roomList.push(this.hallway);

		y = this.activeConfig.hospital.y + icuConfig.height;
		this.ward = new Room(x, y, width, wardConfig.height);
		this.ward.rules = new HospitalRules();
		this.ward.ventilation = this.activeConfig.ventilation.max;
		this.ward.loudness = 0;
		this.ward.fillStyle = this.activeConfig.hospital.style.ward;

		this.roomList.push(this.ward);

		y = this.activeConfig.hospital.y;
		this.icu = new Room(x, y, width, icuConfig.height);
		this.icu.rules = new HospitalRules();
		this.icu.ventilation = this.activeConfig.ventilation.max;
		this.icu.loudness = 0;
		this.icu.fillStyle = this.activeConfig.hospital.style.icu;
		this.roomList.push(this.icu);
	}

	fillChurch(x, churchSpec)
	{
		let actual = x + churchSpec.offset;
		let width = churchSpec.width;
		let height = churchSpec.height;
		let halfEdge = churchSpec.halfEdge;
		let separation = churchSpec.separation;

		let churchList = stack(churchSpec.count, actual, 1, width, height);

		for (const church of churchList)
		{
			church.fillStyle = this.activeConfig.church.style;

			this.roomList.push(church);
			this.churchList.push(church);
			church.rules = new ChurchSitRules(church, separation);
		}
	}

	fillClub(x, clubSpec)
	{
		let actual = x + clubSpec.offset;
		let width = clubSpec.width;
		let height = clubSpec.height;
		let halfEdge = clubSpec.halfEdge;

		let clubList = stack(clubSpec.count, actual, 1, width, height);

		for (const club of clubList)
		{
			club.fillStyle = this.activeConfig.club.style;
			club.ventilation = computeLevel(clubSpec.ventilation);
			club.loudness = computeLevel(clubSpec.loudness);
			club.rules = new ClubRules(halfEdge);

			this.roomList.push(club);
			this.clubList.push(club);
		}
	}

	fillPub(x, pubSpec)
	{
		let actual = x + pubSpec.offset;
		let pubStack = twoStack(pubSpec.count, actual, 1, pubSpec.width, pubSpec.height);

		for (const pub of pubStack)
		{
			pub.fillStyle = pubSpec.style;
			pub.ventilation = computeLevel(pubSpec.ventilation);
			pub.loudness = computeLevel(pubSpec.loudness);

			this.roomList.push(pub);
			this.pubList.push(pub);
		}
	}

	setPubs()
	{
		for (const pub of this.pubList)
		{
			pub.rules = new PubRules(this.pubList, pub);
		}
	}

	fillRestaurant(x, resto)
	{
		let actual = x + resto.offset;

		let restaurantStack = twoStack(resto.count, actual, 1, resto.width, resto.height);

		for (const restaurant of restaurantStack)
		{
			restaurant.fillStyle = resto.style;
			restaurant.ventilation = computeLevel(resto.ventilation);
			restaurant.loudness = computeLevel(resto.loudness);

			this.roomList.push(restaurant);
			this.restaurantList.push(restaurant);
		}
	}

	setRestaurants()
	{
		let separation = this.activeConfig.restaurant.separation;

		for (const restaurant of this.restaurantList)
		{
			restaurant.rules = new RestaurantRules(this.restaurantList, restaurant, separation);
		}
	}

	fillOutside()
	{
		let width = this.activeConfig.outside.width;
		let height = this.activeConfig.outside.height;
		let y = this.activeConfig.outside.y;
		let halfEdge = this.activeConfig.outside.halfEdge;

		for (var i = this.activeConfig.outside.road ; i < this.activeConfig.outside.count; i++) 
		{
			let x = i * this.activeConfig.road.space;
			let outside = new Outside(x, y, width, height, halfEdge);

			outside.loudness = this.activeConfig.outside.loudness;
			outside.ventilation = this.activeConfig.outside.ventilation;

			outside.fillStyle = this.activeConfig.outside.style;

			this.roomList.push(outside);
			this.outsideList.push(outside);

			// outside = new Outside(x + width, y, width, height, halfEdge);
			// outside.fillStyle = this.activeConfig.outside.style;

			// this.roomList.push(outside);
			// this.outsideList.push(outside);
		}

	}

	fillPersons()
	{
		for (var i = 0; i < this.activeConfig.count; i++) 
		{
			let person = this.makePerson();
			this.personList[i] = person;
		}	
	}

	setHomes(dwellingList, crowd)
	{
		for (const dwelling of dwellingList)
		{
			dwelling.rules = new NightDwellingRules();
		}

		let choices = makeChoices(dwellingList, crowd);

		for (var i = 0; i < this.personList.length; i++) 
		{
			let person = this.personList[i];

			if (i < Math.round(this.activeConfig.fillFactor * dwellingList.length))
			{
				person.home = dwellingList[i % dwellingList.length];
			}
			else
			{
				person.home = chooseOne(choices);
			}

			person.home.insert(person);
		}
	}

	setWork()
	{
		let choices = makeChoices(this.workList, this.activeConfig.workAllocation);

		for (const person of this.personList)
		{
			if (person.home.house && Math.random() < this.activeConfig.weekday.home)
			{
				person.work = person.home;
			}
			else
			{
				person.work = chooseOne(choices);
			}
		}
	}

	setChurch()
	{
		for (const person of this.personList)
		{
			let roll = Math.random();

			if (roll < this.activeConfig.sundayMorning.home)
			{
				person.church = person.home;
			}
			else
			{
				roll -= this.activeConfig.sundayMorning.home;

				if (roll < this.activeConfig.sundayMorning.outside)
				{
					person.church = chooseOne(this.outsideList);
				}
				else
				{
					person.church = chooseOne(this.churchList);
				}
			}
		}
	}

	setDays()
	{
		this.days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		this.currentDay = 0;
		this.startHour = this.activeConfig.startHour;
		this.currentHour = this.activeConfig.startHour;
		this.currentMinute = 0;
	}

	clearChurch()
	{
		for (const church of this.churchList)
		{
			church.clearEvents();
		}
	}

	step()
	{
		super.step();

// !!! validate();

		let nextDay = Math.floor(Math.floor(this.tickToHour(this.clock) + this.startHour) / 24);

		if (nextDay !== this.currentDay)
		{
			this.currentDay = nextDay;

			const dayElement = document.getElementById('day');
			dayElement.textContent = (nextDay + 1).toString();

			const nameElement = document.getElementById('name');
			nameElement.textContent = this.days[nextDay % 7];
		}

		let hour = (Math.floor(this.tickToHour(this.clock)) + this.startHour) % 24;
		if (hour !== this.currentHour)
		{
			this.currentHour = hour;

			const hourElement = document.getElementById('hour');
			hourElement.textContent = hour.toString().padStart(2, "0");
		}

		let minute = Math.floor(this.tickToMinute(this.clock)) % 60;
		if (minute !== this.currentMinute)
		{
			this.currentMinute = minute;

			const minuteElement = document.getElementById('minutes');
			minuteElement.textContent = minute.toString().padStart(2, '0');
		}
	}
}
