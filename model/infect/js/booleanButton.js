class BooleanButton
{
	constructor(name, drawEverything, falseColour, trueColour, value)
	{
		this.value = value;
		this.drawEverything = drawEverything;

		this.falseColour = falseColour;
		this.trueColour = trueColour;

		this.falseId = name + "-false";
		this.imageId = name + "-image";
		this.trueId = name + "-true";
	}

	get()
	{
		return this.value;
	}

	set(value)
	{
		this.value = value;
	}

	falseAction()
	{
		this.set(false);

		this.drawEverything();
	}

	toggleAction()
	{
		this.set(!this.get());

		this.drawEverything();
	}

	trueAction()
	{
		this.set(true);

		this.drawEverything();
	}

	draw()
	{
		if (this.get())
		{
			setColour(this.falseId, "inherit");
			setSource(this.imageId, C.BOOLEANIMAGES.RIGHT);
			setColour(this.trueId, this.trueColour);
		}
		else
		{
			setColour(this.falseId, this.falseColour);
			setSource(this.imageId, C.BOOLEANIMAGES.LEFT);
			setColour(this.trueId, "inherit");
		}
	}
}
