// other order [church, restaurant, pub, club, outside]

const config = {
	  "size": {"height": 500, "width":1000}
	, "offset": 4
	, "personSize": 2
	, "moveSpeed": 1
	, "moveVariation": 1
	, "travelSpeed": 10
	, "travelVariation": 10
	, "count": 1000
	, "main": 200
	, "road" : {"space": 50, "first": 2, "last":18} 
	, "spacing": 5
	, "depth": 80
	, "shiftLength": 480
	, "left":[30, 55, 30, 80, 65, 70, 80, 20, 65]
	, "right": [70, 30, 65, 75, 30, 90, 70, 65]
	, "workAllocation": [12, 30, 6, 16, 13, 14, 16, 4, 13, 14, 6, 13, 15, 6, 18, 14, 14]
	, "fillFactor": 1.25
	, "bunkHouse": {"count": 20, "width": 40, "height": 10, "crowd": 4, "road": 2}
	, "house": {"count": 20, "width": 20, "height": 10, "crowd": 1, "startRoad": 3, "endRoad": 17}
	, "church": {"count": 2, "width": 80, "height": 80, "crowd": 24, "offset": 5}
	, "restaurant": {"count": 4, "width": 20, "height": 40, "crowd": 2, "offset": 4}
	, "pub": {"count": 4, "width": 20, "height": 40, "crowd": 1, "offset": 4}
	, "club": {"count": 4, "width": 40, "height": 40, "crowd": 8, "offset": 4}
	, "outside": {"y": 180, "road": 2, "count": 18, "width": 25, "height": 100, "crowd": 1}
	, "fridayNight": {"home": 0.25, "other": [1, 1, 1, 1, 1]}
	, "saturday": {"home": 0.1, "other": [1, 1, 1, 1, 1]}
	, "saturdayNight": {"home": 0.1, "other": [1, 1, 1, 1, 1]}
	, "sundayMorning": {"home": 0.20, "other": [4, 0, 0, 0, 1]}
	, "sunday": {"home": 0.50, "other": [1, 1, 1, 1, 1]}
	, "weekNight": {"home": 0.50, "other": [2, 5, 2, 1, 1]}
}


