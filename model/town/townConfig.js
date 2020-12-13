// other order [church, restaurant, pub, club, outside]

const config = {
	  "size": {"height": 500, "width":1000}
	, "stepsPerFrame": 1
	, "realTick": 15
	, "startHour": 8
	, "shiftLength": 960
	, "offset": 4
	, "personSize": 2
	, "moveSpeed": 0.25
	, "leaveSpeed": 1
	, "moveVariation": 1
	, "travelSpeed": 40
	, "travelVariation": 10
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
	, "bunkHouse": {"count": 20, "width": 40, "height": 10, "crowd": 4, "road": 2, "speed": 0.25}
	, "house": {"count": 20, "width": 20, "height": 10, "crowd": 1, "startRoad": 3, "endRoad": 17
		, "speed": 0.25}
	, "church": {"count": 2, "width": 80, "height": 80, "crowd": 24, "offset": 5, "speed": 0.25
		, "halfEdge": 20, "start": 100, "pause": 100, "millingTime": 120, "sitTime": 720}
	, "restaurant": {"count": 4, "width": 20, "height": 40, "crowd": 2, "offset": 4, "speed": 0.25
		, "separation": 1}
	, "pub": {"count": 4, "width": 20, "height": 40, "crowd": 1, "offset": 4, "speed": 0.25}
	, "club": {"count": 4, "width": 40, "height": 40, "crowd": 8, "offset": 4, "speed": 0.75
		, "halfEdge": 5}
	, "outside": {"y": 180, "road": 2, "count": 18, "width": 25, "height": 100, "crowd": 1
		, "halfEdge": 12, "start":1, "pause": 1, "speed": 0.25}

	, "sundayMorning": {"home": 0.20, "outside": 0.1}
	, "sundayAfternoon": {"initial": {"home": 0.50, "other": [0, 1, 1, 0, 1]}, "migrate": {"chance": 0.001, "home": 0.50, "other": [0, 1, 1, 0, 1]}}
	, "sundayEve": {"migrate": {"chance": 0.001, "home": 0.50, "other": [0, 1, 1, 0, 1]}}
	, "sundayNight": {"migrate": {"chance": 0.001, "home": 0.50, "other": [0, 1, 1, 2, 1]}}
	, "weekday": {"home": 0.1}
	, "weekdayEve": {"initial": {"home": 0.50, "other": [0, 5, 2, 0, 1]}, "migrate": {"chance": 0.001, "home": 0.50, "other": [0, 5, 2, 0, 1]}}
	, "weekdayNight": {"migrate": {"chance": 0.001, "home": 0.50, "other": [0, 5, 2, 4, 1]}}
	, "fridayEve": {"initial": {"home": 0.25, "other": [0, 0, 1, 1, 0, 1]}, "migrate": {"chance": 0.001, "home": 0.25, "other": [0, 1, 1, 0, 1]}}
	, "fridayNight": {"migrate": {"home": 0.25, "other": [0, 1, 1, 2, 1]}}
	, "saturdayMorning": {"initial": {"home": 0.1, "other": [0, 1, 1, 0, 1]}, "migrate": {"chance": 0.001, "home": 0.25, "other": [0, 1, 1, 0, 1]}}
	, "saturdayAfternoon": {"migrate": {"chance": 0.001, "home": 0.1, "other": [0, 1, 1, 0, 1]}}
	, "saturdayEve": {"migrate": {"chance": 0.001, "home": 0.1, "other": [0, 1, 1, 0, 1]}}
	, "saturdayNight": {"migrate": {"chance": 0.001, "home": 0.1, "other": [0, 1, 1, 4, 1]}}
}


