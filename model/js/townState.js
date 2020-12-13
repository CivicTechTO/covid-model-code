
class TownState extends State
{
	constructor(config, width, height)
	{
		super(config, width, height);

		this.oldSteps = 0;

		this.workList = [];
		this.houseList = [];

		this.churchList = [];
		this.restaurantList = [];
		this.pubList = [];
		this.clubList = [];
		this.outsideList = [];

		this.choiceList = 
			[this.churchList, this.restaurantList, this.pubList, this.clubList, this.outsideList];
		this.week = [];

		this.workBack = config.workBack;
	}

	fill(config)
	{
		let dwellings = [];
		let crowd = [];

		this.churchSpec = config.church;

		this.fillHome(config, dwellings, crowd);
		this.fillWork(config);
		this.fillOther(config);

		this.fillPersons(config);

		this.setHomes(config, dwellings, crowd);
		this.setWork(config);			// After setHomes
		this.setChurch(config);			// After setHomes
		this.setRestaurants(config);
		this.setPubs(config);

		this.setWeek(config);
		this.setDays(config);
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
		let top = config.size.height - count * height;

		let bunkHouses = stack(count, x, top, width, height, speed);
		Array.prototype.push.apply(this.houseList, bunkHouses);
		Array.prototype.push.apply(this.roomList, bunkHouses);
		Array.prototype.push.apply(dwellings, bunkHouses);
		
		for (var i = 0; i < bunkHouses.length; i++) 
		{
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
		let top = config.size.height - count * height;

		for (var road = config.house.startRoad; road <= config.house.endRoad; road++) 
		{
			let x = road * config.road.space + offset;
			let houses = twoStack(count, x, top, width, height, speed);
			Array.prototype.push.apply(this.houseList, houses);
			Array.prototype.push.apply(this.roomList, houses);

			Array.prototype.push.apply(dwellings, houses);
			
			for (var i = 0; i < houses.length; i++) 
			{
				crowd.push(config.house.crowd);
			}
		}
	}

	fillWork(config)
	{
		let left = row(1, 1, config.depth, config.workSpeed, config.left);
		Array.prototype.push.apply(this.roomList, left);
		Array.prototype.push.apply(this.workList, left);

		let x = config.size.width - (config.depth + 1);
		let right = row(x, 1, config.depth, config.workSpeed, config.right);
		Array.prototype.push.apply(this.roomList, right);
		Array.prototype.push.apply(this.workList, right);

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

		let churches = stack(churchSpec.count, actual, 1, width, height, speed);
		Array.prototype.push.apply(this.roomList, churches);
		Array.prototype.push.apply(this.churchList, churches);
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
			club.rules = new RandomRules(speed, halfEdge, 1, 1);
		}
		
		Array.prototype.push.apply(this.roomList, clubList);
		Array.prototype.push.apply(this.clubList, clubList);
	}

	fillPub(x, pub)
	{
		let actual = x + pub.offset;
		let pubs = twoStack(pub.count, actual, 1, pub.width, pub.height, pub.speed);
		Array.prototype.push.apply(this.roomList, pubs);
		Array.prototype.push.apply(this.pubList, pubs);
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

		Array.prototype.push.apply(this.roomList, restaurantStack);
		Array.prototype.push.apply(this.restaurantList, restaurantStack);
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
			let person = new Person();
			this.personList[i] = person;
		}	
	}

	setHomes(config, dwellings, crowd)
	{
		let choices = makeChoices(dwellings, crowd);

		for (var i = 0; i < this.personList.length; i++) 
		{
			let person = this.personList[i];

			if (i < Math.round(config.fillFactor * dwellings.length))
			{
				person.home = dwellings[i % dwellings.length];
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
			if (Math.random() < config.weekday.home)
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

		this.week.push(new Sunday(config.church));

		this.pushInitial(config.sundayAfternoon.initial, config.sundayAfternoon.migrate);
		this.pushMigrate(config.sundayEve.migrate);
		this.pushMigrate(config.sundayNight.migrate);
		this.week.push(new Night());
		this.week.push(new Shift());
		
		for (let i = 0 ; i < 4 ; i++)
		{
			this.week.push(new Day());
			this.week.push(new Shift());
			this.pushInitial(config.weekdayEve.initial, config.weekdayEve.migrate);
			this.pushMigrate(config.weekdayNight.migrate);
			this.week.push(new Night());
			this.week.push(new Shift());
		}

		this.week.push(new Day());
		this.week.push(new Shift());
		this.pushInitial(config.fridayEve.initial, config.fridayEve.migrate);
		this.pushMigrate(config.fridayNight.migrate);
		this.week.push(new Night());
		this.week.push(new Shift());

		this.pushInitial(config.saturdayMorning.initial, config.saturdayMorning.migrate);
		this.pushMigrate(config.saturdayAfternoon.migrate);
		this.pushMigrate(config.saturdayEve.migrate);
		this.pushMigrate(config.saturdayNight.migrate);
		this.week.push(new Night());
		this.week.push(new Shift());
	}

	pushInitial(initialConfig, migrateConfig)
	{
		let initialChoices = makeChoices(this.choiceList, initialConfig.other);
		let migrateChoices = makeChoices(this.choiceList, migrateConfig.other);
		this.week.push(new InitialShift(migrateConfig.chance, migrateConfig.home, migrateChoices, initialConfig.home, initialChoices));
	}

	pushMigrate(migrateConfig)
	{
		let migrateChoices = makeChoices(this.choiceList, migrateConfig.other);
		this.week.push(new MigrateShift(migrateConfig.chance, migrateConfig.home, migrateChoices));
	}

	setDays(config)
	{
		this.days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		this.dayTicks = (24 * 60 * 60) / config.realTick;
		this.currentDay = 0;
		this.hourTicks = (60 * 60) / config.realTick;
		this.startHour = config.startHour;
		this.currentHour = config.startHour;	
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

		let nextDay = Math.floor(this.clock / this.dayTicks);

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

			const timeElement = document.getElementById('time');
			timeElement.textContent = hour.toString().concat(':00') ;
		}

		if (this.oldSteps !== this.stepsPerFrame)
		{
			this.oldSteps = this.stepsPerFrame;

			const stepElement = document.getElementById('steps');
			stepElement.textContent = this.stepsPerFrame.toString();
		}
	}
}
