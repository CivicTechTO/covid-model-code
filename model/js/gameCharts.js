function initializeCharts ()
{
   let chartList = new Array ();

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
	   let dataList = Array ();
	   
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
		  dataList.push (entry); 
       }
   
       let ctx = document.getElementById(C.CHART_IDS [n]),
           desc = {
                    type: C.CHART_TYPES [i],
                    data: { labels : new Array (), datasets: dataList; },				
                  };
	   if (C.CHART_TYPES [i] === 'line')
	   {
		  let lineOpt = { plugins: { decimation: {enabled: false, algorithm: 'lttb' } } };
		  desc.options = lineOpt;
	   }
				  
        
        let chart = new Chart(ctx, desc);
		
        chartList.push (chart);

   return chartList;
}

function addItemToChart (value, j)
{
   // console.log (state.chartList [i].data);
   // console.log (value);
   
   for i = 0; i < CHART_IDS.length; i++)
   state.chartList [i].data.datasets [j].data.push (value);
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
