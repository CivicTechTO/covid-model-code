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
                        borderColor : this.options.colour.BORDER,
                        backgroundColor : this.options.colour.FILL,
						tension : lineTension,
						yAxisID : 'y_default'
                    }
		if (this.options.hasOwnProperty ('dashes')) entry.borderDash = this.options.dashes;
		if (this.options.hasOwnProperty ('yaxis')) entry.yAxisID = this.options.yaxis;
		return entry;
	}
	
	fetch ()
	{
		if (this.options.name === "score") return this.refState.getScore (); 
		else return this.refState.record [this.options.name].current;
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
	constructor (descriptor, state, displayList, lineTension)
    {
	   this.referenceList = displayList;
       this.nextIndex = 0;
	   
       let scaleData =  {
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
	                    },
		   title = descriptor.hasOwnProperty ('title') ? descriptor.title : '',
	       ctx = document.getElementById (descriptor.id),
           desc = {
                    type: 'line',
                    data: { labels : [], datasets: this.referenceList.fieldList (lineTension) },
                    options : { scales: scaleData, plugins : { title : { display : true, text : title }, legend : { display : false } } }
                  };
        this.chart = new Chart(ctx, desc);
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

	destroy ()
	{
		this.chart.destroy ();
	}
}

// Create a chart based on GameChart, which simply creates an overview of the input
// data as specified in the constants definition
class OverviewChart extends GameChart
{
	constructor (state, items)
    {
		super (C.CHART_DESCRIPTIONS [0], state, items, 0.2);
    }

    addToList (index, toPush)
	{
		try
		{
		    this.chart.data.datasets [index].data.push (toPush);
		}
		catch (error)
		{
			name = this.referenceList.getName (index);
			console.error (error + ' in ' + name);
		}			
	}

	addLabel ()
	{
        this.chart.data.labels.push (this.nextIndex);
	}
}

// Create a chart based on GameChart, which creates a moving window into the 
// data, giving a clear picture of the recent past.
class WindowChart extends GameChart
{
	constructor (state, items)
    {
		super (C.CHART_DESCRIPTIONS [1], state, items, 0);
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

/* Implements the list of implemented charts, with the associated field 
 * list(s). Implements the new day update and destroys the charts when
 * the object destroy is called. NB: future more complex chart displays 
 * should be developed from this object.
 */
class ChartList
{
    constructor (refState, displayList)
    {
		this.referenceList = new ReferenceList (refState, displayList);
        this.chartList = [ new OverviewChart (refState, this.referenceList), 
		                   new WindowChart (refState, this.referenceList) ];
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

