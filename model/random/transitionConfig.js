const config = {
	  "size": {"height": 500, "width":1000}
	, "stepsPerFrame": 1
	, "offset": 4
	, "personSize": 1
	, "moveSpeed": 0.1
	, "moveVariation": 1
	, "leaveSpeed": 1
	, "travelSpeed": 16
	, "travelVariation": 8
	, "count": 10000
	, "main": 250
	, "road": {"space": 100, "first": 1, "last": 9} 
	, "shiftLength": 1600
	, "sit": 900
	, "millabout": 400
	, "spacing": 4
	, "roomSize": 80
 	, "roomSpec": 
 		[
 			  {type: 2, args: {halfEdge: 39, start: 100, pause:10}, x: 5, y: 1}
 			, {type: 2, args: {halfEdge: 39, start: 100, pause:20}, x: 105, y: 1}
 			, {type: 2, args: {halfEdge: 39, start: 100, pause:30}, x: 205, y: 1}
 			, {type: 2, args: {halfEdge: 39, start: 100, pause:50}, x: 305, y: 1}
 			, {type: 2, args: {halfEdge: 39, start: 100, pause:80}, x: 405, y: 1}
 			, {type: 2, args: {halfEdge: 39, start: 100, pause:130}, x: 505, y: 1}
 			, {type: 2, args: {halfEdge: 39, start: 100, pause:210}, x: 605, y: 1}
 			, {type: 2, args: {halfEdge: 39, start: 100, pause:340}, x: 705, y: 1}
 			, {type: 2, args: {halfEdge: 39, start: 100, pause:550}, x: 805, y: 1}
 			, {type: 2, args: {halfEdge: 39, start: 100, pause:890}, x: 905, y: 1}

 			, {type: 2, args: {halfEdge: 39, start: 200, pause:10}, x: 5, y: 101}
 			, {type: 2, args: {halfEdge: 39, start: 200, pause:20}, x: 105, y: 101}
 			, {type: 2, args: {halfEdge: 39, start: 200, pause:30}, x: 205, y: 101}
 			, {type: 2, args: {halfEdge: 39, start: 200, pause:50}, x: 305, y: 101}
 			, {type: 2, args: {halfEdge: 39, start: 200, pause:80}, x: 405, y: 101}
 			, {type: 2, args: {halfEdge: 39, start: 200, pause:130}, x: 505, y: 101}
 			, {type: 2, args: {halfEdge: 39, start: 200, pause:210}, x: 605, y: 101}
 			, {type: 2, args: {halfEdge: 39, start: 200, pause:340}, x: 705, y: 101}
 			, {type: 2, args: {halfEdge: 39, start: 200, pause:550}, x: 805, y: 101}
 			, {type: 2, args: {halfEdge: 39, start: 200, pause:890}, x: 905, y: 101}
 			
 			, {type: 2, args: {halfEdge: 39, start: 400, pause:10}, x: 5, y: 201}
 			, {type: 2, args: {halfEdge: 39, start: 400, pause:20}, x: 105, y: 201}
 			, {type: 2, args: {halfEdge: 39, start: 400, pause:30}, x: 205, y: 201}
 			, {type: 2, args: {halfEdge: 39, start: 400, pause:50}, x: 305, y: 201}
 			, {type: 2, args: {halfEdge: 39, start: 400, pause:80}, x: 405, y: 201}
 			, {type: 2, args: {halfEdge: 39, start: 400, pause:130}, x: 505, y: 201}
 			, {type: 2, args: {halfEdge: 39, start: 400, pause:210}, x: 605, y: 201}
 			, {type: 2, args: {halfEdge: 39, start: 400, pause:340}, x: 705, y: 201}
 			, {type: 2, args: {halfEdge: 39, start: 400, pause:550}, x: 805, y: 201}
 			, {type: 2, args: {halfEdge: 39, start: 400, pause:890}, x: 905, y: 201}
 			
 			, {type: 2, args: {halfEdge: 39, start: 800, pause:10}, x: 5, y: 301}
 			, {type: 2, args: {halfEdge: 39, start: 800, pause:20}, x: 105, y: 301}
 			, {type: 2, args: {halfEdge: 39, start: 800, pause:30}, x: 205, y: 301}
 			, {type: 2, args: {halfEdge: 39, start: 800, pause:50}, x: 305, y: 301}
 			, {type: 2, args: {halfEdge: 39, start: 800, pause:80}, x: 405, y: 301}
 			, {type: 2, args: {halfEdge: 39, start: 800, pause:130}, x: 505, y: 301}
 			, {type: 2, args: {halfEdge: 39, start: 800, pause:210}, x: 605, y: 301}
 			, {type: 2, args: {halfEdge: 39, start: 800, pause:340}, x: 705, y: 301}
 			, {type: 2, args: {halfEdge: 39, start: 800, pause:550}, x: 805, y: 301}
 			, {type: 2, args: {halfEdge: 39, start: 800, pause:890}, x: 905, y: 301}
 			
 			, {type: 2, args: {halfEdge: 39, start: 1600, pause:10}, x: 5, y: 401}
 			, {type: 2, args: {halfEdge: 39, start: 1600, pause:20}, x: 105, y: 401}
 			, {type: 2, args: {halfEdge: 39, start: 1600, pause:30}, x: 205, y: 401}
 			, {type: 2, args: {halfEdge: 39, start: 1600, pause:50}, x: 305, y: 401}
 			, {type: 2, args: {halfEdge: 39, start: 1600, pause:80}, x: 405, y: 401}
 			, {type: 2, args: {halfEdge: 39, start: 1600, pause:130}, x: 505, y: 401}
 			, {type: 2, args: {halfEdge: 39, start: 1600, pause:210}, x: 605, y: 401}
 			, {type: 2, args: {halfEdge: 39, start: 1600, pause:340}, x: 705, y: 401}
 			, {type: 2, args: {halfEdge: 39, start: 1600, pause:550}, x: 805, y: 401}
 			, {type: 2, args: {halfEdge: 39, start: 1600, pause:890}, x: 905, y: 401}
 		]
}


