// other order [church, restaurant, pub, club, outside]

function makeConfig()
{
	const configuration = 
	{
		  size: {height: 505, width:1000}
		, background: "#ADD8E6"
		, coldColour: "#2C7BB6"
		, hotColour: "#D7191C"
		, openColour: "#D01C8B"
		, closedColour: "#4DAC26"

		, tooltips: {base: 6, streamXDelta: 1, streamYDelta: 1.5, placeDelta: 1}
		, stepsPerFrame: 
			{
				slow: {label: "Slow", value: 1, colour: "#2C7BB6"}
				, medium: {label: "Medium", value: 12, colour: "#857AA3"}
				, fast: {label: "Fast", value: 120, colour: "#D7191C"}
			}

		, secondsPerStep: {small: 10, large: 300}
		, startScore: 50000000
		, limit: 400
		, randomInfected: 100
		, startHour: 8
		, shiftLength: 4
		, offset: 4
		, personSize: 3
		, moveSpeed: 0.05
		, leaveSpeed: 0.1
		, deadSpeed: 0.001
		, moveVariation: 0.1
		, travelSpeed: 0.2
		, travelVariation: 0.2
		, count: 1000
		, main: 170
		, road : {style: "#333300", width: 4, space: 50, first: 1, last:1} 
		, churchRoads: [3, 8,13]
		, spacing: 5
		, depth: 80
		, workSpeed: 0.05
		, workBack: 0.001
		, left:[30, 55, 30, 80, 65, 70, 80, 20, 65]
		, right: [70, 30, 65, 75, 30, 90, 70, 65]
		, workAllocation: [7, 15, 6, 16, 13, 14, 16, 4, 13, 14, 6, 13, 15, 6, 18, 14, 14]
		, workType: {meat: {start: 0, end: 3}, office: {start:4, end: 11}, school: {start: 12, end:16}}
		, workScale:{maxAllocation: 20, ventilation: {min: 10, max: 20}, loudness: {min: 5, max: 10}}


// workStyle is indexed by C.WORKTYPE = {SCHOOLS:0, OFFICES: 1, MEAT: 2};

		, workStyle: ["#FFC2FF", "#A0C2A0", "#80C280"]

		 
		, fillFactor: 1.25
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

		, infection: {decay: 0.99999999999, reset: 0.00001, pScale: 1610000, damping: .25}

		, infectious: {pList: [0.7, 0,1, 0.1, 0.1], valueList: [0, 1, 10, 40]}

		, masks: 
			{
				factor: {infector: 0.35, infectee: 0.65}
				, specs:
				{
					none: {label: "None", value: 0.0, colour: "#2C7BB6", cost: 0}
					, encourage: {label: "Encourage", value: 0.5, colour: "#857AA3", cost:250}
					, require: {label: "Require", value: 0.8, colour: "#BE5A6F", cost: 500}
					, enforce: {label: "Enforce", value: 0.9, colour: "#D7191C", cost: 1000}
				}
			}

		, tests:
			{
				none: {label: "None", value: 0.0, colour: "#2C7BB6", cost: 0} 
				, light: {label: "Light", value: 0.001, colour: "#857AA3", cost: 100} 
				, heavy: {label: "Heavy", value: 0.01, colour: "#D7191C", cost: 200}
			}
		
		, trace:
			{
				none: {label: "None", value: 0.0, colour: "#2C7BB6", cost: 0}
				, forward: {label: "Forward", value: 0.0, colour: "#857AA3", cost: 400} 
				, backward: {label: "Backward", value: 0.0, colour: "#D7191C", cost: 800}
			}

		, isolate: 
			{
				none: {label: "None", value: 0.0, colour: "#2C7BB6", cost: 0}
				, encourage: {label: "Encourage", value: 0.25, homeSick: 0.5,  colour: "#857AA3", cost:250}
				, require: {label: "Require", value: 0.4, homeSick: 0.75, colour: "#BE5A6F", cost: 500}
				, enforce: {label: "Enforce", value: 0.6, homeSick: 0.9, colour: "#D7191C", cost: 1000}
			}

		, longEnough: {isolation: 14, positive: 14}
		
		, imageList: ["covid-uninfected", "covid-infected", "covid-recovered", "cross", "crescent", "star", "bigcross", "bigcrescent", "bigstar"]
	    , pop: {scale: 5, decay: 300}

// out, ward, icu, and hallway are indexed by 
// C.SICKNESS = {WELL: 0, ASYMPTOMATIC: 1, SICK: 2, HOMESICK: 3, WARDSICK: 4, ICUSICK: 5, DEAD: 6, RECOVERED: 7}

	    , damage:
	    	{
	    		scale: 0.5
	    		, opportunity: {amount: 1000, exponent: 1.5}
	    		, out: [0, 0, 1, 10, 100, 1000, 0, 0]
	    		, ward: [0, 0, 0, 0, 100, 10000, 0, 0]
	    		, icu: [0, 0, 0, 0, 0, 1000, 0, 0]
	    		, hallway: [0, 0, 0, 0, 1000, 100000, 0, 0]
	    	}   

	    , intervention:
	        {
	        	scale: 0.5
// arrays are indexed by the constants in the preceeding comment
// C.ROOMTYPE = {OPEN: 0, WORSHIP: 1, RESTAURANTS: 2, BARS: 3, CLUBS: 4, SCHOOLS: 5, OFFICES: 6, MEAT: 7, GROCERIES: 8, OUTSIDE: 9, PARTIES: 10};
	            , room: [0, 5000, 1000, 1000, 1000, 7000, 6000, 8000, 0, 5000, 5000]

	            , isolate: 3000
	        }

		, progression:
			[
			]

		, game: {update: 3}

	}


	return configuration;
}
