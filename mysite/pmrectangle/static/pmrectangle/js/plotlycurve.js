function plotPM(){

 var getData = genPlotData();
 var getData1 = getData.pmCurve;
 var getData2 = getData.PnMax;
 var getData3 = getData.usePx;
 var getData4 = getData.useNx;
 console.log(getData2);

 // unpacking data into individual arrays
 a=[]; b=[];

 for(i=0;i<getData1.length;i++) {

    a.push(getData1[i][0]);

    b.push(getData1[i][1]);
  }

var pnMaxPlot = linearI(getData2, b, a); //function as variable
var pnZeroPlot = linearI(0, b, a);
console.log(linearI(0, b, a));
var usablePlotM = [pnMaxPlot[0]];
var usablePlotP = [getData2];

for (var i = 0; i < getData3.length; i++) {
  usablePlotM.push(getData3[i][0]);
  usablePlotP.push(getData3[i][1]);
}

usablePlotM.push(pnZeroPlot[0]);
usablePlotP.push(0);
usablePlotM.push(pnZeroPlot[1]);
usablePlotP.push(0);

for (var i = 0; i < getData4.length; i++) {
  usablePlotM.push(getData4[i][0]);
  usablePlotP.push(getData4[i][1]);
}

usablePlotM.push(pnMaxPlot[1]);
usablePlotP.push(getData2);
usablePlotM.push(pnMaxPlot[0]);
usablePlotP.push(getData2);

 trace1 = { //make global
   x: a,
   y: b,
   mode: 'lines+markers',
   // fill: 'tonexty',
   hoverinfo:"x+y",
   // line: {shape: 'spline'},
   cliponaxis: false,
   // fillcolor: 'green'
   line: {
   dash: 'dot',
   width: 2,
   color: 'rgb(173, 0, 0)'
 },
 marker:{size:4}
 };

 trace2 = { //make global
   x: usablePlotM,
   y: usablePlotP,
   mode: 'lines+markers',
   fill: 'tozeroy',
   // fill: 'tonexty',
   hoverinfo:"x+y",
   // line: {shape: 'spline'}
   line: {
    color: 'rgb(55, 128, 191)'
  },
  marker:{size:4}
 };

 var data = [trace1, trace2];

 layout = { // make global
    title: 'P-M Interaction Curve',
    xaxis: {
      hoverformat: '.2f',
      title: "\u03D5" + "Mn" + " (k-ft)",
      titlefont: {size:18},
      zerolinewidth: 1.25
     },
    yaxis: {
      hoverformat: '.2f',
      title: "\u03D5" + "Pn" + " (kips)",
      titlefont: {size:18},
      zerolinewidth: 1.25
    },
    showlegend: false,
    hovermode:'closest',
    margin: {r: 50,  pad: 4},
    width:500,
    height:600,
    annotations: [
    {
      xref: 'paper',
      yref: 'paper',
      x: 0.66,
      xanchor: 'right',
      y: 0.5,
      yanchor: 'bottom',
      text: 'Acceptable Region',
      showarrow: false,
      arrowhead: 7,
      font: {
       family: 'sans serif',
       size: 18,
       color: 'rgb(102, 0, 0)'
     },
    }
  ]
  };

  Plotly.newPlot('chart-area', data, layout,
  {
    displayModeBar: true,
    displaylogo: false,
    showLink: false
  });

}

//to plot load case data into the p-m curve chart
function plotLoadCase(){
  var loadData = loadCaseData();

 trace3 = {
   x: loadData.x,
   y: loadData.y,
   mode: 'markers',
   hoverinfo:"x+y",
   marker:{color:'rgba(200, 50, 100, .8)', size:6}
 };

 var data = [trace1, trace2, trace3];

  Plotly.newPlot('chart-area', data, layout);
}

//scroll to bottom
$(document).ready(function() {

    $('#calculate').click(function(){
        $('html, body').animate({scrollTop:$(document).height()}, 'slow');
        return false;
    });

});
