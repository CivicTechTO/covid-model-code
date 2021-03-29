// other order [church, restaurant, pub, club, outside]

function makeConfig()
{
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
		
		, imageList: ["covid-uninfected", "covid-infected", "covid-recovered", "cross", "crescent", "star"]
		, pop: {scale: 4, decay: 30}

		, progression:
			[
				{
				  	index: 0, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.WELL}, {pop: false, image: C.IMAGE.WELL}], time: undefined
				  			, next: 0, alt: {p: 0.0, next: 0}, start: 0.0, end: 0.0, sick: C.SICKNESS.WELL
				  			, increment: 0, decrement: 0
				  		}
				}
				
				, {
				  	index: 10, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.RECOVERED}, {pop: false, image: C.IMAGE.RECOVERED}], time: undefined
				  			, next: 10, alt: {p: 0.0, next: 10}, start: 0.0, end: 0.0, sick: C.SICKNESS.RECOVERED
				  			, increment: 0, decrement: 0
				  		}
				}
				, {
				  	index: 20, data: 
				  		{
				  			  display : [{pop: false, image: C.IMAGE.CROSS}, {pop: false, image: C.IMAGE.CROSS}], time: undefined
				  			, next: 20, alt: {p: 0.0, next: 20}, start: 0.0, end: 0.0, sick: C.SICKNESS.DEAD
				  			, increment: 0, decrement: 0
				  		}
				}
				, {
				  	index: 30, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.CRESCENT}, {pop: false, image: C.IMAGE.CRESCENT}], time: undefined
				  			, next: 30, alt: {p: 0.0, next: 30}, start: 0.0, end: 0.0, sick: C.SICKNESS.DEAD
				  			, increment: 0, decrement: 0
				  		}
				}
				, {
				  	index: 40, data: 
				  		{
				  			  display : [{pop: false, image: C.IMAGE.STAR}, {pop: false, image: C.IMAGE.STAR}], time: undefined
				  			, next: 40, alt: {p: 0.0, next: 40}, start: 0.0, end: 0.0, sick: C.SICKNESS.DEAD
				  			, increment: 0, decrement: 0
				  		}
				}

				, {
				  	index: 1000, data: 
				  		{
				  			  display: [{pop: true, image: C.IMAGE.SICK}, {pop: false, image: C.IMAGE.WELL}], time: 96
				  			, next: 1010, alt: {p: 0.0, next: 1010}, start: 0.0, end: 0.0, sick: C.SICKNESS.ASYMPTOMATIC
				  			, increment: C.RECORD.INFECTED | C.RECORD.INCUBATING, decrement: C.RECORD.WELL
				  		}
				}
				, {
				  	index: 1010, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.SICK}, {pop: false, image: C.IMAGE.WELL}], time: 48
				  			, next: 1020, alt: {p: 0.0, next: 1020}, start: 0.0, end: 1.0, sick: C.SICKNESS.ASYMPTOMATIC
				  			, increment: C.RECORD.INFECTIOUS, decrement: C.RECORD.INCUBATING
				  		}
				}
				, {
				  	index: 1020, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.SICK}, {pop: false, image: C.IMAGE.SICK}], time: 12
				  			, next: 1030, alt: {p: 0.3, next: 2000}, start: 1.0, end: 1.0, sick: C.SICKNESS.SICK
				  			, increment: C.RECORD.SICK, decrement: 0
				  		}
				}
				, {
				  	index: 1030, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.SICK}, {pop: false, image: C.IMAGE.SICK}], time: 36
						  	, next: 1040, alt: {p: 0.0, next: 1040}, start: 1.0, end: 1.0, sick: C.SICKNESS.SICK
						  	, increment: 0, decrement: 0
						}
				}
				, {
				  	index: 1040, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.SICK}, {pop: false, image: C.IMAGE.SICK}], time: 120
				  			, next: 1050, alt: {p: 0.0, next: 1050}, start: 1.0, end: 0.0, sick: C.SICKNESS.SICK
				  			, increment: 0, decrement: 0
				  		}
				}
				, {
				  	index: 1050, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.RECOVERED}, {pop: false, image: C.IMAGE.SICK}], time: 120
				  			, next: 1060, alt: {p: 0.0, next: 1060}, start: 0.0, end: 0.0, sick: C.SICKNESS.SICK
				  			, increment: 0, decrement: C.RECORD.INFECTIOUS
				  		}
				}
				, {
				  	index: 1060, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.RECOVERED}, {pop: false, image: C.IMAGE.RECOVERED}], time: 1
				  			, next: 10, alt: {p: 0.0, next: 10}, start: 0.0, end: 0.0, sick: C.SICKNESS.RECOVERED
				  			, increment: C.RECORD.RECOVERED, decrement: C.RECORD.INFECTED | C.RECORD.SICK
				  		}
				}



				, {
				  	index: 2000, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.SICK}, {pop: false, image: C.IMAGE.SICK}], time: 12
				  			, next: 2010, alt: {p: 0.3, next: 3000}, start: 1.0, end: 1.0, sick: C.SICKNESS.HOMESICK
				  			, increment: C.RECORD.HOMESICK, decrement: 0
				  		}
				}
				, {
				  	index: 2010, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.SICK}, {pop: false, image: C.IMAGE.SICK}], time: 36
				  			, next: 2020, alt: {p: 0.0, next: 2020}, start: 1.0, end: 1.0, sick: C.SICKNESS.HOMESICK
				  			, increment: 0, decrement: 0
				  		}
				}
				, {
				  	index: 2020, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.SICK}, {pop: false, image: C.IMAGE.SICK}], time: 120
				  			, next: 2030, alt: {p: 0.0, next: 2030}, start: 1.0, end: 0.0, sick: C.SICKNESS.HOMESICK
				  			, increment: 0, decrement: 0
				  		}
				}
				, {
				  	index: 2030, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.RECOVERED}, {pop: false, image: C.IMAGE.SICK}], time: 120
				  			, next: 2040, alt: {p: 0.0, next: 2040}, start: 0.0, end: 0.0, sick: C.SICKNESS.HOMESICK
				  			, increment: 0, decrement: C.RECORD.INFECTIOUS
				  		}
				}
				, {
				  	index: 2040, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.RECOVERED}, {pop: false, image: C.IMAGE.SICK}], time: 24
				  			, next: 2050, alt: {p: 0.0, next: 2050}, start: 0.0, end: 0.0, sick: C.SICKNESS.SICK
				  			, increment: 0, decrement: 8 
				  		}
				}
				, {
				  	index: 2050, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.RECOVERED}, {pop: false, image: C.IMAGE.RECOVERED}], time: 1
				  			, next: 10, alt: {p: 0.0, next: 10}, start: 0.0, end: 0.0, sick: C.SICKNESS.RECOVERED
				  			, increment: C.RECORD.RECOVERED, decrement: C.RECORD.INFECTED | C.RECORD.SICK
				  		}
				}



				, {
				  	index: 3000, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.SICK}, {pop: false, image: C.IMAGE.SICK}], time: 12
				  			, next: 3010, alt: {p: 0.4, next: 4000}, start: 1.0, end: 1.0, sick: C.SICKNESS.WARDSICK
				  			, increment: C.RECORD.WARDSICK, decrement: 0
				  		}
				}
				, {
				  	index: 3010, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.SICK}, {pop: false, image: C.IMAGE.SICK}], time: 36
				  			, next: 3020, alt: {p: 0.0, next: 3020}, start: 1.0, end: 1.0, sick: C.SICKNESS.WARDSICK
				  			, increment: 0, decrement: 0
				  		}
				}
				, {
				  	index: 3020, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.SICK}, {pop: false, image: C.IMAGE.SICK}], time: 120
				  			, next: 3030, alt: {p: 0.0, next: 3030}, start: 1.0, end: 0.0, sick: C.SICKNESS.WARDSICK
				  			, increment: 0, decrement: 0
				  		}
				}
				, {
				  	index: 3030, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.RECOVERED}, {pop: false, image: C.IMAGE.SICK}], time: 100
				  			, next: 3040, alt: {p: 0.0, next: 3040}, start: 0.0, end: 0.0, sick: C.SICKNESS.WARDSICK
				  			, increment: 0, decrement: C.RECORD.INFECTIOUS
				  		}
				}
				, {
				  	index: 3040, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.RECOVERED}, {pop: false, image: C.IMAGE.SICK}], time: 40
				  			, next: 3050, alt: {p: 0.0, next: 3050}, start: 0.0, end: 0.0, sick: C.SICKNESS.HOMESICK
				  			, increment: 0, decrement: C.RECORD.WARDSICK
				  		}
				}
				, {
				  	index: 3050, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.RECOVERED}, {pop: false, image: C.IMAGE.SICK}], time: 24
				  			, next: 3060, alt: {p: 0.0, next: 3060}, start: 0.0, end: 0.0, sick: C.SICKNESS.SICK
				  			, increment: 0, decrement: C.RECORD.HOMESICK 
				  		}
				}
				, {
				  	index: 3060, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.RECOVERED}, {pop: false, image: C.IMAGE.RECOVERED}], time: 1
				  			, next: 10, alt: {p: 0.0, next: 10}, start: 0.0, end: 0.0, sick: C.SICKNESS.RECOVERED
				  			, increment: C.RECORD.RECOVERED, decrement: C.RECORD.INFECTED | C.RECORD.SICK
				  		}
				}



				, {
				  	index: 4000, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.SICK}, {pop: false, image: C.IMAGE.SICK}], time: 12
				  			, next: 4010, alt: {p: 0.7, next: 5000}, start: 1.0, end: 1.0, sick: C.SICKNESS.ICUSICK
				  			, increment: C.RECORD.ICUSICK, decrement: 0
				  		}
				}
				, {
				  	index: 4010, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.SICK}, {pop: false, image: C.IMAGE.SICK}], time: 36
				  			, next: 4020, alt: {p: 0.0, next: 4020}, start: 1.0, end: 1.0, sick: C.SICKNESS.ICUSICK
				  			, increment: 0, decrement: 0
				  		}
				}
				, {
				  	index: 4020, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.SICK}, {pop: false, image: C.IMAGE.SICK}], time: 120
				  			, next: 4030, alt: {p: 0.0, next: 4030}, start: 1.0, end: 0.0, sick: C.SICKNESS.WARDSICK
				  			, increment: 0, decrement: C.RECORD.ICUSICK
				  		}
				}
				, {
				  	index: 4030, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.RECOVERED}, {pop: false, image: C.IMAGE.SICK}], time: 100
				  			, next: 3040, alt: {p: 0.0, next: 3040}, start: 0.0, end: 0.0, sick: C.SICKNESS.WARDSICK
				  			, increment: 0, decrement: C.RECORD.INFECTIOUS
				  		}
				}
				, {
				  	index: 4040, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.RECOVERED}, {pop: false, image: C.IMAGE.SICK}], time: 40
				  			, next: 4050, alt: {p: 0.0, next: 4050}, start: 0.0, end: 0.0, sick: C.SICKNESS.HOMESICK
				  			, increment: 0, decrement: C.RECORD.WARDSICK
				  		}
				}
				, {
				  	index: 4050, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.RECOVERED}, {pop: false, image: C.IMAGE.SICK}], time: 24
				  			, next: 4060, alt: {p: 0.0, next: 4060}, start: 0.0, end: 0.0, sick: C.SICKNESS.SICK
				  			, increment: 0, decrement: C.RECORD.HOMESICK 
				  		}
				}
				, {
				  	index: 4060, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.RECOVERED}, {pop: false, image: C.IMAGE.RECOVERED}], time: 1
				  			, next: 10, alt: {p: 0.0, next: 10}, start: 0.0, end: 0.0, sick: C.SICKNESS.RECOVERED
				  			, increment: C.RECORD.RECOVERED, decrement: C.RECORD.INFECTED | C.RECORD.SICK
				  		}
				}



				, {
				  	index: 5000, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.SICK}, {pop: false, image: C.IMAGE.SICK}], time: 10
				  			, next: 5010, alt: {p: 0.0, next: 5010}, start: 1.0, end: 1.0, sick: C.SICKNESS.ICUSICK
				  			, increment: 0, decrement: 0
				  		}
				}
				, {
				  	index: 5010, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.SICK}, {pop: false, image: C.IMAGE.SICK}], time: 20
				  			, next: 5020, alt: {p: 0.0, next: 5020}, start: 1.0, end: 0.0, sick: C.SICKNESS.ICUSICK
				  			, increment: 0, decrement: 0
				  		}
				}
				, {
				  	index: 5020, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.SICK}, {pop: false, image: C.IMAGE.SICK}], time: 30
				  			, next: 5030, alt: {p: 0.0, next: 5030}, start: 0.0, end: 0.0, sick: C.SICKNESS.ICUSICK
				  			, increment: 0, decrement: C.RECORD.INFECTIOUS
				  		}
				}



				, {
				  	index: 5030, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.SICK}, {pop: false, image: C.IMAGE.SICK}], time: 1
				  			, next: 5060, alt: {p: 0.2, next: 5040}, start: 0.0, end: 0.0, sick: C.SICKNESS.ICUSICK
				  			, increment: 0, decrement: 0
				  		}
				}
				, {
				  	index: 5040, data: 
				  		{
				  			  display: [{pop: false, image: C.IMAGE.SICK}, {pop: false, image: C.IMAGE.SICK}], time: 1
				  			, next: 5070, alt: {p: 0.5, next: 5080}, start: 0.0, end: 0.0, sick: C.SICKNESS.ICUSICK
				  			, increment: 0, decrement: 0
				  		}
				}



				, {
				  	index: 5060, data: 
				  		{
				  			  display: [{pop: true, image: C.IMAGE.CROSS}, {pop: true, image: C.IMAGE.CROSS}], time: 1
				  			, next: 20, alt: {p: 0.0, next: 20}, start: 0.0, end: 0.0, sick: C.SICKNESS.DEAD
				  			, increment: C.RECORD.DEAD
				  			, decrement: C.RECORD.ICUSICK | C.RECORD.WARDSICK | C.RECORD.HOMESICK | C.RECORD.SICK | C.RECORD.INFECTED
				  		}
				}
				, {
				  	index: 5070, data: 
				  		{
				  			  display: [{pop: true, image: C.IMAGE.CRESCENT}, {pop: true, image: C.IMAGE.CRESCENT}], time: 1
				  			, next: 30, alt: {p: 0.0, next: 30}, start: 0.0, end: 0.0, sick: C.SICKNESS.DEAD
				  			, increment: C.RECORD.DEAD
				  			, decrement: C.RECORD.ICUSICK | C.RECORD.WARDSICK | C.RECORD.HOMESICK | C.RECORD.SICK | C.RECORD.INFECTED
				  		}
				}
				, {
				  	index: 5080, data: 
				  		{
				  			  display: [{pop: true, image: C.IMAGE.STAR}, {pop: true, image: C.IMAGE.STAR}], time: 1
				  			, next: 40, alt: {p: 0.0, next: 40}, start: 0.0, end: 0.0, sick: C.SICKNESS.DEAD
				  			, increment: C.RECORD.DEAD
				  			, decrement: C.RECORD.ICUSICK | C.RECORD.WARDSICK | C.RECORD.HOMESICK | C.RECORD.SICK | C.RECORD.INFECTED
				  		}
				}
			]
	}


	return config;
}
