// other order [church, restaurant, pub, club, outside]

const config = {
	  size: {height: 505, width:1000}
	, background: "#ADD8E6"
	, stepsPerFrame: 1
	, realTick: 120
	, startHour: 8
	, shiftLength: 4
	, offset: 4
	, personSize: 3
	, moveSpeed: 0.05
	, leaveSpeed: 0.1
	, deadSpeed: 0.01
	, moveVariation: 0.1
	, travelSpeed: 0.2
	, travelVariation: 0.2
	, count: 1000
	, main: 170
	, road : {style: "#7777FF", width: 4, space: 50, first: 2, last:18} 
	, churchRoads: [3, 8,13]
	, spacing: 5
	, depth: 80
	, workSpeed: 0.05
	, workBack: 0.001
	, left:[30, 55, 30, 80, 65, 70, 80, 20, 65]
	, right: [70, 30, 65, 75, 30, 90, 70, 65]
	, workAllocation: [7, 15, 6, 16, 13, 14, 16, 4, 13, 14, 6, 13, 15, 6, 18, 14, 14]
	, workScale:{maxAllocation: 20, ventilation: {min: 10, max: 20}, loudness: {min: 5, max: 10}}
	, workStyle: "#C2C2C2"
	, fillFactor: 1.25
	, dwelling: {start: 10, pause: 5, speed: 0.025}
	, bunkHouse: 
		{
			style: "#C2C2C2", count: 20, width: 40, height: 10, crowd: 4, road: 2, buffer: 5
			, ventilation: {low: 1, high: 2}, loudness:{low:2, high: 5}
		}
	, house: 
		{
			style: "#C2C2C2", count: 20, width: 20, height: 10, crowd: 1, startRoad: 3, endRoad: 17, buffer: 5
			, ventilation: {low: 1, high: 2}, loudness:{low:2, high: 3}
		}
	, church: 
		{
			style: "#C2C2C2", count: 2, width: 80, height: 80, crowd: 24, offset: 10, speed: 0.05
			, halfEdge: 20, start: 10, pause: 10, millingTime: 60, sitTime: 120
			, separation: 1
			, ventilation: [6, 11, 14, 9, 8, 15], loudness: [40, 38, 37, 40, 37, 36]
		}
	, restaurant: 
		{
			style: "#C2C2C2", count: 4, width: 20, height: 40, crowd: 2, offset: 4, speed: 0.05
			, separation: 1
			, ventilation: {low: 8, high: 12}, loudness:{low:5, high: 15}
		}
	, pub: 
		{
			style: "#C2C2C2", count: 4, width: 20, height: 40, crowd: 1, offset: 4, speed: 0.025
			, ventilation: {low: 20, high: 30}, loudness:{low:15, high: 30}
		}
	, club: 
		{
			style: "#C2C2C2", count: 4, width: 40, height: 40, crowd: 8, offset: 4, speed: 0.075, halfEdge: 5
			, ventilation: {low: 6, high: 9}, loudness:{low:30, high: 40}
		}
	, outside: 
		{
			style: "#80FF80", y: 180, road: 2, count: 17, width: 25, height: 100, crowd: 1
			, halfEdge: 12, start:1, pause: 1, speed: 0.05, ventilation: 100
		}

	, hospital: 
		{
			style: "#C2C2C2", y: 1, road: 17, offset: 8, width: 35, speed: 0.1
			,icu: {height: 10, count: 1}
			, ward: {height: 10, count: 5}
			, hallway: {height: 140}
		}

	, cemetary: {style: "#008800", y: 180, road: 17, offset: 8, width: 35, height: 100, speed: 0.01}

	, ventilation: {width: 2, max:40, colours: {low: {r: 127, g: 127, b: 255}, high: {r: 0, g: 0, b: 255}}}
	, loudness: {width: 2, max:40, colours: {low: {r: 255, g: 127, b: 127}, high: {r: 255, g: 0, b: 0}}}

	, sundayMorning: {home: 0.25, outside: 0.25}
	, sundayAfternoon: 
		{
			initial: {hostChance: 0.3, home: 0.50, other: [0, 1, 1, 0, 1, 1]}
			, migrate: {chance: 0.001, home: 0.50, other: [0, 1, 1, 0, 1, 1]}
		}

	, sundayEve: {migrate: {chance: 0.001, home: 0.50, other: [0, 1, 1, 0, 1, 1]}}
	, sundayNight: {migrate: {chance: 0.001, home: 0.50, other: [0, 1, 1, 2, 1, 1]}}

	, weekday: {home: 0.1}
	, weekdayEve: 
		{
			initial: {hostChance: 0.3, home: 0.50, other: [0, 5, 2, 0, 1, 1]}
			, migrate: {chance: 0.001, home: 0.50, other: [0, 5, 2, 0, 1, 1]}
		}

	, weekdayNight: {migrate: {chance: 0.001, home: 0.50, other: [0, 5, 4, 10, 1, 1]}}
	, fridayEve: 
		{
			initial: {hostChance: 0.3, home: 0.25, other: [0, 0, 1, 1, 0, 1]}
			, migrate: {chance: 0.001, home: 0.25, other: [0, 1, 1, 0, 1, 1]}
		}

	, fridayNight: {migrate: {chance: 0.001, home: 0.25, other: [0, 1, 1, 10, 1, 1]}}
	
	, saturdayMorning: 
		{
			initial: {hostChance: 0.3, home: 0.1, other: [0, 1, 1, 0, 1, 1]}
			, migrate: {chance: 0.001, home: 0.25, other: [0, 1, 1, 0, 1, 1]}
		}
		
	, saturdayAfternoon: {migrate: {chance: 0.001, home: 0.1, other: [0, 1, 1, 0, 1, 1]}}
	, saturdayEve: {migrate: {chance: 0.001, home: 0.1, other: [0, 1, 1, 0, 1, 1]}}
	, saturdayNight: {migrate: {chance: 0.001, home: 0.1, other: [0, 1, 5, 10, 1, 1]}}

	, infection:
		{
			decay: 0.999, reset: 0.00001, maximum: 1610000
			, which: 1, params: [{log: false,  pScale: 0.25}, {log: true,  pScale: 0.00025}]
		}

	, infectious: {pList: [0.7, 0,1, 0.1, 0.1], valueList: [0, 1, 10, 40]}
	
	, imageList: ["wellsmile", "frown", "recoveredsmile", "cross", "crescent", "star"]
	, pop: {scale: 4, decay: 30}

	, progression:
		[
			{
			  	index: 0, display: [{pop: false, image: 0}, {pop: false, image: 0}], time: undefined
			  	, next: 0, alt: {p: 0.0, next: 0}, start: 0.0, end: 0.0, sick: 0, increment: 0, decrement: 0
			}
			
			, {
			  	index: 1, display: [{pop: false, image: 2}, {pop: false, image: 2}], time: undefined
			  	, next: 1, alt: {p: 0.0, next: 1}, start: 0.0, end: 0.0, sick: 7, increment: 0, decrement: 0
			}
			, {
			  	index: 2, display : [{pop: false, image: 3}, {pop: false, image: 3}], time: undefined
			  	, next: 2, alt: {p: 0.0, next: 2}, start: 0.0, end: 0.0, sick: 6, increment: 0, decrement: 0
			}
			, {
			  	index: 3, display: [{pop: false, image: 4}, {pop: false, image: 4}], time: undefined
			  	, next: 3, alt: {p: 0.0, next: 3}, start: 0.0, end: 0.0, sick: 6, increment: 0, decrement: 0
			}
			, {
			  	index: 4, display : [{pop: false, image: 5}, {pop: false, image: 5}], time: undefined
			  	, next: 4, alt: {p: 0.0, next: 4}, start: 0.0, end: 0.0, sick: 6, increment: 0, decrement: 0
			}


			, {
			  	index: 5, display: [{pop: true, image: 1}, {pop: false, image: 0}], time: 96
			  	, next: 6, alt: {p: 0.0, next: 6}, start: 0.0, end: 0.0, sick: 1, increment: 1025, decrement: 512
			}
			, {
			  	index: 6, display: [{pop: false, image: 1}, {pop: false, image: 0}], time: 48
			  	, next: 7, alt: {p: 0.0, next: 7}, start: 0.0, end: 1.0, sick: 1, increment: 2, decrement: 1024
			}
			, {
			  	index: 7, display: [{pop: false, image: 1}, {pop: false, image: 1}], time: 12
			  	, next: 8, alt: {p: 0.30, next: 12}, start: 1.0, end: 1.0, sick: 2, increment: 4, decrement: 0
			}
			, {
			  	index: 8, display: [{pop: false, image: 1}, {pop: false, image: 1}], time: 36
			  	, next: 9, alt: {p: 0.30, next: 9}, start: 1.0, end: 1.0, sick: 2, increment: 0, decrement: 0
			}
			, {
			  	index: 9, display: [{pop: false, image: 1}, {pop: false, image: 1}], time: 120
			  	, next: 10, alt: {p: 0.0, next: 10}, start: 1.0, end: 0.0, sick: 2, increment: 0, decrement: 0
			}
			, {
			  	index: 10, display: [{pop: false, image: 0}, {pop: false, image: 1}], time: 120
			  	, next: 11, alt: {p: 0.0, next: 11}, start: 0.0, end: 0.0, sick: 2, increment: 0, decrement: 2
			}
			, {
			  	index: 11, display: [{pop: false, image: 0}, {pop: false, image: 0}], time: 1
			  	, next: 1, alt: {p: 0.0, next: 1}, start: 0.0, end: 0.0, sick: 7, increment: 256, decrement: 5
			}


			, {
			  	index: 12, display: [{pop: false, image: 1}, {pop: false, image: 1}], time: 12
			  	, next: 13, alt: {p: 0.0, next: 13}, start: 1.0, end: 1.0, sick: 3, increment: 8, decrement: 0
			}
			, {
			  	index: 13, display: [{pop: false, image: 1}, {pop: false, image: 1}], time: 36
			  	, next: 14, alt: {p: 0.0, next: 14}, start: 1.0, end: 1.0, sick: 3, increment: 0, decrement: 0
			}
			, {
			  	index: 14, display: [{pop: false, image: 1}, {pop: false, image: 1}], time: 120
			  	, next: 15, alt: {p: 0.0, next: 15}, start: 1.0, end: 0.0, sick: 3, increment: 0, decrement: 0
			}
			, {
			  	index: 15, display: [{pop: false, image: 0}, {pop: false, image: 1}], time: 120
			  	, next: 16, alt: {p: 0.0, next: 16}, start: 0.0, end: 0.0, sick: 3, increment: 0, decrement: 2
			}
			, {
			  	index: 16, display: [{pop: false, image: 0}, {pop: false, image: 1}], time: 24
			  	, next: 17, alt: {p: 0.0, next: 17}, start: 0.0, end: 0.0, sick: 1, increment: 0, decrement: 8 
			}
			, {
			  	index: 17, display: [{pop: false, image: 0}, {pop: false, image: 0}], time: 1
			  	, next: 1, alt: {p: 0.0, next: 1}, start: 0.0, end: 0.0, sick: 7, increment: 256, decrement: 5
			}




			// , {
			//   	index: 6, style: "#FF4444", draw:6,canProgress: true, time: 24
			//   	, next: 7, alt: {p: 0.40, next: 9}, start: 1.0, end: 1.0, sick: 2, increment: 0, decrement: 0
			// }
			// , {
			//   	index: 7, style: "#FF4444", draw:6,canProgress: true, time: 120
			//   	, next: 8, alt: {p: 0.0, next: 5}, start: 1.0, end: 1.0, sick: 2, increment: 0, decrement: 0
			// }
			// , {
			//   	index: 8, style: "#FF4444, draw:6,canProgress: true, time: 120
			//   	, next: 5, alt: {p: 0.0, next: 5}, start: 1.0, end: 0.0, sick: 2, increment: 0, decrement: 0
			// }


			// , {
			//   	index: 9, style: "#FF3333, draw:7,canProgress: true, time: 24
			//   	, next: 10, alt: {p: 0.40, next: 13}, start: 1.0, end: 1.0, sick: 4, increment: 0, decrement: 0
			// }
			// , {
			//   	index: 10, style: "#FF3333, draw:7,canProgress: true, time: 144
			//   	, next: 11, alt: {p: 0.0, next: 11}, start: 1.0, end: 1.0, sick: 4, increment: 0, decrement: 0
			// }
			// , {
			//   	index: 11, style: "#FF3333, draw:7,canProgress: true, time: 120
			//   	, next: 12, alt: {p: 0.0, next: 12}, start: 1.0, end: 1.0, sick: 4, increment: 0, decrement: 0
			// }
			// , {
			//   	index: 12, style: "#FF3333, draw:7,canProgress: true, time: 120
			//   	, next: 8, alt: {p: 0.0, next: 8}, start: 1.0, end: 1.0, sick: 4, increment: 0, decrement: 0
			// }


			// , {
			//   	index: 13, style: "#FF1111, draw:8,canProgress: true, time: 24
			//   	, next: 14, alt: {p: 0.50, next: 17}, start: 1.0, end: 1.0, sick: 5, increment: 0, decrement: 0
			// }
			// , {
			//   	index: 14, style: "#FF1111, draw:8,canProgress: true, time: 120
			//   	, next: 15, alt: {p: 0.0, next: 15}, start: 1.0, end: 1.0, sick: 5, increment: 0, decrement: 0
			// }
			// , {
			//   	index: 15, style: "#FF1111, draw:8,canProgress: true, time: 120
			//   	, next: 16, alt: {p: 0.0, next: 17}, start: 1.0, end: 0.0, sick: 5, increment: 0, decrement: 0
			// }
			// , {
			//   	index: 16, style: "#FF1111, draw:8,canProgress: true, time: 120
			//   	, next: 12, alt: {p: 0.0, next: 12}, start: 0.0, end: 0.0, sick: 5, increment: 0, decrement: 0
			// }


			// , {
			//   	index: 17, style: "#FF1111, draw:8,canProgress: true, time: 360
			//   	, next: 18, alt: {p: 0.0, next: 18}, start: 0.0, end: 0.0, sick: 5, increment: 0, decrement: 0
			// }
		]
}

