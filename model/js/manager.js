class SicknessManager
{
	constructor(config)
	{
		this.wardCount = config.ward.count;
		this.icuCount = config.icu.count;

		this.needsWard = new Set();
		this.needsICU = new Set();

		this.wardAllocated = new Set();
		this.icuAllocated = new Set();
	}

	transition(person, increment, decrement)
	{
console.log("transition", state.tickToDay(state.clock), increment, decrement);
		if (0 !== (increment & C.RECORD.HOMESICK)) this.homeSick(person);
		if (0 !== (increment & C.RECORD.WARDSICK)) this.admit(person);
		if (0 !== (increment & C.RECORD.ICUSICK)) this.sicker(person);
		if (0 !== (increment & C.RECORD.DEAD)) this.die(person);

		if (0 !== (decrement & C.RECORD.ICUSICK)) this.lessSick(person);
		if (0 !== (decrement & C.RECORD.WARDSICK)) this.discharge(person);
	}

	homeSick(person)
	{
		person.setItinerary(person.home);
	}

	admit(person)
	{
		if (this.wardNotFull())
		{
			this.wardAllocated.add(person);
			person.setItinerary(state.ward);
		}
		else
		{
			this.needsWard.add(person);
			person.setItinerary(state.hallway);
		}
	}

	discharge(person)
	{
		if (this.wardAllocated.has(person))
		{
			this.wardAllocated.delete(person);

// 			let patient = this.firstInSet(this.needsICU);

// // Loop?
// 			if (patient && !wardAllocated(patient))
// 			{
// 				this.wardAllocated.add(patient);
// 				this.needsWard.delete(patient);
// 			}
			patient = this.firstInSet(this.needsWard);

			if (patient)
			{
				this.transfer(patient, this.needsWard, this.wardAllocated);
			}
		}
		else
		{
			this.needsWard.delete(person);
		}

		person.setItinerary(person.home);
	}

	sicker(person)
	{
		if (this.icuNotFull())
		{
			if (this.wardAllocated.has(person))
			{
				this.transfer(person, this.wardAllocated, this.icuAllocated);
			}
			else
			{
				this.transfer(person, this.needsWard, this.icuAllocated);
			}
			
			person.setItinerary(state.icu);
		}
		else
		{
			this.needsICU.add(person);
		}
	}

	lessSick(person)
	{
		if (this.icuAllocated.has(person))
		{
			if (this.wardNotFull())
			{
				this.transfer(this.icuAllocated, this.wardAllocated);
				person.setItinerary(state.ward);
			}
			else
			{
				this.transfer(this.icuAllocated, this.needsWard);

			}
		}
		else
		{

		}
	}

	die(person)
	{
		this.icuAllocated.delete(person);
		this.wardAllocated.delete(person);
		this.needsICU.delete(person);

		person.setItinerary(state.cemetary);
	}

	transfer(person, from, to)
	{
		if (person)
		{
			to.add(person);
			from.delete(person);
		}
	}

	firstInSet(set)
	{
		let first = null;
		let attempt = set.values().next();

		if (!attempt.done)
		{
			first = attempt.value;
		}

		return first;
	}

	icuNotFull()
	{
		return this.icuAllocated.size < this.icuCount;
	}

	wardNotFull()
	{
		return this.wardAllocated.size < this.wardCount;
	}
}

