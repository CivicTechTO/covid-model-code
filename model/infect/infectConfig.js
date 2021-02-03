// other order [church, restaurant, pub, club, outside]

const config = {
	  "size": {"height": 505, "width":1000}
	, "stepsPerFrame": 10
	, "realTick": 15
	, "startHour": 8
	, "shiftLength": 960
	, "offset": 4
	, "personSize": 3
	, "moveSpeed": 0.5
	, "leaveSpeed": 1
	, "deadSpeed": 0.1
	, "moveVariation": 1
	, "travelSpeed": 10
	, "travelVariation": 4
	, "count": 1000
	, "main": 170
	, "road" : {"style": "#7777ff", "space": 50, "first": 2, "last":18} 
	, "churchRoads": [3, 8,13]
	, "spacing": 5
	, "depth": 80
	, "workSpeed": 0.5
	, "workBack": 0.001
	, "left":[30, 55, 30, 80, 65, 70, 80, 20, 65]
	, "right": [70, 30, 65, 75, 30, 90, 70, 65]
	, "workAllocation": [7, 15, 6, 16, 13, 14, 16, 4, 13, 14, 6, 13, 15, 6, 18, 14, 14]
	, "fillFactor": 1.25

	, "dwelling": {"start": 100, "pause": 30, "speed": 0.25}
	, "bunkHouse": {"count": 20, "width": 40, "height": 10, "crowd": 4, "road": 2, "buffer": 5}
	, "house": {"count": 20, "width": 20, "height": 10, "crowd": 1, "startRoad": 3, "endRoad": 17, "buffer": 5}
	, "church": 
		{
			"count": 2, "width": 80, "height": 80, "crowd": 24, "offset": 10, "speed": 0.5
			, "halfEdge": 20, "start": 100, "pause": 100, "millingTime": 240, "sitTime": 480
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
			"y": 180, "road": 2, "count": 16, "width": 25, "height": 100, "crowd": 1
			, "halfEdge": 12, "start":1, "pause": 1, "speed": 0.5
		}

	, "hospital": 
		{
			"y": 180, "road": 16, "offset": 10, "width": 35, "speed": 1
			,"icu": {"height": 10, "columns": 1, "rows": 1}
			, "ward": {"height": 10, "columns": 5, "rows": 1}
			, "hallway": {"height": 80, "columns": 5, "rows": 20}
		}

	, "cemetary": {"y": 180, "road": 17, "offset": 10, "width": 35, "height": 100, "speed": 0.1}

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

	, "decay": 0.999
	, "reset": 0.001
	, "base": 1610000
	, "logCount": 2
	, "pScale": 0.00025
	
	, "infectious":
		{
			"not": {"chance": 0.7, "load": 0}
			, "slightly": {"chance": 0.1, "load": 1}
			, "very": {"chance": 0.1, "load": 10}
			, "exceedingly": {"chance": 0.1, "load": 40}
		}
	, "cross": 2
	, "progression":
		[
			{
			  	"index": 0, "style": "#0000FF", "draw":0, "infectable": true, "infectious": false, "canProgress": false, "time": undefined
			  	, "next": 1, "worse": {"p": 0.0, "next": 1}, "start": 0.0, "end": 0.0, "sick": 0, "change": false
			}
			, {
			  	"index": 1, "style": "#FF4444", "draw":1, "infectable": false, "infectious": false, "canProgress": true, "time": 4
			  	, "next": 2, "worse": {"p": 0.0, "next": 2}, "start": 0.0, "end": 0.0, "sick": 1, "change": false
			}
			, {
			  	"index": 2, "style": "#FF2222", "draw":2, "infectable": false, "infectious": true, "canProgress": true, "time": 2
			  	, "next": 3, "worse": {"p": 0.30, "next": 6}, "start": 0.0, "end": 1.0, "sick": 1, "change": false
			}
			, {
			  	"index": 3, "style": "#FF1111", "draw":3, "infectable": false, "infectious": true, "canProgress": true, "time": 4
			  	, "next": 4, "worse": {"p": 0.0, "next": 4}, "start": 1.0, "end": 1.0, "sick": 1, "change": false
			}
			, {
			  	"index": 4, "style": "#FF3333", "draw":4, "infectable": false, "infectious": true, "canProgress": true, "time": 6
			  	, "next": 5, "worse": {"p": 0.0, "next": 5}, "start": 1.0, "end": 0.0, "sick": 1, "change": false
			}
			, {
			  	"index": 5, "style": "#1111FF", "draw":5, "infectable": false, "infectious": false, "canProgress": false, "time": 1
			  	, "next": undefined, "worse": {"p": 0.0, "next": undefined}, "start": undefined, "end": undefined, "sick": 0, "change": true
			}
			, {
			  	"index": 6, "style": "#FF4444", "draw":6, "infectable": false, "infectious": true, "canProgress": true, "time": 1
			  	, "next": 7, "worse": {"p": 0.40, "next": 9}, "start": 1.0, "end": 1.0, "sick": 2, "change": true
			}
			, {
			  	"index": 7, "style": "#FF4444", "draw":6, "infectable": false, "infectious": true, "canProgress": true, "time": 5
			  	, "next": 8, "worse": {"p": 0.0, "next": 5}, "start": 1.0, "end": 1.0, "sick": 2, "change": false
			}
			, {
			  	"index": 8, "style": "#FF4444", "draw":6, "infectable": false, "infectious": true, "canProgress": true, "time": 5
			  	, "next": 5, "worse": {"p": 0.0, "next": 5}, "start": 1.0, "end": 0.0, "sick": 2, "change": false
			}
			, {
			  	"index": 9, "style": "#FF3333", "draw":7, "infectable": false, "infectious": true, "canProgress": true, "time": 1
			  	, "next": 10, "worse": {"p": 0.40, "next": 13}, "start": 1.0, "end": 1.0, "sick": 3, "change": true
			}
			, {
			  	"index": 10, "style": "#FF3333", "draw":7, "infectable": false, "infectious": true, "canProgress": true, "time": 6
			  	, "next": 11, "worse": {"p": 0.0, "next": 11}, "start": 1.0, "end": 1.0, "sick": 3, "change": false
			}
			, {
			  	"index": 11, "style": "#FF3333", "draw":7, "infectable": false, "infectious": true, "canProgress": true, "time": 5
			  	, "next": 12, "worse": {"p": 0.0, "next": 12}, "start": 1.0, "end": 1.0, "sick": 3, "change": false
			}
			, {
			  	"index": 12, "style": "#FF3333", "draw":7, "infectable": false, "infectious": true, "canProgress": true, "time": 5
			  	, "next": 8, "worse": {"p": 0.0, "next": 8}, "start": 1.0, "end": 1.0, "sick": 3, "change": false
			}
			, {
			  	"index": 13, "style": "#FF1111", "draw":8, "infectable": false, "infectious": true, "canProgress": true, "time": 1
			  	, "next": 14, "worse": {"p": 0.50, "next": 17}, "start": 1.0, "end": 1.0, "sick": 4, "change": true
			}
			, {
			  	"index": 14, "style": "#FF1111", "draw":8, "infectable": false, "infectious": true, "canProgress": true, "time": 5
			  	, "next": 15, "worse": {"p": 0.0, "next": 15}, "start": 1.0, "end": 1.0, "sick": 4, "change": false
			}
			, {
			  	"index": 15, "style": "#FF1111", "draw":8, "infectable": false, "infectious": true, "canProgress": true, "time": 5
			  	, "next": 16, "worse": {"p": 0.0, "next": 16}, "start": 1.0, "end": 0.0, "sick": 4, "change": false
			}
			, {
			  	"index": 16, "style": "#FF1111", "draw":8, "infectable": false, "infectious": false, "canProgress": true, "time": 5
			  	, "next": 12, "worse": {"p": 0.0, "next": 12}, "start": 0.0, "end": 0.0, "sick": 4, "change": false
			}
			, {
			  	"index": 17, "style": "#FF1111", "draw":8, "infectable": false, "infectious": false, "canProgress": true, "time": 15
			  	, "next": 18, "worse": {"p": 0.0, "next": 18}, "start": 0.0, "end": 0.0, "sick": 4, "change": false
			}
			, {
			  	"index": 18, "style": "#FFFFFF", "draw": 9, "infectable": false, "infectious": false, "canProgress": false, "time": undefined
			  	, "next": undefined, "worse": {"p": 0.0, "next": undefined}, "start": 0.0, "end": 0.0, "sick": 5, "change": true
			}
		]
}

