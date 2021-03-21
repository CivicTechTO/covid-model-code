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
		this.doDischarge(person, person.home);
	}

	doDischarge(person, destination)
	{
		this.wardAllocated.delete(person);
		this.needsWard.delete(person);
		this.icuAllocated.delete(person);
		this.needsICU.delete(person);

		person.setItinerary(destination);

		let patient = this.firstInSet(this.needsICU);

		if (patient && this.icuNotFull())
		{
			if (this.wardAllocated.has(patient))
			{
				this.transfer(patient, this.wardAllocated, this.icuAllocated);
				patient.setItinerary(state.icu);
			}
			else
			{
				this.transfer(patient, this.needsWard, this.icuAllocated);
				patient.setItinerary(state.ward);
			}
				
			this.needsICU.delete(patient);
		}

		patient = this.firstInSet(this.needsWard);

		if (patient && this.wardNotFull())
		{
			this.transfer(patient, this.needsWard, this.wardAllocated);
			patient.setItinerary(state.ward);
		}
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
			let patient = this.firstInSet(this.intersect(this.needsICU, this.wardAllocated));

			if (patient)
			{
				this.transfer(person, this.icuAllocated, this.wardAllocated);
				this.transfer(patient, this.wardAllocated, this.icuAllocated);

				person.setItinerary(state.ward);
				patient.setItinerary(state.icu);
			}
			else
			{
				if (this.wardNotFull())
				{
					this.transfer(person, this.icuAllocated, this.wardAllocated);
					person.setItinerary(state.ward);
				}
				else
				{
					patient = this.firstInSet(this.intersect(this.needsICU, this.needsWard));

					if (patient)
					{
						this.transfer(patient, this.needsWard, this.icuAllocated);
						patient.setItinerary(state.icu);
					}
						
					this.transfer(person, this.icuAllocated, this.needsWard);
					person.setItinerary(state.hallway);
				}
			}
		}
	}

	die(person)
	{
		this.doDischarge(person, state.cemetary);
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

	intersect(set1, set2)
	{
		let result = new Set();

		for (const element of set1)
		{
			if (set2.has(element))
			{
				result.add(element);
			}
		}

		return result;
	}
}

