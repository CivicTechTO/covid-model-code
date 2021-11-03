function makeConstants() 
{
	let result = {};

	let multiScale =  	{
							x : { source : 'data' },
							y_default : {
											position : 'left',
											display : true,
											type : 'linear',
											ticks : {
														steps : 10
													}
										},
							scoreAxis : {
											position : 'right',
											display : true,
											type : 'linear',
											max : 100,
											min : 0,
											ticks : {
									  					stepValue : 5,
														callback : (label, index, labels) => 
														{ 
															 return label + '%'; 
														}
													},
											grid : { drawOnChartArea : false }
					 					}	                  
						};


    result.CHARTED_VALUES  =	[ { name : 'incubating', label : 'People incubating virus',
								    colour : { BORDER : 'rgb(120, 120, 120)', FILL : 'rgb(130, 130, 130)' },
									dashes : [5, 5] }, 
			                      { name : 'infectious', label : 'Infectious people',
 								    colour : { BORDER : 'rgb(20, 100, 20)', FILL : 'rgb(40, 160, 40)' },
									dashes : [5, 5] }, 
								  { name : 'symptoms', label : 'Symptomatic people',
								    colour : { BORDER : 'rgb(120, 120, 120)', FILL : 'rgb(130, 130, 130)' } }, 
								  { name : 'homeSick', label : 'Sick at home',
 								    colour : { BORDER : 'rgb(20, 100, 20)', FILL : 'rgb(40, 160, 40)' } },
	    			              { name : 'wardSick', label : 'In hospital',
  								    colour : { BORDER : 'rgb(0, 0, 240)', FILL : 'rgb(0, 0, 240)' } }, 
								  { name : 'icuSick', label : 'In hospital intensive care',
								    colour : { BORDER : 'rgb(240, 150, 150)', FILL : 'rgb(240, 150, 150)' } }, 
								  { name : 'hallway', label : 'Waiting for a bed',
								    colour : { BORDER : 'rgb(0, 0, 0)', FILL : 'rgb(0, 0, 0)' } }, 
								  { name : 'dead', label : 'Deceased',  
								    colour : { BORDER : 'rgb(0, 0, 0)', FILL : 'rgb(255, 255, 255)' } }, 
								  { name : 'recovered', label : '',
								    colour : { BORDER : 'rgb(128, 128, 128)', FILL : 'rgb(128, 128, 128)' } }, 
		    		              { name : 'well', label : 'Currently well', 
								    colour : { BORDER : 'rgb(64, 255, 64)', FILL : 'rgb(64, 255, 64)' } }, 
								  { name : 'masks', label : '', 
  								    colour : { BORDER : 'rgb(0, 0, 128)', FILL : 'rgb(0, 0, 128)' },
									dashes : [5, 5] }, 
								  { name : 'infector', label : 'Infectious individual',
  								    colour : { BORDER : 'rgb(192, 32, 32)', FILL : 'rgb(192, 32, 32)' },
									dashes : [5, 5] }, 
								  { name : 'infectee', label : 'Recently infected',
  								    colour : { BORDER : 'rgb(0, 0, 240)', FILL : 'rgb(0, 0, 240)' },
									dashes : [5, 5] }, 
								  { name : 'tests', label : 'Persons tested',
  								    colour : { BORDER : 'rgb(64, 64, 64)', FILL : 'rgb(192, 192, 192)' },
									dashes : [8, 8] }, 
								  { name : 'isolation', label : 'Persons isolated',
  								    colour : { BORDER : 'rgb(0, 0, 0)', FILL : 'rgb(255, 255, 255)' },
									dashes : [5, 5] }, 
								  { name : 'score', label : 'Current score', 
								    colour : { BORDER : 'rgb(255, 64, 64)', FILL : 'rgb(128, 255, 128)' },
									dashes : [5, 5], yaxis : 'scoreAxis' },
								  { name : 'meatList', label : 'Meat packing' }, 
								  { name : 'officeList', label : 'Office' }, 
								  { name : 'schoolList', label : 'School' }, 
								  { name : 'houseList', label : 'House' }, 
								  { name : 'bunkhouseList', label : 'Bunkhouse' },
								  { name : 'churchList', label : 'Church' },
								  { name : 'restaurantList', label : 'Restaurant' }, 
								  { name : 'pubList', label : 'Pub' }, 
								  { name : 'clubList', label : 'Club' }, 
								  { name : 'outsideList', label : 'Park' }	 
							    ];
								
    result.CHART_DESCRIPTIONS = [ { id : 'overview', title : 'Overview', kind : 'line',  scale : multiScale, 
	                                legend : { position: 'left', align : 'start' }, tension : 0.2 },  
	 							  { id : 'moving', title : 'Current State', kind : 'line',  scale : multiScale, 
								    legend : { display: false } },
								  { id : 'won-chart', title : 'Your results: Infections by location',
								    kind : 'bar', legend : { display : false } },
								  { id : 'lost-chart', title : 'Your results: Infections by location',
								    kind : 'bar', legend : { display: false } } 
								];
    result.CHART_INDEX = { OVERVIEW : 0, MOVING : 1, WON : 2, LOST : 3 };
	result.MOVING_CHART_WINDOW = 30;
						   
	result.INFECTIOUS ={NOT: 0, SLIGHTLY: 1, VERY: 2, EXCEEDINGLY: 3}

	result.SICKNESS = {WELL: 0, ASYMPTOMATIC: 1, SICK: 2, HOMESICK: 3, WARDSICK: 4, ICUSICK: 5, DEAD: 6, RECOVERED: 7}

	const rs = result.SICKNESS;
	result.ALREADYTESTED = [rs.WARDSICK, rs.ICUSICK, rs.DEAD];
	result.TESTSPOSITIVE = [rs.SICK, rs.HOMESICK];

	result.PROGRESS = {WELL: 0, INFECTED: 1000, ASYMPTOMATIC: 1010, PEAK: 1020, HOMESICK: 2000, WARDSICK: 3000, ICUSICK: 4000, DEAD: 5000};

	result.RECORD = 
		{
			INFECTED: 0X1, INFECTIOUS: 0X2, SICK: 0X4, HOMESICK: 0X8
			, WARDSICK: 0X10, ICUSICK: 0X20, DEAD: 0X40, HALLWAY: 0X80
			, RECOVERED: 0X100, WELL: 0X200, INCUBATING: 0X400, MASKS: 0X800
			, INFECTOR: 0X1000, INFECTEE: 0X2000, ISOLATED: 0X4000, ISOLATIONROOM: 0X8000
			, ISOLATIONHOME: 0X10000, ISOLATIONOVERFLOW: 0X20000, POSITIVE: 0X40000, TESTS: 0X80000
		};

	result.IMAGE = {WELL: 0, SICK: 1, RECOVERED: 2, CROSS: 3, CRESCENT: 4, STAR: 5, BIGCROSS: 6, BIGCRESCENT: 7, BIGSTAR: 8};

	result.HOSPITAL = {HALLWAY: 0, WARD: 1, ICU:2};
	
	result.ROOMSET = result.RECORD.HOMESICK | result.RECORD.WARDSICK | result.RECORD.ICUSICK | result.RECORD.DEAD;

	result.FIXEDROOM = [result.SICKNESS.WARDSICK, result.SICKNESS.ICUSICK, result.SICKNESS.DEAD];

	result.HALLWAY = [result.SICKNESS.WARDSICK, result.SICKNESS.ICUSICK];

	result.ROOMTYPE = {OPEN: 0, WORSHIP: 1, RESTAURANTS: 2, BARS: 3, CLUBS: 4, SCHOOLS: 5, OFFICES: 6, MEAT: 7, GROCERIES: 8, OUTSIDE: 9, PARTIES: 10};

	result.ROOMID = ["", "worship", "restaurants", "bars", "clubs", "schools", "offices", "meat", "groceries", "parks", "parties"]

	const rt = result.ROOMTYPE;
	result.USEDROOMS =[rt.WORSHIP, rt.RESTAURANTS, rt.BARS, rt.CLUBS, rt.SCHOOLS, rt.OFFICES, rt.MEAT, rt.OUTSIDE, rt.PARTIES];
	
	result.WORKTYPE = {SCHOOLS:0, OFFICES: 1, MEAT: 2};

	result.TRACE = {NONE: 0, FORWARD: 1, BACKWARD: 2};

	result.BOOLEANIMAGES ={LEFT:"../images/left.svg" , RIGHT:"../images/right.svg"}

	result.TOOLTIPS = 
	{
		BUNKHOUSES: "bunkhouse-tooltip", HOUSES: "house-tooltip", WORSHIP: "worship-tooltip", RESTAURANTS: "restaurants-tooltip"
		, BARS: "bars-tooltip", CLUBS: "clubs-tooltip", SCHOOLS: "schools-tooltip", OFFICES: "offices-tooltip", MEAT: "meat-tooltip"
		, OUTSIDE: "outside-tooltip", ICU: "icu-tooltip", WARD: "ward-tooltip", WAITING: "waiting-tooltip", CEMETARY: "cemetary-tooltip"
		, ISOLATION: "isolation-tooltip", ROAD: "road-tooltip"
	}

	return result;	
}
