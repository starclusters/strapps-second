function drawSection(){

var depth = 30;
var width = 16;
var halfD = 0.5*depth;
var halfW = 0.5*width;

var outerRectX = [halfW,-halfW, -halfW, halfW, halfW];
var outerRectY = [halfD, halfD, -halfD, -halfD, halfD];

trace1 = { //make global
  x: outerRectX,
  y: outerRectY,
  mode: 'lines',
  // fill: 'tonexty',
  hoverinfo:"x+y",
  // cliponaxis: false,
  // fillcolor: 'green'
  line: {
  width: 2,
  color: 'rgb(173, 0, 0)'
},
};

trace2 = { //make global
  x: [15, -15, -15, 15, 15],
  y: [15, 15, -15, -15, 15],
  mode: 'lines',
  // fill: 'tonexty',
  hoverinfo:"x+y",
  // cliponaxis: false,
  // fillcolor: 'green'
  line: {
  width: 2,
  // color: 'rgb(173, 0, 0)'
},
};

var data = [trace1, trace2];

layout = { // make global
   xaxis: {
     hoverformat: '.2f',
     autorange: true,
     showgrid: false,
     showline: false,
     autotick: true,
     ticks: '',
     showticklabels: false
    },
   yaxis: {
     hoverformat: '.2f',
     autorange: true,
     showgrid: false,
     showline: false,
     autotick: true,
     ticks: '',
     showticklabels: false

   },
   showlegend: false,
   hovermode:'closest',
   margin: {
    l: 50,
    r: 50,
    b: 25,
    t: 25,
    pad: 0
  },
   // width:200,
   // height:200,
 };

 Plotly.newPlot('xSection', data, layout,
 {
   displayModeBar: false,
   // displaylogo: false,
   // showLink: false
 });

}

$(document).ready(function() {

  drawSection();

    $('#addLayer').click(function(){
      drawSection();
    });
    $('#removeLayer').click(function(){
      Plotly.purge('xSection');
      drawSection();
    });

});
