// other order [church, restaurant, pub, club, outside]

const config = {
	  "size": {"height": 500, "width":1000}
	, "stepsPerFrame": 1
	, "realTick": 15
	, "startHour": 8
	, "shiftLength": 960
	, "offset": 4
	, "personSize": 3
	, "moveSpeed": 0.5
	, "leaveSpeed": 1
	, "moveVariation": 1
	, "travelSpeed": 10
	, "travelVariation": 4
	, "count": 1000
	, "main": 200
	, "road" : {"space": 50, "first": 2, "last":18} 
	, "spacing": 5
	, "depth": 80
	, "workSpeed": 0.5
	, "workBack": 0.001
	, "left":[30, 55, 30, 80, 65, 70, 80, 20, 65]
	, "right": [70, 30, 65, 75, 30, 90, 70, 65]
	, "workAllocation": [7, 15, 6, 16, 13, 14, 16, 4, 13, 14, 6, 13, 15, 6, 18, 14, 14]
	, "fillFactor": 1.25

	, "dwelling": {"start": 100, "pause": 30}
	, "bunkHouse": {"count": 20, "width": 40, "height": 10, "crowd": 4, "road": 2, "speed": 0.25}
	, "house": 
		{
			"count": 20, "width": 20, "height": 10, "crowd": 1, "startRoad": 3, "endRoad": 17
			, "speed": 0.2
		}
	, "church": 
		{
			"count": 2, "width": 80, "height": 80, "crowd": 24, "offset": 5, "speed": 0.5
			, "halfEdge": 20, "start": 100, "pause": 100, "millingTime": 240, "sitTime": 600
			, "separation": 1
		}
	, "restaurant": 
		{
			"count": 4, "width": 20, "height": 40, "crowd": 2, "offset": 4, "speed": 0.5
			, "separation": 1
		}
	, "pub": {"count": 4, "width": 20, "height": 40, "crowd": 1, "offset": 4, "speed": 0.25}
	, "club": 
		{
			"count": 4, "width": 40, "height": 40, "crowd": 8, "offset": 4, "speed": 0.75
			, "halfEdge": 5
		}
	, "outside": 
		{
			"y": 180, "road": 2, "count": 18, "width": 25, "height": 100, "crowd": 1
			, "halfEdge": 12, "start":1, "pause": 1, "speed": 0.5
		}

	, "sundayMorning": {"home": 0.25, "outside": 0.25}
	, "sundayAfternoon": 
		{
			"initial": {"hostChance": 0.3, "home": 0.50, "other": [0, 1, 1, 0, 1, 1]}
			, "migrate": {"chance": 0.001, "home": 0.50, "other": [0, 1, 1, 0, 1, 1]}
		}

	, "sundayEve": {"migrate": {"chance": 0.001, "home": 0.50, "other": [0, 1, 1, 0, 1, 1]}}
	, "sundayNight": {"migrate": {"chance": 0.001, "home": 0.50, "other": [0, 1, 1, 2, 1, 1]}}

	, "weekday": {"home": 0.1}
	, "weekdayEve": 
		{
			"initial": {"hostChance": 0.3, "home": 0.50, "other": [0, 5, 2, 0, 1, 1]}
			, "migrate": {"chance": 0.001, "home": 0.50, "other": [0, 5, 2, 0, 1, 1]}
		}

	, "weekdayNight": {"migrate": {"chance": 0.001, "home": 0.50, "other": [0, 5, 4, 10, 1, 1]}}
	, "fridayEve": 
		{
			"initial": {"hostChance": 0.3, "home": 0.25, "other": [0, 0, 1, 1, 0, 1]}
			, "migrate": {"chance": 0.001, "home": 0.25, "other": [0, 1, 1, 0, 1, 1]}
		}

	, "fridayNight": {"migrate": {"chance": 0.001, "home": 0.25, "other": [0, 1, 1, 10, 1, 1]}}
	
	, "saturdayMorning": 
		{
			"initial": {"hostChance": 0.3, "home": 0.1, "other": [0, 1, 1, 0, 1, 1]}
			, "migrate": {"chance": 0.001, "home": 0.25, "other": [0, 1, 1, 0, 1, 1]}
		}
		
	, "saturdayAfternoon": {"migrate": {"chance": 0.001, "home": 0.1, "other": [0, 1, 1, 0, 1, 1]}}
	, "saturdayEve": {"migrate": {"chance": 0.001, "home": 0.1, "other": [0, 1, 1, 0, 1, 1]}}
	, "saturdayNight": {"migrate": {"chance": 0.001, "home": 0.1, "other": [0, 1, 5, 10, 1, 1]}}
}


