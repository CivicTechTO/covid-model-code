/* Defines a reference from the static chart definitions to the field, 
 * and both accesses the selected value and generates the series 
 * definition for the chart definition.
 */
class ChartedReference
{
	constructor (refTo, name)
	{
        let finder = function (e) { return e.name === name; },
		    valueDef = C.CHARTED_VALUES.find (finder);
		this.refState = refTo;
		if (valueDef) this.options = valueDef;
		else throw "invalid field " + name;
	}

    defineChartItem (lineTension)
	{
        let entry = {
                        label: this.options.label,
                        data: [],
		    			fill : false,
	    				pointRadius : 1,
    					pointHoverRadius : 5,
						tension : lineTension,
						yAxisID : 'y_default'
                    }
		if (this.options.hasOwnProperty ('dashes')) entry.borderDash = this.options.dashes;
		if (this.options.hasOwnProperty ('yaxis')) entry.yAxisID = this.options.yaxis;
		if (this.options.hasOwnProperty ('colour'))
		{
			entry.borderColor = this.options.colour.BORDER;
			entry.backgroundColor = this.options.colour.FILL;
		}
		else 
		{
			let colourMap = makeInfectedColourMap ();
			entry.borderColor = colourMap.get (this.options.name);
			entry.backgroundColor = colourMap.get (this.options.name);
		}
		return entry;
	}
	
	fetch ()
	{
		if (this.options.name === "score") return this.refState.getScore (); 
		else if (this.refState.record.hasOwnProperty (this.options.name)) 
		    return this.refState.record [this.options.name].current;
		else throw "Data point " + this.options.name + " not found";
	}
}

/* Creates a full list of references, each linking a chart element 
 * defined with specific options (colours, etc) to a defined data 
 * item recorded in the state object.
 */
class ReferenceList
{
	constructor (refTo, nameList)
	{
		this.valueList = [];
		for (let name of nameList)
			this.valueList.push (new ChartedReference (refTo, name));
	}
	
    fieldList (lineTension)
	{
		let result = [];
		for (let chartRef of this.valueList)
			result.push (chartRef.defineChartItem (lineTension));
		return result;
	}
	
	tuples (index)
	{
		let result = [];
		for (let value of this.valueList)
			result.push ({ x : index, y : value.fetch () });
		return result;
	}
	
	getName (i)
	{
		if (i >= 0 && i < this.valueList.length) 
			return this.valueList [i].options.name;
		else return "";
	}
}

/* Chart definition base class: contains the basic definition for creating charts, but never adds data
 */
class GameChart
{
	constructor (descriptor)
	{
		let title = descriptor.hasOwnProperty ('title') ? descriptor.title : '',
		    ctx = document.getElementById (descriptor.id),
	  	    desc = 	{
						type : descriptor.kind,
						data : { labels : [] },
						options : { maintainAspectRatio : false, 
									plugins : { title : { display : true, text : title } } }
				  	};
	    if (descriptor.hasOwnProperty ('scale')) desc.options.scales = descriptor.scale;
	    if (descriptor.hasOwnProperty ('legend')) desc.options.plugins.legend = descriptor.legend;
	    this.chart = new Chart(ctx, desc);
	}

	update () 
	{
		// empty function - some children override this
	}

	destroy ()
	{
		this.chart.destroy ();
	}
}

class LineChart extends GameChart
{
	constructor (descriptor, displayList)
    {
		super (descriptor);
	   	this.referenceList = displayList;
       	this.nextIndex = 0;
		let lineTension = descriptor.hasOwnProperty ('tension') ? descriptor.tension : 0;
		this.chart.data.datasets = this.referenceList.fieldList (lineTension);
    }

    addToList (index, toPush)
	{
		// actually add the item to the data series; overridden by child objects
	}
	
	addLabel ()
	{
		// actually add a label to the data series; overridden by child objects
	}

    update ()
	{
	    let tupleList = this.referenceList.tuples (++this.nextIndex);
	    for (let i = 0; i < tupleList.length; i++)
		    this.addToList (i, tupleList [i]);
        this.addLabel ();
		this.chart.update ();
	}
}

// Create a chart based on GameChart, which simply creates an overview of the input
// data as specified in the constants definition
class OverviewChart extends LineChart
{
	constructor (items)
    {
		super (C.CHART_DESCRIPTIONS [C.CHART_INDEX.OVERVIEW], items);
    }

    addToList (index, toPush)
	{
		try
		{
		    this.chart.data.datasets [index].data.push (toPush);
		}
		catch (error)
		{
			let errorId = this.referenceList.getName (index);
			console.error (error + ' in ' + errorId);
		}			
	}

	addLabel ()
	{
        this.chart.data.labels.push (this.nextIndex);
	}
}

// Create a chart based on GameChart, which creates a moving window into the 
// data, giving a clear picture of the recent past.
class WindowChart extends LineChart
{
	constructor (state, items)
    {
		super (C.CHART_DESCRIPTIONS [C.CHART_INDEX.MOVING], state, items);
		this.limit = C.MOVING_CHART_WINDOW;
    }

    addToList (index, toPush)
	{
		this.chart.data.datasets [index].data.push (toPush); 
		if (this.chart.data.datasets [index].data.length > this.limit)
		{
			let nv = [];
			for (let i = 1; i < this.chart.data.datasets [index].data.length; i++)
				nv.push (this.chart.data.datasets [index].data [i]);
			this.chart.data.datasets [index].data = nv;
		} 

	}

	addLabel ()
	{
        this.chart.data.labels.push (this.nextIndex);
		if (this.chart.data.labels.length > this.limit)
			this.chart.data.labels.shift ();
	}
}

/* Implements the final chart display at the end of the game, showing how many 
 * infections took place in each location, along with any other information desired.
 */
class FinalChart extends GameChart
{
	constructor (source, canvasId)
    {
		super (C.CHART_DESCRIPTIONS [canvasId]);
		let labelMap = new Map (C.CHARTED_VALUES.map (({name, label}) => { return [name, label] })),
			list = source.activeConfig.graphedInfectionLocations,
			labels = [];

		for (let id of list)
			labels.push (labelMap.get (id));

		this.valueSource = source;
		this.chart.data.labels = labels;
		this.chart.options.onResize = (inst, size) => { this.getData (); }
		this.chart.data.datasets = [ { label : 'Infection sites', borderWidth : 1, data : [], 
		                               color : [], BorderColor : [] } ];
    }

    darker (colours, factor)
	{
		let result = [];
		for (let selected of colours)
		{
			let r = parseInt (selected.substring (1,3), 16),
			    g = parseInt (selected.substring (3,5), 16),
				b = parseInt (selected.substring (5,7), 16),
				rgb = 'rgb(' + Math.round (r * factor) + ',' + Math.round (g * factor) + ',' + Math.round (b * factor) + ')';
			result.push (rgb);
		}

		return result;
	}

	getData ()
	{
		let colourMap = makeInfectedColourMap (),
			list = this.valueSource.activeConfig.graphedInfectionLocations,
			adjust = this.valueSource.activeConfig.chartBorderAdjust,
			bars = [],
			colours = [];

		for (let id of list)
		{
		    bars.push (sumInfected (this.valueSource [id]));
			colours.push (colourMap.get (id));
		}
     
		this.chart.data.datasets [0].data = bars; 
		this.chart.data.datasets [0].backgroundColor = colours;
		this.chart.data.datasets [0].borderColor = this.darker (colours, adjust);
		// this.chart.update ();
	}
}

/* Implements the list of game display charts, with the associated field 
 * list(s). Implements the new day update and destroys the charts when
 * the object destroy is called. NB: future more complex chart displays 
 * should be developed from this object.
 */
class ChartList
{
    constructor (refState, displayList)
    {
		this.referenceList = new ReferenceList (refState, displayList);
        this.chartList = [ new OverviewChart (this.referenceList), 
		                   new WindowChart (this.referenceList),
						   new FinalChart (refState, C.CHART_INDEX.LOST), 
						   new FinalChart (refState, C.CHART_INDEX.WON) ];
    }

	getChart (i) 
	{
		return this.chartList [i];
	}

    updateAll ()
	{
		for (let toUpdate of this.chartList)
			toUpdate.update ();
	}
	
	destroy ()
	{
		for (let chart of this.chartList)
			chart.destroy ();
	}
}

function atNewDay () 
{
  state.chartList.updateAll ();
}