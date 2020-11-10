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
		this.fillHome(config);
		this.fillWork(config);
		this.fillOther(config);
	}

	fillHome(config)
	{
		this.fillBunkHouses(config);
		this.fillHouses(config);
	}

	fillBunkHouses(config)
	{
		let count = config.bunkHouseCount;
		let width = config.bunkHouseWidth;
		let height = config.bunkHouseHeight;

		let offset = Math.round((config.feederSpace - width) / 2);
		let x = config.feederSpace + offset;
		let top = config.size.height - count * height;

		let bunkHouses = stack(count, x, top, width, height);
		Array.prototype.push.apply(this.houseList, bunkHouses);
		Array.prototype.push.apply(this.roomList, bunkHouses);
	}

	fillHouses(config)
	{
		let count = config.houseCount;
		let width = config.houseWidth;
		let height = config.houseHeight;
		let offset = Math.round((config.feederSpace - 2 * width) / 2);
		let top = config.size.height - count * height;

		for (var road = config.houseStartRoad; road <= config.houseEndRoad; road++) 
		{
			let x = road * config.feederSpace + offset;
			let houses = twoStack(count, x, top, width, height);
			Array.prototype.push.apply(this.houseList, houses);
			Array.prototype.push.apply(this.roomList, houses);
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
		this.fillTheatre(1 * config.feederSpace, config);
		this.fillPub(2 * config.feederSpace, config);
		this.fillClub(3 * config.feederSpace, config);

		this.fillTheatre(4 * config.feederSpace, config);
		this.fillPub(5 * config.feederSpace, config);
		this.fillClub(6 * config.feederSpace, config);
		
		this.fillPub(7 * config.feederSpace, config);
		this.fillClub(8 * config.feederSpace, config);

		this.fillOutside(config);
	}

	fillTheatre(x, config)
	{
		let count = config.theatreCount;
		let width = config.theatreWidth;
		let height = config.theatreHeight;
		let theatres = stack(count, x, 1, width, height);
		Array.prototype.push.apply(this.roomList, theatres);
		Array.prototype.push.apply(this.otherList, theatres);
	}

	fillClub(x, config)
	{
		let count = config.clubCount;
		let width = config.clubWidth;
		let height = config.clubHeight;
		let clubs = stack(count, x, 1, width, height);
		Array.prototype.push.apply(this.roomList, clubs);
		Array.prototype.push.apply(this.otherList, clubs);
	}

	fillPub(x, config)
	{
		let count = config.pubCount;
		let width = config.pubWidth;
		let height = config.pubHeight;
		let pubs = twoStack(count, x, 1, width, height);
		Array.prototype.push.apply(this.roomList, pubs);
		Array.prototype.push.apply(this.otherList, pubs);
	}

	fillOutside(config)
	{
		let width = config.outsideWidth;
		let height = config.outsideHeight;
		let y = config.outsideY;

		for (var i = 1 ; i < config.outsideCount; i++) 
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

	// 	for (var i = 0; i < config.count; i++) 
	// 	{
	// 		let person = new Person();
	// 		this.personList[i] = person;
	// 		this.roomList[i % this.roomList.length].insert(person);
	// 	}
	// 
}

const canvas = document.getElementById('canvas');

var state = new TownState(config, canvas.width, canvas.height);
state.fill(config);

window.requestAnimationFrame(animate);

// for (var i = 100 - 1; i >= 0; i--) 
// {
// 	state.step(FRAME);
// }
