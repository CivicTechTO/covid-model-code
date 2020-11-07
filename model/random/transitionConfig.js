const config = {
	  "size": {"height": 500, "width":1000}
	, "offset": 4
	, "personSize": 1
	, "moveSpeed": 1
	, "moveVariation": 1
	, "travelSpeed": 16
	, "travelVariation": 8
	, "count": 10000
	, "main": 250
	, "feederSpace": 100 
	, "when": 600
	, "sit": 300
	, "millabout": 400
	, "spacing": 4
	, "roomSize": 80
 	, "roomSpec": 
 		[
 			  {type: 2, args: {halfEdge: 39, start: 10, pause:10}, x: 5, y: 1}
 			, {type: 2, args: {halfEdge: 39, start: 10, pause:20}, x: 105, y: 1}
 			, {type: 2, args: {halfEdge: 39, start: 10, pause:30}, x: 205, y: 1}
 			, {type: 2, args: {halfEdge: 39, start: 10, pause:50}, x: 305, y: 1}
 			, {type: 2, args: {halfEdge: 39, start: 10, pause:80}, x: 405, y: 1}
 			, {type: 2, args: {halfEdge: 39, start: 10, pause:130}, x: 505, y: 1}
 			, {type: 2, args: {halfEdge: 39, start: 10, pause:210}, x: 605, y: 1}
 			, {type: 2, args: {halfEdge: 39, start: 10, pause:340}, x: 705, y: 1}
 			, {type: 2, args: {halfEdge: 39, start: 10, pause:550}, x: 805, y: 1}
 			, {type: 2, args: {halfEdge: 39, start: 10, pause:890}, x: 905, y: 1}

 			, {type: 2, args: {halfEdge: 39, start: 20, pause:10}, x: 5, y: 101}
 			, {type: 2, args: {halfEdge: 39, start: 20, pause:20}, x: 105, y: 101}
 			, {type: 2, args: {halfEdge: 39, start: 20, pause:30}, x: 205, y: 101}
 			, {type: 2, args: {halfEdge: 39, start: 20, pause:50}, x: 305, y: 101}
 			, {type: 2, args: {halfEdge: 39, start: 20, pause:80}, x: 405, y: 101}
 			, {type: 2, args: {halfEdge: 39, start: 20, pause:130}, x: 505, y: 101}
 			, {type: 2, args: {halfEdge: 39, start: 20, pause:210}, x: 605, y: 101}
 			, {type: 2, args: {halfEdge: 39, start: 20, pause:340}, x: 705, y: 101}
 			, {type: 2, args: {halfEdge: 39, start: 20, pause:550}, x: 805, y: 101}
 			, {type: 2, args: {halfEdge: 39, start: 20, pause:890}, x: 905, y: 101}
 			
 			, {type: 2, args: {halfEdge: 39, start: 40, pause:10}, x: 5, y: 201}
 			, {type: 2, args: {halfEdge: 39, start: 40, pause:20}, x: 105, y: 201}
 			, {type: 2, args: {halfEdge: 39, start: 40, pause:30}, x: 205, y: 201}
 			, {type: 2, args: {halfEdge: 39, start: 40, pause:50}, x: 305, y: 201}
 			, {type: 2, args: {halfEdge: 39, start: 40, pause:80}, x: 405, y: 201}
 			, {type: 2, args: {halfEdge: 39, start: 40, pause:130}, x: 505, y: 201}
 			, {type: 2, args: {halfEdge: 39, start: 40, pause:210}, x: 605, y: 201}
 			, {type: 2, args: {halfEdge: 39, start: 40, pause:340}, x: 705, y: 201}
 			, {type: 2, args: {halfEdge: 39, start: 40, pause:550}, x: 805, y: 201}
 			, {type: 2, args: {halfEdge: 39, start: 40, pause:890}, x: 905, y: 201}
 			
 			, {type: 2, args: {halfEdge: 39, start: 80, pause:10}, x: 5, y: 301}
 			, {type: 2, args: {halfEdge: 39, start: 80, pause:20}, x: 105, y: 301}
 			, {type: 2, args: {halfEdge: 39, start: 80, pause:30}, x: 205, y: 301}
 			, {type: 2, args: {halfEdge: 39, start: 80, pause:50}, x: 305, y: 301}
 			, {type: 2, args: {halfEdge: 39, start: 80, pause:80}, x: 405, y: 301}
 			, {type: 2, args: {halfEdge: 39, start: 80, pause:130}, x: 505, y: 301}
 			, {type: 2, args: {halfEdge: 39, start: 80, pause:210}, x: 605, y: 301}
 			, {type: 2, args: {halfEdge: 39, start: 80, pause:340}, x: 705, y: 301}
 			, {type: 2, args: {halfEdge: 39, start: 80, pause:550}, x: 805, y: 301}
 			, {type: 2, args: {halfEdge: 39, start: 80, pause:890}, x: 905, y: 301}
 			
 			, {type: 2, args: {halfEdge: 39, start: 160, pause:10}, x: 5, y: 401}
 			, {type: 2, args: {halfEdge: 39, start: 160, pause:20}, x: 105, y: 401}
 			, {type: 2, args: {halfEdge: 39, start: 160, pause:30}, x: 205, y: 401}
 			, {type: 2, args: {halfEdge: 39, start: 160, pause:50}, x: 305, y: 401}
 			, {type: 2, args: {halfEdge: 39, start: 160, pause:80}, x: 405, y: 401}
 			, {type: 2, args: {halfEdge: 39, start: 160, pause:130}, x: 505, y: 401}
 			, {type: 2, args: {halfEdge: 39, start: 160, pause:210}, x: 605, y: 401}
 			, {type: 2, args: {halfEdge: 39, start: 160, pause:340}, x: 705, y: 401}
 			, {type: 2, args: {halfEdge: 39, start: 160, pause:550}, x: 805, y: 401}
 			, {type: 2, args: {halfEdge: 39, start: 160, pause:890}, x: 905, y: 401}
 		]
}


