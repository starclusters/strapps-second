// function to round the number to nearest 1/16th
function roundUp16thDecimal(number){
  var one16th = 1/16;
  var multiple = Math.ceil(number/one16th);
  return (multiple*one16th);
}
//function to convert rounded numbers to html text showing fraction
function conv16thFraction(number){
  var intPart = Math.floor(number);
  var decPart = number - intPart;

  var fracTable = {
    0.0625:'<sup>1</sup>&frasl;<sub>16</sub>"',
    0.125:'<sup>1</sup>&frasl;<sub>8</sub>"',
    0.1875:'<sup>3</sup>&frasl;<sub>16</sub>"',
    0.25:'<sup>1</sup>&frasl;<sub>4</sub>"',
    0.3125:'<sup>5</sup>&frasl;<sub>16</sub>"',
    0.3750:'<sup>3</sup>&frasl;<sub>8</sub>"',
    0.4375:'<sup>7</sup>&frasl;<sub>16</sub>"',
    0.50:'<sup>1</sup>&frasl;<sub>2</sub>"',
    0.5625:'<sup>9</sup>&frasl;<sub>16</sub>"',
    0.6250:'<sup>5</sup>&frasl;<sub>8</sub>"',
    0.6875:'<sup>11</sup>&frasl;<sub>16</sub>"',
    0.75:'<sup>3</sup>&frasl;<sub>4</sub>"',
    0.8125:'<sup>13</sup>&frasl;<sub>16</sub>"',
    0.875:'<sup>7</sup>&frasl;<sub>8</sub>"',
    0.9375:'<sup>15</sup>&frasl;<sub>16</sub>"',
    0.0:'"'
  };

  var fracText = fracTable[decPart];
  var finalText = (intPart == 0)? (fracText):(intPart + fracText);

  return finalText;

}

//function to reset detailimg parameters table
function hideResult(){
  // d3.select("#table01Head").html("");
  // d3.select("#table01Row").html("");
  // d3.select("#table02Head").html("");
  // d3.select("#table02Row").html("");
  d3.select("#divResult").style("display", "none");

}

function showResult(){
  var x = document.getElementById("divResult");
  x.style.display = "block";
}

//function to convert rounded numbers to svg span text showing fraction
function svgFracText(number){
  var intPart = Math.floor(number);
  var decPart = number - intPart;

  var fracTable = {
    0.0625:'<tspan dy="-15">1</tspan><tspan dy="15">/</tspan><tspan dy="10">16</tspan><tspan dy="-10">"</tspan>',
    0.125:'<tspan dy="-15">1</tspan><tspan dy="15">/</tspan><tspan dy="10">8</tspan><tspan dy="-10">"</tspan>',
    0.1875:'<tspan dy="-15">3</tspan><tspan dy="15">/</tspan><tspan dy="10">16</tspan><tspan dy="-10">"</tspan>',
    0.25:'<tspan dy="-15">1</tspan><tspan dy="15">/</tspan><tspan dy="10">4</tspan><tspan dy="-10">"</tspan>',
    0.3125:'<tspan dy="-15">5</tspan><tspan dy="15">/</tspan><tspan dy="10">16</tspan><tspan dy="-10">"</tspan>',
    0.3750:'<tspan dy="-15">3</tspan><tspan dy="15">/</tspan><tspan dy="10">8</tspan><tspan dy="-10">"</tspan>',
    0.4375:'<tspan dy="-15">7</tspan><tspan dy="15">/</tspan><tspan dy="10">16</tspan><tspan dy="-10">"</tspan>',
    0.50:'<tspan dy="-15">1</tspan><tspan dy="15">/</tspan><tspan dy="10">2</tspan><tspan dy="-10">"</tspan>',
    0.5625:'<tspan dy="-15">9</tspan><tspan dy="15">/</tspan><tspan dy="10">16</tspan><tspan dy="-10">"</tspan>',
    0.6250:'<tspan dy="-15">5</tspan><tspan dy="15">/</tspan><tspan dy="10">8</tspan><tspan dy="-10">"</tspan>',
    0.6875:'<tspan dy="-15">11</tspan><tspan dy="15">/</tspan><tspan dy="10">16</tspan><tspan dy="-10">"</tspan>',
    0.75:'<tspan dy="-15">3</tspan><tspan dy="15">/</tspan><tspan dy="10">4</tspan><tspan dy="-10">"</tspan>',
    0.8125:'<tspan dy="-15">13</tspan><tspan dy="15">/</tspan><tspan dy="10">16</tspan><tspan dy="-10">"</tspan>',
    0.875:'<tspan dy="-15">7</tspan><tspan dy="15">/</tspan><tspan dy="10">8</tspan><tspan dy="-10">"</tspan>',
    0.9375:'<tspan dy="-15">15</tspan><tspan dy="15">/</tspan><tspan dy="10">16</tspan><tspan dy="-10">"</tspan>',
    0.0:'"'
  };

  var intText = '<tspan>' + intPart + '</tspan>';
  var fracText = fracTable[decPart];
  var finalText = (intPart == 0)? (fracText):(intText + fracText);

  return finalText;

}
