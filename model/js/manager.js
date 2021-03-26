class SicknessManager
{
	constructor(config)
	{
		this.wardCount = config.ward.count;
		this.icuCount = config.icu.count;

		this.needsICU = new Set();

		this.icuAllocated = new Set();
		this.wardAllocated = new Set();
		this.hallwayAllocated = new Set();

		this.hospital = [];
		this.hospital[C.HOSPITAL.HALLWAY] = {allocated: this.hallwayAllocated, dest: state.hallway};
		this.hospital[C.HOSPITAL.WARD] = {allocated: this.wardAllocated, dest: state.ward};
		this.hospital[C.HOSPITAL.ICU] = {allocated: this.icuAllocated, dest: state.icu};
	}

	transition(person, increment, decrement)
	{
// !!!! console.log("transition", state.tickToDay(state.clock), increment, decrement);
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
			this.sendTo(C.HOSPITAL.WARD, person);
		}
		else
		{
			this.sendTo(C.HOSPITAL.HALLWAY, person);
		}
	}

	discharge(person)
	{
		this.doDischarge(person, person.home);
	}

	doDischarge(person, destination)
	{
		this.wardAllocated.delete(person);
		this.hallwayAllocated.delete(person);
		this.icuAllocated.delete(person);
		this.needsICU.delete(person);

		person.setItinerary(destination);

		this.allocate();
	}

	sicker(person)
	{
		this.needsICU.add(person);

		this.allocate();
	}

	lessSick(person)
	{
		this.needsICU.delete(person);

// This special casing may need another branch if we fully prioritize needsICU

		if (this.icuAllocated.has(person))
		{
			this.icuAllocated.delete(person);

			if (this.wardNotFull())
			{
				this.transfer(C.HOSPITAL.ICU, C.HOSPITAL.WARD, person);
			}
			else
			{
				let patient = this.firstInSet(this.intersect(this.wardAllocated, this.needsICU));

				if (patient)
				{
					this.transfer(C.HOSPITAL.ICU, C.HOSPITAL.WARD, person);
					this.transfer(C.HOSPITAL.WARD, C.HOSPITAL.ICU, patient);
				}
				else
				{
					patient = this.firstInSet(this.intersect(this.hallwayAllocated, this.needsICU));
					
					if (patient)
					{
						this.transfer(C.HOSPITAL.HALLWAY, C.HOSPITAL.ICU, patient);
					}

					this.transfer(C.HOSPITAL.ICU, C.HOSPITAL.HALLWAY, person);
				}
			}
		}
		else
		{
			this.allocate();
		}
	}

	die(person)
	{
		this.doDischarge(person, state.cemetary);
	}

	allocate()
	{
		this.allocateICU();
		this.allocateWard();
	}

	allocateICU()
	{
		let patient = this.firstInSet(this.needsICU);

		if (patient && this.icuNotFull())
		{
			if (this.wardAllocated.has(patient))
			{
				this.transfer(C.HOSPITAL.WARD, C.HOSPITAL.ICU, patient);
			}
			else
			{
				this.transfer(C.HOSPITAL.HALLWAY, C.HOSPITAL.ICU, patient);
			}
				
			this.needsICU.delete(patient);
		}
	}

	allocateWard()
	{
		let patient = this.firstInSet(this.hallwayAllocated);

		if (patient && this.wardNotFull())
		{
			this.transfer(C.HOSPITAL.HALLWAY, C.HOSPITAL.WARD, patient);
		}
	}

	firstInSet(set)
	{
		let first = null;
		let attempt = set.values();

		if (!attempt.done)
		{
			first = attempt.next().value;
		}

		return first;
	}

	transfer(from, to, person)
	{
		this.hospital[from].allocated.delete(person);
		this.sendTo(to, person);
	}

	sendTo(to, person)
	{
		this.hospital[to].allocated.add(person);
		person.setItinerary(this.hospital[to].dest);
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

