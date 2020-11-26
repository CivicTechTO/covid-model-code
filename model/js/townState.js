
class TownState extends State
{
	constructor(config, width, height)
	{
		super(config, width, height);

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
	}

	fill(config)
	{
		let dwellings = [];
		let crowd = [];

		this.fillHome(config, dwellings, crowd);
		this.fillWork(config);
		this.fillOther(config);

		this.fillPersons(config);

		this.setHomes(config, dwellings, crowd);
		this.setWork(config);
		this.setChurch(config);			// After setHomes

		this.setWeek(config);
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

	fillChurch(x, church)
	{
		let actual = x + church.offset;
		let churchs = stack(church.count, actual, 1, church.width, church.height, church.speed);
		Array.prototype.push.apply(this.roomList, churchs);
		Array.prototype.push.apply(this.churchList, churchs);
	}

	fillClub(x, club)
	{
		let actual = x + club.offset;
		let clubs = stack(club.count, actual, 1, club.width, club.height, club.speed);
		Array.prototype.push.apply(this.roomList, clubs);
		Array.prototype.push.apply(this.clubList, clubs);
	}

	fillPub(x, pub)
	{
		let actual = x + pub.offset;
		let pubs = twoStack(pub.count, actual, 1, pub.width, pub.height, pub.speed);
		Array.prototype.push.apply(this.roomList, pubs);
		Array.prototype.push.apply(this.pubList, pubs);
	}

	fillRestaurant(x, resto)
	{
		let actual = x + resto.offset;
		let restaurants = twoStack(resto.count, actual, 1, resto.width, resto.height, resto.speed);
		Array.prototype.push.apply(this.roomList, restaurants);
		Array.prototype.push.apply(this.restaurantList, restaurants);
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
			person.work = chooseOne(choices);
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

				if (roll < config.sunday.outside)
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
		let choices;

		for (let i = 0 ; i < 4 ; i++)
		{
			this.week.push(new Day());
			this.week.push(new Shift());
			choices = makeChoices(this.choiceList, config.weekNight.other);
			this.week.push(new OtherShift(config.weekNight.home, choices));
			this.after();
		}

		this.week.push(new Day());
		this.week.push(new Shift());
		choices = makeChoices(this.choiceList, config.fridayNight.other);
		this.week.push(new OtherShift(config.fridayNight.home, choices));
		this.after();

		choices = makeChoices(this.choiceList, config.saturday.other);
		this.week.push(new OtherShift(config.saturday.home, choices));
		this.week.push(new Shift());
		choices = makeChoices(this.choiceList, config.saturdayNight.other);
		this.week.push(new OtherShift(config.saturdayNight.home, choices));
		this.after();

		choices = makeChoices(this.choiceList, config.sundayMorning.other);
		this.week.push(new OtherShift(config.sundayMorning.home, choices));
		choices = makeChoices(this.choiceList, config.sunday.other);
		this.week.push(new OtherShift(config.sunday.home, choices));
		choices = makeChoices(this.choiceList, config.weekNight.other);
		this.week.push(new OtherShift(config.weekNight.home, choices));
		this.after();
	}

	after()
	{
		this.week.push(new Shift());
		this.week.push(new Night());
		this.week.push(new Shift());
	}
}
