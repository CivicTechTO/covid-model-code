function makeConstants() 
{
	let result = {};

	result.SICKNESS = {WELL: 0, ASYMPTOMATIC: 1, SICK: 2, HOMESICK: 3, WARDSICK: 4, ICUSICK: 5, DEAD: 6, RECOVERED: 7}

	result.PROGRESS = {WELL: 0, INFECTED: 1000, ASYMPTOMATIC: 1010, PEAK: 1020, HOMESICK: 2000, WARDSICK: 3000, ICUSICK: 4000, DEAD: 5000};

	result.RECORD = 
		{
			INFECTED: 0X0001, INFECTIOUS: 0X0002, SICK: 0X0004, HOMESICK: 0X0008, WARDSICK: 0X0010, ICUSICK: 0X0020
			, DEAD: 0X0040, HALLWAY: 0X0080, RECOVERED: 0X0100, WELL: 0X0200, INCUBATING: 0X0400
		};

	result.IMAGE = {WELL: 0, SICK: 1, RECOVERED: 2, CROSS: 3, CRESCENT: 4, STAR: 5};
	
	result.ROOMSET = result.RECORD.HOMESICK | result.RECORD.WARDSICK | result.RECORD.ICUSICK | result.RECORD.DEAD;

	result.FIXEDROOM = [result.SICKNESS.HOMESICK, result.SICKNESS.WARDSICK, result.SICKNESS.ICUSICK, result.SICKNESS.DEAD];

	result.HALLWAY = [result.SICKNESS.WARDSICK, result.SICKNESS.ICUSICK];
	
	return result;	
}
