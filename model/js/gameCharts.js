function initializeCharts ()
{
   let chartList = new Array (), dataList = Array ();

/**   for (n = 0; n < C.CHART_IDS.length; n++)
   {
       let ctx = document.getElementById(C.CHART_IDS [n]),
           desc = {
                type: 'line',
                data: 
                {
                    labels : new Array (),
                    datasets: 
                    [{
                        label: C.CHART_LABELS [n],
                        data: new Array ()                    
                     }]
                }
           };
        let chart = new Chart(ctx, desc);
		// console.log (chart.data);
        chartList.push (chart);
        		
   } */

   for (i = 0; i < CHART_IDS.length; i++) 
   {	   
       for (j = 0; j < C.CHART_LABELS.length; j++)
       {
	      let entry = {
                         label: C.CHART_LABELS [j],
                          data: new Array (),
                          fill : false,
                          borderColor : C.CHART_COLOURS [j].BORDER,
                          backgroundColor : C.CHART_COLOURS [j].FILL,
			     		  pointStyle : C.CHART_ICONS [j],
				    	  radius : 4
                      }
       }
   
       let ctx = document.getElementById(C.CHART_IDS [n]),
           desc = {
                    type: 'scatter',
                    data: { labels : new Array (), datasets: dataList; }
                  };
        let chart = new Chart(ctx, desc);
		
        chartList.push (chart);
        		   
   // console.log (chartList);
   return chartList;
}

function addItemToChart (value, i)
{
   // console.log (state.chartList [i].data);
   // console.log (value);
   state.chartList [i].data.datasets [0].data.push (value);
   state.chartList [i].data.labels.push (state.chartList [i].data.datasets [0].data.length);
   state.chartList [i].update ();
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
