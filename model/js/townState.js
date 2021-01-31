
class TownState extends InfectState
{
	constructor(config, width, height)
	{
		super(config, width, height);

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

		this.workBack = config.workBack;

		this.hosts = new Set();
		this.notHosts = new Set();
	}

	choiceList()
	{
		return [this.churchList, this.restaurantList, this.pubList, this.clubList, this.outsideList, this.partyList];
	}

	fill(config)
	{
		let crowd = [];

		this.churchSpec = config.church;

		this.fillHome(config, this.dwellingList, crowd);
		this.fillWork(config);
		this.fillOther(config);

		this.fillPersons(config);

		this.setHomes(config, this.dwellingList, crowd);
		this.setWork(config);			// After setHomes
		this.setChurch(config);			// After setHomes
		this.setRestaurants(config);
		this.setPubs(config);

		this.setWeek(config);
		this.setDays(config);

		super.fill(config);
	}

	fillHome(config, dwellings, crowd)
	{
		this.fillBunkHouses(config, dwellings, crowd);
		this.fillHouses(config, dwellings, crowd);
	}

	fillBunkHouses(config, dwellings, crowd)
	{
		let count = config.bunkHouse.count;
		let width = config.bunkHouse.width;
		let height = config.bunkHouse.height;
		let speed = config.bunkHouse.speed;

		let offset = Math.round((config.road.space - width) / 2);
		let x = (config.bunkHouse.road * config.road.space) + offset;
		let top = (config.size.height - count * height) - config.bunkHouse.buffer;

		let bunkHouses = stack(count, x, top, width, height, speed);
		
		for (const room of bunkHouses) 
		{
			this.roomList.push(room);
			dwellings.push(room);
			room.house = false;
			crowd.push(config.bunkHouse.crowd);
		}
	}

	fillHouses(config, dwellings, crowd)
	{
		let count = config.house.count;
		let width = config.house.width;
		let height = config.house.height;
		let speed = config.house.speed;
		let offset = Math.round((config.road.space - 2 * width) / 2);
		let top = (config.size.height - count * height) - config.house.buffer;

		for (var road = config.house.startRoad; road <= config.house.endRoad; road++) 
		{
			let x = road * config.road.space + offset;
			let houses = twoStack(count, x, top, width, height, speed);
			
			for (const room of houses) 
			{
				this.houseList.push(room);
				this.roomList.push(room);
				dwellings.push(room);

				room.house = true;
				crowd.push(config.house.crowd);
			}
		}
	}

	fillWork(config)
	{
		let left = row(1, 1, config.depth, config.workSpeed, config.left);

		for (const room of left)
		{
			this.roomList.push(room);
			this.workList.push(room);
		}

		let x = config.size.width - (config.depth + 1);
		let right = row(x, 1, config.depth, config.workSpeed, config.right);

		for (const room of right)
		{
			this.roomList.push(room);
			this.workList.push(room);
		}

		let index = 0;
		for (const room of this.workList)
		{
			let crowd = Math.floor(config.workAllocation[index++] / room.height);
			room.change(new WorkRules(config.workSpeed, config.workBack, room, crowd));
		}
	}

	fillOther(config)
	{
		this.fillChurch(2 * config.road.space, config.church);
		this.fillRestaurant(4 * config.road.space, config.restaurant);
		this.fillPub(5 * config.road.space, config.pub);
		this.fillClub(6 * config.road.space, config.club);

		this.fillChurch(7 * config.road.space, config.church);
		this.fillRestaurant(9 * config.road.space, config.restaurant);
		this.fillPub(10 * config.road.space, config.pub);
		this.fillClub(11 * config.road.space, config.club);
		
		this.fillChurch(12 * config.road.space, config.church);
		this.fillRestaurant(14 * config.road.space, config.restaurant);
		this.fillPub(15 * config.road.space, config.pub);
		this.fillClub(16 * config.road.space, config.club);

		this.fillOutside(config);

		this.fillHospital(config);
		this.fillCemetary(config);
	}

	fillCemetary(config)
	{
		let y = config.cemetary.y;
		let x = (config.cemetary.road * config.road.space) + config.cemetary.offset;
		let width = config.cemetary.width;
		let speed = config.cemetary.speed;

		this.cemetary = new Room(x, y, width, config.cemetary.height, speed);
		this.cemetary.rules = new SeatRules(speed);
		this.cemetary.fillColour = "#4DFF4D";
		this.roomList.push(this.cemetary);
	}

	fillHospital(config)
	{
		let y = config.hospital.y;
		let x = (config.hospital.road * config.road.space) + config.hospital.offset;
		let width = config.hospital.width;
		let speed = config.hospital.speed;

		this.icu = new Hospital(x, y, width, config.hospital.icu.height, speed);
		this.icu.rules = new HospitalRules(speed, this.icu, config.hospital.icu.count);
		y += config.hospital.icu.height;
		this.roomList.push(this.icu);

		this.ward = new Hospital(x, y, width, config.hospital.ward.height, speed);
		this.ward.rules = new HospitalRules(speed, this.ward, config.hospital.ward.count);
		y += config.hospital.ward.height;
		this.roomList.push(this.ward);

		this.hallway = new Room(x, y, width, config.hospital.hallway.height, speed);
		this.hallway.rules = new HospitalRules(speed, this.hallway, config.hospital.hallway.count);
		this.roomList.push(this.hallway);
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
			this.roomList.push(club);
			this.clubList.push(club);
			club.rules = new RandomRules(speed, halfEdge, 1, 1);
		}
	}

	fillPub(x, pub)
	{
		let actual = x + pub.offset;
		let pubStack = twoStack(pub.count, actual, 1, pub.width, pub.height, pub.speed);

		for (const pub of pubStack)
		{
			this.roomList.push(pub);
			this.pubList.push(pub);
		}
	}

	setPubs(config)
	{
		let speed = config.pub.speed;

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
			this.roomList.push(restaurant);
			this.restaurantList.push(restaurant);
		}
	}

	setRestaurants(config)
	{
		let speed = config.restaurant.speed;
		let separation = config.restaurant.separation;

		for (const restaurant of this.restaurantList)
		{
			restaurant.rules = new RestaurantRules(speed, this.restaurantList, restaurant, separation);
		}
	}

	fillOutside(config)
	{
		let width = config.outside.width;
		let height = config.outside.height;
		let y = config.outside.y;
		let speed = config.outside.speed;
		let halfEdge = config.outside.halfEdge;
		let start = config.outside.start;
		let pause = config.outside.pause;

		for (var i = config.outside.road ; i < config.outside.count; i++) 
		{
			let x = i * config.road.space;
			let outside = new Outside(x, y, width, height, speed, halfEdge, start, pause);
			this.roomList.push(outside);
			this.outsideList.push(outside);

			outside = new Outside(x + width, y, width, height, speed, halfEdge, start, pause);
			this.roomList.push(outside);
			this.outsideList.push(outside);
		}

	}

	fillPersons(config)
	{
		for (var i = 0; i < config.count; i++) 
		{
			let person = this.makePerson();
			this.personList[i] = person;
		}	
	}

	setHomes(config, dwellingList, crowd)
	{
		for (const dwelling of dwellingList)
		{
			dwelling.rules = new SeatRules(config.dwelling.speed);
		}

		let choices = makeChoices(dwellingList, crowd);

		for (var i = 0; i < this.personList.length; i++) 
		{
			let person = this.personList[i];

			if (i < Math.round(config.fillFactor * dwellingList.length))
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

	setWork(config)
	{
		let choices = makeChoices(this.workList, config.workAllocation);

		for (const person of this.personList)
		{
			if (person.home.house && Math.random() < config.weekday.home)
			{
				person.work = person.home;
			}
			else
			{
				person.work = chooseOne(choices);
			}
		}
	}

	setChurch(config)
	{
		for (const person of this.personList)
		{
			let roll = Math.random();

			if (roll < config.sundayMorning.home)
			{
				person.church = person.home;
			}
			else
			{
				roll -= config.sundayMorning.home;

				if (roll < config.sundayMorning.outside)
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

	setWeek(config)
	{
		this.week = [];

		this.week.push(new Sunday(config.dwelling.start, config.dwelling.pause, config.church));

		this.pushInitial(config.dwelling.start, config.dwelling.pause, config.sundayAfternoon.initial, config.sundayAfternoon.migrate);
		this.pushMigrate(config.sundayEve.migrate);
		this.pushMigrate(config.sundayNight.migrate);
		this.week.push(new Night());
		this.week.push(new Shift());
		
		for (let i = 0 ; i < 4 ; i++)
		{
			this.week.push(new Day(config.dwelling.start, config.dwelling.pause));
			this.week.push(new Shift());
			this.pushInitial(config.dwelling.start, config.dwelling.pause, config.weekdayEve.initial, config.weekdayEve.migrate);
			this.pushMigrate(config.weekdayNight.migrate);
			this.week.push(new Night());
			this.week.push(new Shift());
		}

		this.week.push(new Day(config.dwelling.start, config.dwelling.pause));
		this.week.push(new Shift());
		this.pushInitial(config.dwelling.start, config.dwelling.pause, config.fridayEve.initial, config.fridayEve.migrate);
		this.pushMigrate(config.fridayNight.migrate);
		this.week.push(new Night());
		this.week.push(new Shift());

		this.pushInitial(config.dwelling.start, config.dwelling.pause, config.saturdayMorning.initial, config.saturdayMorning.migrate);
		this.pushMigrate(config.saturdayAfternoon.migrate);
		this.pushMigrate(config.saturdayEve.migrate);
		this.pushMigrate(config.saturdayNight.migrate);
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

	setDays(config)
	{
		this.days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		this.dayTicks = (24 * 60 * 60) / config.realTick;
		this.currentDay = 0;
		this.hourTicks = (60 * 60) / config.realTick;
		this.tenTicks = (10 * 60) / config.realTick;
		this.minuteTicks = 60 / config.realTick;
		this.startHour = config.startHour;
		this.currentHour = config.startHour;
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

		let nextDay = Math.floor((Math.floor(this.clock / this.hourTicks) + this.startHour) / 24);

		if (nextDay !== this.currentDay)
		{
			this.currentDay = nextDay;

			const dayElement = document.getElementById('day');
			dayElement.textContent = (nextDay + 1).toString();

			const nameElement = document.getElementById('name');
			nameElement.textContent = this.days[nextDay % 7];
		}

		let hour = (Math.floor((this.clock / this.hourTicks)) + this.startHour) % 24;
		if (hour !== this.currentHour)
		{
			this.currentHour = hour;

			const hourElement = document.getElementById('hour');
			hourElement.textContent = hour.toString();
		}

		let minute = Math.floor(this.clock / this.minuteTicks) % 60;
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
