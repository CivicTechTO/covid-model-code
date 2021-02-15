// other order [church, restaurant, pub, club, outside]

const config = {
	  "size": {"height": 505, "width":1000}
	, "background": "#ADD8E6"
	, "stepsPerFrame": 1
	, "realTick": 120
	, "startHour": 8
	, "shiftLength": 4
	, "offset": 4
	, "personSize": 3
	, "moveSpeed": 0.05
	, "leaveSpeed": 0.1
	, "deadSpeed": 0.01
	, "moveVariation": 0.1
	, "travelSpeed": 0.2
	, "travelVariation": 0.2
	, "count": 1000
	, "main": 170
	, "road" : {"style": "#7777ff", "width": 4, "space": 50, "first": 2, "last":18} 
	, "churchRoads": [3, 8,13]
	, "spacing": 5
	, "depth": 80
	, "workSpeed": 0.05
	, "workBack": 0.001
	, "left":[30, 55, 30, 80, 65, 70, 80, 20, 65]
	, "right": [70, 30, 65, 75, 30, 90, 70, 65]
	, "workAllocation": [7, 15, 6, 16, 13, 14, 16, 4, 13, 14, 6, 13, 15, 6, 18, 14, 14]
	, "workScale":{"maxAllocation": 20, "ventilation": {"min": 10, "max": 20}, "loudness": {"min": 5, "max": 10}}
	, "workStyle": "#C2C2C2"
	, "fillFactor": 1.25
	, "dwelling": {"start": 10, "pause": 5, "speed": 0.025}
	, "bunkHouse": 
		{
			"style": "#C2C2C2", "count": 20, "width": 40, "height": 10, "crowd": 4, "road": 2, "buffer": 5
			, "ventilation": {"low": 1, "high": 2}, "loudness":{"low":2, "high": 5}
		}
	, "house": 
		{
			"style": "#C2C2C2", "count": 20, "width": 20, "height": 10, "crowd": 1, "startRoad": 3, "endRoad": 17, "buffer": 5
			, "ventilation": {"low": 1, "high": 2}, "loudness":{"low":2, "high": 3}
		}
	, "church": 
		{
			"style": "#C2C2C2", "count": 2, "width": 80, "height": 80, "crowd": 24, "offset": 10, "speed": 0.05
			, "halfEdge": 20, "start": 10, "pause": 10, "millingTime": 60, "sitTime": 120
			, "separation": 1
			, "ventilation": [6, 11, 14, 9, 8, 15], "loudness": [40, 38, 37, 40, 37, 36]
		}
	, "restaurant": 
		{
			"style": "#C2C2C2", "count": 4, "width": 20, "height": 40, "crowd": 2, "offset": 4, "speed": 0.05
			, "separation": 1
			, "ventilation": {"low": 8, "high": 12}, "loudness":{"low":5, "high": 15}
		}
	, "pub": 
		{
			"style": "#C2C2C2", "count": 4, "width": 20, "height": 40, "crowd": 1, "offset": 4, "speed": 0.025
			, "ventilation": {"low": 20, "high": 30}, "loudness":{"low":15, "high": 30}
		}
	, "club": 
		{
			"style": "#C2C2C2", "count": 4, "width": 40, "height": 40, "crowd": 8, "offset": 4, "speed": 0.075, "halfEdge": 5
			, "ventilation": {"low": 6, "high": 9}, "loudness":{"low":30, "high": 40}
		}
	, "outside": 
		{
			"style": "#80FF80", "y": 180, "road": 2, "count": 17, "width": 25, "height": 100, "crowd": 1
			, "halfEdge": 12, "start":1, "pause": 1, "speed": 0.05, "ventilation": 100
		}

	, "hospital": 
		{
			"style": "#C2C2C2", "y": 1, "road": 17, "offset": 10, "width": 35, "speed": 0.1
			,"icu": {"height": 10, "count": 1}
			, "ward": {"height": 10, "count": 5}
			, "hallway": {"height": 140}
		}

	, "cemetary": {"style": "#008800", "y": 180, "road": 17, "offset": 10, "width": 35, "height": 100, "speed": 0.01}

	, "ventilation": {"width": 2, "max":40, "colours": {"low": {"r": 127, "g": 127, "b": 255}, "high": {"r": 0, "g": 0, "b": 255}}}
	, "loudness": {"width": 2, "max":40, "colours": {"low": {"r": 255, "g": 127, "b": 127}, "high": {"r": 255, "g": 0, "b": 0}}}

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

	, "infection":
		{
			"decay": 0.999, "reset": 0.00001, "maximum": 1610000
			, "which": 1, "params": [{"log": false,  "pScale": 0.25}, {"log": true,  "pScale": 0.00025}]
		}

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
			  	"index": 0, "style": "#008800", "draw":0, "infectable": true, "infectious": false, "canProgress": false, "time": undefined
			  	, "next": 1, "worse": {"p": 0.0, "next": 1}, "start": 0.0, "end": 0.0, "sick": 0, "change": false, "delta": -1
			}
			, {
			  	"index": 1, "style": "#FF4444", "draw":1, "infectable": false, "infectious": false, "canProgress": true, "time": 96
			  	, "next": 2, "worse": {"p": 0.0, "next": 2}, "start": 0.0, "end": 0.0, "sick": 1, "change": false, "delta": 0
			}
			, {
			  	"index": 2, "style": "#FF2222", "draw":2, "infectable": false, "infectious": true, "canProgress": true, "time": 48
			  	, "next": 3, "worse": {"p": 0.30, "next": 6}, "start": 0.0, "end": 1.0, "sick": 1, "change": false, "delta": -1
			}
			, {
			  	"index": 3, "style": "#FF1111", "draw":3, "infectable": false, "infectious": true, "canProgress": true, "time": 120
			  	, "next": 4, "worse": {"p": 0.0, "next": 4}, "start": 1.0, "end": 1.0, "sick": 1, "change": false, "delta": -1
			}
			, {
			  	"index": 4, "style": "#FF3333", "draw":4, "infectable": false, "infectious": true, "canProgress": true, "time": 120
			  	, "next": 5, "worse": {"p": 0.0, "next": 5}, "start": 1.0, "end": 0.0, "sick": 1, "change": false, "delta": -1
			}
			, {
			  	"index": 5, "style": "#1111FF", "draw":5, "infectable": false, "infectious": false, "canProgress": false, "time": undefined
			  	, "next": undefined, "worse": {"p": 0.0, "next": undefined}, "start": undefined, "end": undefined, "sick": 0
			  	, "change": true, "delta": 1
			}
			, {
			  	"index": 6, "style": "#FF4444", "draw":6, "infectable": false, "infectious": true, "canProgress": true, "time": 24
			  	, "next": 7, "worse": {"p": 0.40, "next": 9}, "start": 1.0, "end": 1.0, "sick": 2, "change": true, "delta": -1
			}
			, {
			  	"index": 7, "style": "#FF4444", "draw":6, "infectable": false, "infectious": true, "canProgress": true, "time": 120
			  	, "next": 8, "worse": {"p": 0.0, "next": 5}, "start": 1.0, "end": 1.0, "sick": 2, "change": false, "delta": -1
			}
			, {
			  	"index": 8, "style": "#FF4444", "draw":6, "infectable": false, "infectious": true, "canProgress": true, "time": 120
			  	, "next": 5, "worse": {"p": 0.0, "next": 5}, "start": 1.0, "end": 0.0, "sick": 2, "change": false, "delta": -1
			}
			, {
			  	"index": 9, "style": "#FF3333", "draw":7, "infectable": false, "infectious": true, "canProgress": true, "time": 24
			  	, "next": 10, "worse": {"p": 0.40, "next": 13}, "start": 1.0, "end": 1.0, "sick": 4, "change": true, "delta": -1
			}
			, {
			  	"index": 10, "style": "#FF3333", "draw":7, "infectable": false, "infectious": true, "canProgress": true, "time": 144
			  	, "next": 11, "worse": {"p": 0.0, "next": 11}, "start": 1.0, "end": 1.0, "sick": 4, "change": false, "delta": -1
			}
			, {
			  	"index": 11, "style": "#FF3333", "draw":7, "infectable": false, "infectious": true, "canProgress": true, "time": 120
			  	, "next": 12, "worse": {"p": 0.0, "next": 12}, "start": 1.0, "end": 1.0, "sick": 4, "change": false, "delta": -1
			}
			, {
			  	"index": 12, "style": "#FF3333", "draw":7, "infectable": false, "infectious": true, "canProgress": true, "time": 120
			  	, "next": 8, "worse": {"p": 0.0, "next": 8}, "start": 1.0, "end": 1.0, "sick": 4, "change": false, "delta": -1
			}
			, {
			  	"index": 13, "style": "#FF1111", "draw":8, "infectable": false, "infectious": true, "canProgress": true, "time": 24
			  	, "next": 14, "worse": {"p": 0.50, "next": 17}, "start": 1.0, "end": 1.0, "sick": 5, "change": true, "delta": -1
			}
			, {
			  	"index": 14, "style": "#FF1111", "draw":8, "infectable": false, "infectious": true, "canProgress": true, "time": 120
			  	, "next": 15, "worse": {"p": 0.0, "next": 15}, "start": 1.0, "end": 1.0, "sick": 5, "change": false, "delta": -1
			}
			, {
			  	"index": 15, "style": "#FF1111", "draw":8, "infectable": false, "infectious": true, "canProgress": true, "time": 120
			  	, "next": 16, "worse": {"p": 0.0, "next": 17}, "start": 1.0, "end": 0.0, "sick": 5, "change": false, "delta": -1
			}
			, {
			  	"index": 16, "style": "#FF1111", "draw":8, "infectable": false, "infectious": false, "canProgress": true, "time": 120
			  	, "next": 12, "worse": {"p": 0.0, "next": 12}, "start": 0.0, "end": 0.0, "sick": 5, "change": false, "delta": -1
			}
			, {
			  	"index": 17, "style": "#FF1111", "draw":8, "infectable": false, "infectious": false, "canProgress": true, "time": 360
			  	, "next": 18, "worse": {"p": 0.0, "next": 18}, "start": 0.0, "end": 0.0, "sick": 5, "change": false, "delta": -1
			}
			, {
			  	"index": 18, "style": "#FFFFFF", "draw": 9, "infectable": false, "infectious": false, "canProgress": false, "time": undefined
			  	, "next": undefined, "worse": {"p": 0.0, "next": undefined}, "start": 0.0, "end": 0.0, "sick": 6
			  	, "change": true, "delta": 2
			}
		]
}

