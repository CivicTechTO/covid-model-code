function makeConstants() 
{
	let result = {};

	result.PROGRESS = {WELL: 0, ASYMPTOMATIC: 1, SICK: 2, HOMESICK: 3, WARDSICK: 4, ICUSICK: 5, DEAD: 6, RECOVERED: 7}
	result.INFECTIOUS = {NOT: 0, SLIGHTLY: 1, VERY: 10, EXTREMELY: 40};

	return result;	
}