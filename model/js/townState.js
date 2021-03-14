
class TownState extends InfectState
{
	constructor(config, width, height)
	{
		super(config, width, height);

		this.count = this.config.count;

		this.oldSteps = 0;

		this.workList = [];
		this.houseList = [];
		this.dwellingList = [];

		this.churchList = [];
		this.restaurantList = [];
		this.pubList = [];
		this.clubList = [];
		this.outsideList = [];
		this.partyList =[];

		this.week = [];

		this.workBack = this.config.workBack;

		this.hosts = new Set();
		this.notHosts = new Set();

		this.icuPool = new Set();
		this.wardPool = new Set();
	}

	choiceList()
	{
		return [this.churchList, this.restaurantList, this.pubList, this.clubList, this.outsideList, this.partyList];
	}

	fill()
	{
		super.fill();

		let crowd = [];

		this.churchSpec = this.config.church;

		this.fillHome(this.dwellingList, crowd);
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
	}

	fillHome(dwellings, crowd)
	{
		this.fillBunkHouses(dwellings, crowd);
		this.fillHouses(dwellings, crowd);
	}

	fillBunkHouses(dwellings, crowd)
	{
		let count = this.config.bunkHouse.count;
		let width = this.config.bunkHouse.width;
		let height = this.config.bunkHouse.height;
		let speed = this.config.bunkHouse.speed;

		let offset = Math.round((this.config.road.space - width) / 2);
		let x = (this.config.bunkHouse.road * this.config.road.space) + offset;
		let top = (this.config.size.height - count * height) - this.config.bunkHouse.buffer;

		let bunkHouses = stack(count, x, top, width, height, speed);
		
		for (const room of bunkHouses) 
		{
			room.fillStyle = this.config.bunkHouse.style;
			room.ventilation = computeLevel(this.config.bunkHouse.ventilation);
			room.loudness = computeLevel(this.config.bunkHouse.loudness);
			room.house = false;

			this.roomList.push(room);
			dwellings.push(room);
			crowd.push(this.config.bunkHouse.crowd);
		}
	}

	fillHouses(dwellings, crowd)
	{
		let count = this.config.house.count;
		let width = this.config.house.width;
		let height = this.config.house.height;
		let speed = this.config.house.speed;
		let offset = Math.round((this.config.road.space - 2 * width) / 2);
		let top = (this.config.size.height - count * height) - this.config.house.buffer;

		for (var road = this.config.house.startRoad; road <= this.config.house.endRoad; road++) 
		{
			let x = road * this.config.road.space + offset;
			let houses = twoStack(count, x, top, width, height, speed);
			
			for (const room of houses) 
			{
				room.fillStyle = this.config.house.style;
				room.ventilation = computeLevel(this.config.house.ventilation);
				room.loudness = computeLevel(this.config.house.loudness);
				room.house = true;

				this.houseList.push(room);
				this.roomList.push(room);
				dwellings.push(room);
				crowd.push(this.config.house.crowd);
			}
		}
	}

	fillWork()
	{
		let left = row(1, 1, this.config.depth, this.config.workSpeed, this.config.left);

		for (const room of left)
		{
			this.roomList.push(room);
			this.workList.push(room);
		}

		let x = this.config.size.width - (this.config.depth + 1);
		let right = row(x, 1, this.config.depth, this.config.workSpeed, this.config.right);

		for (const room of right)
		{
			this.roomList.push(room);
			this.workList.push(room);
		}

		let index = 0;
		for (const room of this.workList)
		{
			const allocation = this.config.workAllocation[index++];
			const crowd = Math.floor(allocation / room.height);
			room.change(new WorkRules(this.config.workSpeed, this.config.workBack, room, crowd));

			const scale = allocation / this.config.workScale.maxAllocation;

			room.fillStyle = this.config.workStyle;

			const ventilationConfig = this.config.workScale.ventilation;
			room.ventilation = ventilationConfig.min + scale * (ventilationConfig.max - ventilationConfig.min);

			const loudnessConfig = this.config.workScale.loudness;
			room.loudness = loudnessConfig.min + scale * (loudnessConfig.max - loudnessConfig.min);
		}
	}

	fillOther()
	{
		this.fillChurch(2 * this.config.road.space, this.config.church);
		this.fillRestaurant(4 * this.config.road.space, this.config.restaurant);
		this.fillPub(5 * this.config.road.space, this.config.pub);
		this.fillClub(6 * this.config.road.space, this.config.club);

		this.fillChurch(7 * this.config.road.space, this.config.church);
		this.fillRestaurant(9 * this.config.road.space, this.config.restaurant);
		this.fillPub(10 * this.config.road.space, this.config.pub);
		this.fillClub(11 * this.config.road.space, this.config.club);
		
		this.fillChurch(12 * this.config.road.space, this.config.church);
		this.fillRestaurant(14 * this.config.road.space, this.config.restaurant);
		this.fillPub(15 * this.config.road.space, this.config.pub);
		this.fillClub(16 * this.config.road.space, this.config.club);

		this.fillOutside(this.config);

		this.fillHospital();
		this.fillCemetary();
	}

	fillCemetary()
	{
		let y = this.config.cemetary.y;
		let x = (this.config.cemetary.road * this.config.road.space) + this.config.cemetary.offset;
		let width = this.config.cemetary.width;
		let speed = this.config.cemetary.speed;

		this.cemetary = new Room(x, y, width, this.config.cemetary.height, speed);
		this.cemetary.rules = new SeatRules(speed);
		this.cemetary.ventilation = this.config.ventilation.max;
		this.cemetary.loudness = 0;
		this.cemetary.fillStyle = this.config.cemetary.style;
		this.roomList.push(this.cemetary);
	}

	fillHospital()
	{
		const x = (this.config.hospital.road * this.config.road.space) + this.config.hospital.offset;
		const width = this.config.hospital.width;
		const speed = this.config.hospital.speed;
		const wardConfig = this.config.hospital.ward;
		const icuConfig = this.config.hospital.icu;
		const hallwayConfig = this.config.hospital.hallway;

		let y = this.config.hospital.y + icuConfig.height + wardConfig.height;
		this.hallway = new Room(x, y, width, hallwayConfig.height, speed);
		this.hallway.rules = new SeatRules(speed);
		this.hallway.ventilation = this.config.ventilation.max;
		this.hallway.loudness = 0;
		this.hallway.fillStyle = this.config.hospital.style;
		this.roomList.push(this.hallway);

		y = this.config.hospital.y + icuConfig.height;
		this.ward = new Room(x, y, width, wardConfig.height, speed);
		this.ward.rules = new HospitalRules(speed, this.ward, this.wardPool, wardConfig.count, this.hallway);
		this.ward.ventilation = this.config.ventilation.max;
		this.ward.loudness = 0;
		this.ward.fillStyle = this.config.hospital.style;

		this.roomList.push(this.ward);

		y = this.config.hospital.y;
		this.icu = new Room(x, y, width, icuConfig.height, speed);
		this.icu.rules = new HospitalRules(speed, this.icu, this.icuPool, icuConfig.count, this.ward);
		this.icu.ventilation = this.config.ventilation.max;
		this.icu.loudness = 0;
		this.icu.fillStyle = this.config.hospital.style;
		this.roomList.push(this.icu);
	}

	fillChurch(x, churchSpec)
	{
		let actual = x + churchSpec.offset;
		let width = churchSpec.width;
		let height = churchSpec.height;
		let speed = churchSpec.speed;
		let halfEdge = churchSpec.halfEdge;
		let start = churchSpec.start;
		let pause = churchSpec.pause;
		let separation = churchSpec.separation;

		let churchList = stack(churchSpec.count, actual, 1, width, height, speed);

		for (const church of churchList)
		{
			church.fillStyle = this.config.church.style;

			this.roomList.push(church);
			this.churchList.push(church);
			church.rules = new ChurchRules(speed, church, separation);
		}
	}

	fillClub(x, clubSpec)
	{
		let actual = x + clubSpec.offset;
		let width = clubSpec.width;
		let height = clubSpec.height;
		let speed = clubSpec.speed;
		let halfEdge = clubSpec.halfEdge;

		let clubList = stack(clubSpec.count, actual, 1, width, height, speed);

		for (const club of clubList)
		{
			club.fillStyle = this.config.club.style;
			club.ventilation = computeLevel(clubSpec.ventilation);
			club.loudness = computeLevel(clubSpec.loudness);
			club.rules = new RandomRules(speed, halfEdge, 1, 1);

			this.roomList.push(club);
			this.clubList.push(club);
		}
	}

	fillPub(x, pubSpec)
	{
		let actual = x + pubSpec.offset;
		let pubStack = twoStack(pubSpec.count, actual, 1, pubSpec.width, pubSpec.height, pubSpec.speed);

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
		let speed = this.config.pub.speed;

		for (const pub of this.pubList)
		{
			pub.rules = new PubRules(speed, this.pubList, pub);
		}
	}

	fillRestaurant(x, resto)
	{
		let actual = x + resto.offset;
		let speed = resto.speed;

		let restaurantStack = twoStack(resto.count, actual, 1, resto.width, resto.height, speed);

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
		let speed = this.config.restaurant.speed;
		let separation = this.config.restaurant.separation;

		for (const restaurant of this.restaurantList)
		{
			restaurant.rules = new RestaurantRules(speed, this.restaurantList, restaurant, separation);
		}
	}

	fillOutside()
	{
		let width = this.config.outside.width;
		let height = this.config.outside.height;
		let y = this.config.outside.y;
		let speed = this.config.outside.speed;
		let halfEdge = this.config.outside.halfEdge;
		let start = this.config.outside.start;
		let pause = this.config.outside.pause;

		for (var i = this.config.outside.road ; i < this.config.outside.count; i++) 
		{
			let x = i * this.config.road.space;
			let outside = new Outside(x, y, width, height, speed, halfEdge, start, pause);
			outside.fillStyle = this.config.outside.style;

			this.roomList.push(outside);
			this.outsideList.push(outside);

			outside = new Outside(x + width, y, width, height, speed, halfEdge, start, pause);
			outside.fillStyle = this.config.outside.style;

			this.roomList.push(outside);
			this.outsideList.push(outside);
		}

	}

	fillPersons()
	{
		for (var i = 0; i < this.config.count; i++) 
		{
			let person = this.makePerson();
			this.personList[i] = person;
		}	
	}

	setHomes(dwellingList, crowd)
	{
		for (const dwelling of dwellingList)
		{
			dwelling.rules = new SeatRules(this.config.dwelling.speed);
		}

		let choices = makeChoices(dwellingList, crowd);

		for (var i = 0; i < this.personList.length; i++) 
		{
			let person = this.personList[i];

			if (i < Math.round(this.config.fillFactor * dwellingList.length))
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
		let choices = makeChoices(this.workList, this.config.workAllocation);

		for (const person of this.personList)
		{
			if (person.home.house && Math.random() < this.config.weekday.home)
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

			if (roll < this.config.sundayMorning.home)
			{
				person.church = person.home;
			}
			else
			{
				roll -= this.config.sundayMorning.home;

				if (roll < this.config.sundayMorning.outside)
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

	setWeek()
	{
		this.week = [];

		this.week.push(new Sunday(this.config.dwelling.start, this.config.dwelling.pause, this.config.church));

		this.pushInitial(this.config.dwelling.start, this.config.dwelling.pause, this.config.sundayAfternoon.initial, this.config.sundayAfternoon.migrate);
		this.pushMigrate(this.config.sundayEve.migrate);
		this.pushMigrate(this.config.sundayNight.migrate);
		this.week.push(new Night());
		this.week.push(new Shift());
		
		for (let i = 0 ; i < 4 ; i++)
		{
			this.week.push(new Day(this.config.dwelling.start, this.config.dwelling.pause));
			this.week.push(new Shift());
			this.pushInitial(this.config.dwelling.start, this.config.dwelling.pause, this.config.weekdayEve.initial, this.config.weekdayEve.migrate);
			this.pushMigrate(this.config.weekdayNight.migrate);
			this.week.push(new Night());
			this.week.push(new Shift());
		}

		this.week.push(new Day(this.config.dwelling.start, this.config.dwelling.pause));
		this.week.push(new Shift());
		this.pushInitial(this.config.dwelling.start, this.config.dwelling.pause, this.config.fridayEve.initial, this.config.fridayEve.migrate);
		this.pushMigrate(this.config.fridayNight.migrate);
		this.week.push(new Night());
		this.week.push(new Shift());

		this.pushInitial(this.config.dwelling.start, this.config.dwelling.pause, this.config.saturdayMorning.initial, this.config.saturdayMorning.migrate);
		this.pushMigrate(this.config.saturdayAfternoon.migrate);
		this.pushMigrate(this.config.saturdayEve.migrate);
		this.pushMigrate(this.config.saturdayNight.migrate);
		this.week.push(new Night());
		this.week.push(new Shift());
	}

	pushInitial(start, pause, initialConfig, migrateConfig)
	{
		let chance = migrateConfig.chance;

		this.week.push(new InitialShift(start, pause, initialConfig, migrateConfig));
	}

	pushMigrate(migrateConfig)
	{
		this.week.push(new MigrateShift(migrateConfig));
	}

	setDays()
	{
		this.days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		this.currentDay = 0;
		this.startHour = this.config.startHour;
		this.currentHour = this.config.startHour;
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
			hourElement.textContent = hour.toString();
		}

		let minute = Math.floor(this.tickToMinute(this.clock)) % 60;
		if (minute !== this.currentMinute)
		{
			this.currentMinute = minute;

			const minuteElement = document.getElementById('minutes');
			minuteElement.textContent = minute.toString().padStart(2, '0');
		}

		if (this.oldSteps !== this.stepsPerFrame)
		{
			this.oldSteps = this.stepsPerFrame;

			const stepElement = document.getElementById('steps');
			stepElement.textContent = this.stepsPerFrame.toString();
		}
	}
}
