function makeConstants() 
{
	let result = {};

    result.CHART_IDS =  ['overview', 'moving' ], // [ "symptomatic", "at-home", "hospital", "hallway" ],
	
    result.CHART_LABELS = [ "Symptomatic People", "Sick at home", "In Hospital", "Waiting for Bed" ],
	
	result.CHART_COLOURS = [ { BORDER : 'rgb(20, 100, 20)', FILL : 'rgb(40, 160, 40)' },
                             { BORDER : 'rgb(0, 0, 240)', FILL : 'rgb(0, 0, 240)' },
						     { BORDER : 'rgb(240, 150, 150)', FILL : 'rgb(240, 150, 150)' },
						     { BORDER : 'rgb(0, 0, 0)', FILL : 'rgb(0, 0, 0)' } ],
							 
	result.MOVING_CHART_WINDOW = 30,
						   
	result.INFECTIOUS ={NOT: 0, SLIGHTLY: 1, VERY: 2, EXCEEDINGLY: 3}

	result.SICKNESS = {WELL: 0, ASYMPTOMATIC: 1, SICK: 2, HOMESICK: 3, WARDSICK: 4, ICUSICK: 5, DEAD: 6, RECOVERED: 7}

	result.PROGRESS = {WELL: 0, INFECTED: 1000, ASYMPTOMATIC: 1010, PEAK: 1020, HOMESICK: 2000, WARDSICK: 3000, ICUSICK: 4000, DEAD: 5000};

	result.RECORD = 
		{
			INFECTED: 0X0001, INFECTIOUS: 0X0002, SICK: 0X0004, HOMESICK: 0X0008, WARDSICK: 0X0010, ICUSICK: 0X0020
			, DEAD: 0X0040, HALLWAY: 0X0080, RECOVERED: 0X0100, WELL: 0X0200, INCUBATING: 0X0400, MASKS: 0X0800
			, INFECTOR: 0X1000, INFECTEE: 0X2000
		};

	result.IMAGE = {WELL: 0, SICK: 1, RECOVERED: 2, CROSS: 3, CRESCENT: 4, STAR: 5, BIGCROSS: 6, BIGCRESCENT: 7, BIGSTAR: 8};

	result.HOSPITAL = {HALLWAY: 0, WARD: 1, ICU:2};
	
	result.ROOMSET = result.RECORD.HOMESICK | result.RECORD.WARDSICK | result.RECORD.ICUSICK | result.RECORD.DEAD;

	result.FIXEDROOM = [result.SICKNESS.HOMESICK, result.SICKNESS.WARDSICK, result.SICKNESS.ICUSICK, result.SICKNESS.DEAD];

	result.HALLWAY = [result.SICKNESS.WARDSICK, result.SICKNESS.ICUSICK];

	result.ROOMTYPE = {OPEN: 0, WORSHIP: 1, RESTAURANTS: 2, BARS: 3, CLUBS: 4, SCHOOLS: 5, OFFICES: 6, MEAT: 7, GROCERIES: 8, OUTSIDE: 9, PARTIES: 10};

	result.ROOMID = ["", "worship", "restaurants", "bars", "clubs", "schools", "offices", "meat", "groceries", "parks", "parties"]

	const rt = result.ROOMTYPE;
	result.USEDROOMS =[rt.WORSHIP, rt.RESTAURANTS, rt.BARS, rt.CLUBS, rt.SCHOOLS, rt.OFFICES, rt.MEAT, rt.OUTSIDE, rt.PARTIES];
	
	result.WORKTYPE = {SCHOOLS:0, OFFICES: 1, MEAT: 2};

	result.TRACE = {NONE: 0, FORWARD: 1, BACKWARD: 2};

	result.BOOLEANIMAGES ={LEFT:"../images/left.svg" , RIGHT:"../images/right.svg"}

	return result;	
}
