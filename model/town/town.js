/*
 *	Go to corner rooms via roads
 */


/*
 *	There is one main E/W road halfway up the model
 *  There are a set of equally spaced N/S feeder roads
 *  Path finding is
 *		Go E/W to the nearest feeder road
 *		Go N/S to the main road
 *		Go E/W to the feeder road nearest the dest
 *		Go N/S to the dest y co-ordinate
 *		Go E/W to the dest
 */

class TownState extends State
{
	constructor(config, width, height)
	{
		super(config, width, height);

		this.workList = [];
		this.houseList = [];
		this.otherList = [];
		this.outsideList = [];
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

		let offset = Math.round((config.feederSpace - width) / 2);
		let x = (config.bunkHouse.road * config.feederSpace) + offset;
		let top = config.size.height - count * height;

		let bunkHouses = stack(count, x, top, width, height);
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
		let offset = Math.round((config.feederSpace - 2 * width) / 2);
		let top = config.size.height - count * height;

		for (var road = config.house.startRoad; road <= config.house.endRoad; road++) 
		{
			let x = road * config.feederSpace + offset;
			let houses = twoStack(count, x, top, width, height);
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
		let left = row(1, 1, config.depth, config.left);
		Array.prototype.push.apply(this.roomList, left);
		Array.prototype.push.apply(this.workList, left);

		let right = row(config.size.width - (config.depth + 1), 1, config.depth, config.right);
		Array.prototype.push.apply(this.roomList, right);
		Array.prototype.push.apply(this.workList, right);
	}

	fillOther(config)
	{
		this.fillChurch(2 * config.feederSpace, config);
		this.fillPub(4 * config.feederSpace, config);
		this.fillClub(5 * config.feederSpace, config);

		this.fillChurch(8 * config.feederSpace, config);
		this.fillPub(10 * config.feederSpace, config);
		this.fillClub(11 * config.feederSpace, config);
		
		this.fillChurch(14 * config.feederSpace, config);
		this.fillPub(16 * config.feederSpace, config);
		this.fillClub(17 * config.feederSpace, config);

		this.fillOutside(config);
	}

	fillChurch(x, config)
	{
		let count = config.church.count;
		let width = config.church.width;
		let height = config.church.height;
		let churchs = stack(count, x, 1, width, height);
		Array.prototype.push.apply(this.roomList, churchs);
		Array.prototype.push.apply(this.otherList, churchs);
	}

	fillClub(x, config)
	{
		let count = config.club.count;
		let width = config.club.width;
		let height = config.club.height;
		let clubs = stack(count, x, 1, width, height);
		Array.prototype.push.apply(this.roomList, clubs);
		Array.prototype.push.apply(this.otherList, clubs);
	}

	fillPub(x, config)
	{
		let count = config.pub.count;
		let width = config.pub.width;
		let height = config.pub.width;
		let pubs = twoStack(count, x, 1, width, height);
		Array.prototype.push.apply(this.roomList, pubs);
		Array.prototype.push.apply(this.otherList, pubs);
	}

	fillOutside(config)
	{
		let width = config.outside.width;
		let height = config.outside.height;
		let y = config.outside.y;

		for (var i = config.outside.road ; i < config.outside.count; i++) 
		{
			let x = i * config.feederSpace;
			let outside = new Outside(x, y, width, height);
			this.roomList.push(outside);
			this.outsideList.push(outside);

			outside = new Outside(x + width, y, width, height);
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
}

const canvas = document.getElementById('canvas');

var state = new TownState(config, canvas.width, canvas.height);
state.fill(config);

// let context = canvas.getContext('2d');

// state.draw(context);

window.requestAnimationFrame(animate);

// for (var i = 100 - 1; i >= 0; i--) 
// {
// 	state.step(FRAME);
// }
