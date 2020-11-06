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
	, "millabout": 500
	, "spacing": 4
	, "roomSize": 80
 	, "roomSpec": 
 		[
 			  {type: 2, args: {halfEdge: 1, start: 1, pause:1}, x: 5, y: 1}
 			, {type: 2, args: {halfEdge: 2, start: 1, pause:1}, x: 105, y: 1}
 			, {type: 2, args: {halfEdge: 3, start: 1, pause:1}, x: 205, y: 1}
 			, {type: 2, args: {halfEdge: 4, start: 1, pause:1}, x: 305, y: 1}
 			, {type: 2, args: {halfEdge: 5, start: 1, pause:1}, x: 405, y: 1}
 			, {type: 2, args: {halfEdge: 10, start: 1, pause:1}, x: 505, y: 1}
 			, {type: 2, args: {halfEdge: 15, start: 1, pause:1}, x: 605, y: 1}
 			, {type: 2, args: {halfEdge: 20, start: 1, pause:1}, x: 705, y: 1}
 			, {type: 2, args: {halfEdge: 30, start: 1, pause:1}, x: 805, y: 1}
 			, {type: 2, args: {halfEdge: 39, start: 1, pause:1}, x: 905, y: 1}
 			, {type: 2, args: {halfEdge: 1, start: 1, pause:2}, x: 5, y: 101}
 			, {type: 2, args: {halfEdge: 2, start: 1, pause:2}, x: 105, y: 101}
 			, {type: 2, args: {halfEdge: 3, start: 1, pause:2}, x: 205, y: 101}
 			, {type: 2, args: {halfEdge: 4, start: 1, pause:2}, x: 305, y: 101}
 			, {type: 2, args: {halfEdge: 5, start: 1, pause:2}, x: 405, y: 101}
 			, {type: 2, args: {halfEdge: 10, start: 1, pause:2}, x: 505, y: 101}
 			, {type: 2, args: {halfEdge: 15, start: 1, pause:2}, x: 605, y: 101}
 			, {type: 2, args: {halfEdge: 20, start: 1, pause:2}, x: 705, y: 101}
 			, {type: 2, args: {halfEdge: 30, start: 1, pause:2}, x: 805, y: 101}
 			, {type: 2, args: {halfEdge: 39, start: 1, pause:2}, x: 905, y: 101}
 			, {type: 2, args: {halfEdge: 1, start: 1, pause:3}, x: 5, y: 201}
 			, {type: 2, args: {halfEdge: 2, start: 1, pause:3}, x: 105, y: 201}
 			, {type: 2, args: {halfEdge: 3, start: 1, pause:3}, x: 205, y: 201}
 			, {type: 2, args: {halfEdge: 4, start: 1, pause:3}, x: 305, y: 201}
 			, {type: 2, args: {halfEdge: 5, start: 1, pause:3}, x: 405, y: 201}
 			, {type: 2, args: {halfEdge: 10, start: 1, pause:3}, x: 505, y: 201}
 			, {type: 2, args: {halfEdge: 15, start: 1, pause:3}, x: 605, y: 201}
 			, {type: 2, args: {halfEdge: 20, start: 1, pause:3}, x: 705, y: 201}
 			, {type: 2, args: {halfEdge: 30, start: 1, pause:3}, x: 805, y: 201}
 			, {type: 2, args: {halfEdge: 39, start: 1, pause:3}, x: 905, y: 201}
 			, {type: 2, args: {halfEdge: 1, start: 1, pause:5}, x: 5, y: 301}
 			, {type: 2, args: {halfEdge: 2, start: 1, pause:5}, x: 105, y: 301}
 			, {type: 2, args: {halfEdge: 3, start: 1, pause:5}, x: 205, y: 301}
 			, {type: 2, args: {halfEdge: 4, start: 1, pause:5}, x: 305, y: 301}
 			, {type: 2, args: {halfEdge: 5, start: 1, pause:5}, x: 405, y: 301}
 			, {type: 2, args: {halfEdge: 10, start: 1, pause:5}, x: 505, y: 301}
 			, {type: 2, args: {halfEdge: 15, start: 1, pause:5}, x: 605, y: 301}
 			, {type: 2, args: {halfEdge: 20, start: 1, pause:5}, x: 705, y: 301}
 			, {type: 2, args: {halfEdge: 30, start: 1, pause:5}, x: 805, y: 301}
 			, {type: 2, args: {halfEdge: 39, start: 1, pause:5}, x: 905, y: 301}
 			, {type: 2, args: {halfEdge: 1, start: 1, pause:7}, x: 5, y: 401}
 			, {type: 2, args: {halfEdge: 2, start: 1, pause:7}, x: 105, y: 401}
 			, {type: 2, args: {halfEdge: 3, start: 1, pause:7}, x: 205, y: 401}
 			, {type: 2, args: {halfEdge: 4, start: 1, pause:7}, x: 305, y: 401}
 			, {type: 2, args: {halfEdge: 5, start: 1, pause:7}, x: 405, y: 401}
 			, {type: 2, args: {halfEdge: 10, start: 1, pause:100}, x: 505, y: 401}
 			, {type: 2, args: {halfEdge: 15, start: 1, pause:100}, x: 605, y: 401}
 			, {type: 2, args: {halfEdge: 20, start: 1, pause:100}, x: 705, y: 401}
 			, {type: 2, args: {halfEdge: 30, start: 1, pause:100}, x: 805, y: 401}
 			, {type: 2, args: {halfEdge: 39, start: 1, pause:100}, x: 905, y: 401}
 		]
}

