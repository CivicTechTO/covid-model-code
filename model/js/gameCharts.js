// Base class: ontains the basic definition for creating charts, but never adds data
class GameChart
{
	constructor (id)
    {
	   let dataList = []; // Array ();
       this.next = []; // Array ();
	   
       for (let j = 0; j <  C.CHART_LABELS.length; j++)
       {
	      let entry = {
                          label: C.CHART_LABELS [j],
                          data: [],
                          borderColor : C.CHART_COLOURS [j].BORDER,
                          backgroundColor : C.CHART_COLOURS [j].FILL
                      }
		  dataList.push (entry);
		  this.next.push (0);
       }
   
       let ctx = document.getElementById(id),
           desc = {
                    type: 'scatter',
                    data: { labels : [], datasets: dataList }		
                  };
        this.chart = new Chart(ctx, desc);
    }

    addToList (toPush)
	{
		// this.chart.data.datasets [index].data.push (value);
	}

    update (index, added)
	{
	   let tuple =  { x : ++(this.next [index]), y : added };
       this.addToList (tuple);
       this.chart.data.labels.push (this.next [index]);
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
	constructor ()
    {
		super (C.CHART_IDS [0]);
    }

    addToList (toPush)
	{
		this.chart.data.datasets [index].data.push (value);
	}
}

// Create a chart based on GameChart, which creates a moving window into the 
// data, giving a clear picture of the recent past.
class WindowChart extends GameChart
{
	constructor ()
    {
		super (C.CHART_IDS [0]);
		this.limit = MOVING_CHART_WINDOW;
    }

    addToList (toPush)
	{
		this.chart.data.datasets [index].data.push (value);
		if (this.chart.data.datasets [index].data.length > this.limit)
			this.chart.data.datasets [index].data.shift ();
	}
}

function initializeCharts ()
{
   return [ new OverviewChart (), new WindowChart () ];
}

function addItemToChart (value, timeSeries)
{
   // console.log (state.chartList [i].data);
   // console.log (value);
   for (i = 0; i < C.CHART_IDS.length; i++)
	   state.chartList [i].update (timeSeries, value);
}

function atNewDay () 
{
   addItemToChart (state.record.symptoms.current, 0); // "symptomatic"
   addItemToChart (state.record.homeSick.current, 1); // "at-home"
   addItemToChart (state.record.wardSick.current, 2); // "hospital"
   addItemToChart (state.record.hallway.current, 3);  // "hallway"
}

function destroyCharts() 
{
    for (let chart of state.chartList)
    {
        chart.destroy();
    }
}
