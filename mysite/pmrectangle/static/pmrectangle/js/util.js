function createLayer(){
  var existLayer = parseInt($("#steel tr:last-child td:first-child").text());
  var newLayer = existLayer+1;
  var firstNode = "<td>" + newLayer + "</td>";
  var otherNode = '<td>'+'<select class="form-control">'+
                  '<option value="0">#3</option>'+
                   '<option value="1">#4</option>'+
                   '<option value="2">#5</option>'+
                   '<option value="3">#6</option>'+
                   '<option value="4">#7</option>'+
                   '<option value="5">#8</option>'+
                   '<option value="6" selected>#9</option>'+
                   '<option value="7">#10</option>'+
                   '<option value="8">#11</option>'+
                   '<option value="9">#14</option>'+
                   '<option value="10">#18</option>'+'</select>'+'</td>'+
                   '<td><input type="number" name="" value= "2" ></td>'+
                   '<td><input type="number" name="" value= "2.50" ></td>';
 var trHtml = firstNode + otherNode;
 var node = $("#steel").append('<tr></tr>');
 $("#steel tr:last-child").html(trHtml);

}

function createLoadCase(){
  var existLoadCase = parseInt($("#userData tr:last-child td:first-child").text());
  var newLoadCase = existLoadCase + 1;
  var firstNode = "<td>" + newLoadCase + "</td>";
  var otherNode = '<td><input type="number" name="" value= "0.0" ></td>'+
                  '<td><input type="number" name="" value= "0.0" ></td>';
 var trHtml = firstNode + otherNode;
 var node = $("#userData").append('<tr></tr>');
 $("#userData tr:last-child").html(trHtml);
}

function removeLayer(){
  if ($("#steel tr").length>2) {
    // $("#steel tr:last-child").remove();
     var target = ("#steel tr:last-child");
    $(target).fadeOut(200, function(){$(target).remove();});
  }
}

function removeLoadCase(){
  if ($("#userData tr").length>1) {
     var target = ("#userData tr:last-child");
    $(target).fadeOut(100, function(){$(target).remove();});
  }
}

//function to grab input and return reinforcement arrays
function reinfArray(){
  var BarArea = [0.11, 0.20, 0.31, 0.44, 0.60, 0.79, 1, 1.27, 1.56, 2.25, 4];
  var dsArray = []; var AsArray = []; var dsArray2 = [];
  h = parseFloat($("#ht").val()); //global variable

  for (var i = 0; i < $("#steel select").length; i++) {

    var size = parseInt($("#steel select")[i].value);
    var nOfBar = parseFloat($("#steel tr td:nth-child(3) input")[i].value);
    var ds = parseFloat($("#steel tr td:nth-child(4) input")[i].value);

    dsArray.push(ds);
    AsArray.push(BarArea[size]*nOfBar);
    dsArray2.push(h-ds);
  }
  return [dsArray, AsArray, dsArray2];
}

//function to create a single (P,M) point for a given value of z and bending direction(posX or negX)
function pmCurvePoint(z, momentDirection){

  var FsArray = []; var MArray = [];
  var strain = [];
  var Ast, c_value, a_value, phi, phiPn, phiMn, Balance, fy, Ec, b;
  var rfArray = reinfArray();

  var fc = parseFloat($("#fc").val());
  Beta_1 = (fc > 4) ? (Math.max(0.85-(fc-4)*0.05, 0.65)) : (0.85); //globale variable
  b = parseFloat($("#wt").val());
  Ag = h*b; //make global variable
  fy = parseFloat($("#fy").val());
  Ec = parseFloat($("#E").val());
  var tReinf = parseInt(d3.select("#tie").node().value);
  var designCode = parseInt(d3.select("#code").node().value);
  Ast = rfArray[1].reduce((a, b) => a + b, 0); // summation

 if (momentDirection == "negX") {

   var ds_max = Math.max.apply(Math, rfArray[2]);
   c_value = (0.003*ds_max)/(0.003-z*fy/Ec);
   a_value = Math.min(c_value*Beta_1,h);

   for (var i = 0; i < $("#steel select").length; i++) {

     var TorC = (c_value > rfArray[2][i]) ? (-1):(1);
     var lessThanA = (rfArray[2][i] <= a_value) ? (1):(0);
     var epsilon = ((rfArray[2][i]/c_value)*TorC-TorC)*0.003;
     strain.push(epsilon);
     var fs = Math.min(60, epsilon*Ec)*TorC;
     var F_s = rfArray[1][i]*(fs + 0.85*fc*lessThanA);
     FsArray.push(F_s);
     var moment = F_s*(rfArray[2][i]-0.5*a_value)/12;
     MArray.push(moment);
   }

   var Tension = FsArray.reduce((a, b) => a + b, 0); //sum of all
   var Compression = 0.85*fc*b*a_value;
   Balance = Tension-Compression;
   var tensileStrain = strain[rfArray[2].indexOf(ds_max)];

   if (tensileStrain <= 0.002069) {
     phi = (tReinf == 1 && designCode == 1) ? (0.65) : (0.75);
   }
   else if (tensileStrain >= 0.005) {
     phi = 0.90;
   }

   else {
     phi = (tReinf == 1 && designCode == 1) ? (0.65+0.25*(tensileStrain-0.002069)/0.003) : (0.75+0.15*(tensileStrain-0.002069)/0.003);
   }

   phiPn = -1*phi*Balance;
   var sumM = MArray.reduce((a, b) => a + b, 0);
   phiMn = phi*(sumM-Balance*0.5*(h-a_value)/12);
   var phiPn_zero = (tReinf == 1 && designCode == 1) ? (0.65*(0.85*fc*(Ag-Ast)+fy*Ast)) : (0.75*(0.85*fc*(Ag-Ast)+fy*Ast)); //make global
   phiPnMax = (tReinf == 1) ? (0.80*phiPn_zero):(0.85*phiPn_zero); //global

   return [-1*phiMn, phiPn];

 }

 else {

   var ds_max = Math.max.apply(Math, rfArray[0]);
   c_value = (0.003*ds_max)/(0.003-z*fy/Ec);
   a_value = Math.min(c_value*Beta_1,h);

   for (var i = 0; i < $("#steel select").length; i++) {

     var TorC = (c_value > rfArray[0][i]) ? (-1):(1);
     var lessThanA = (rfArray[0][i] <= a_value) ? (1):(0);
     var epsilon = ((rfArray[0][i]/c_value)*TorC-TorC)*0.003;
     strain.push(epsilon);
     var fs = Math.min(60, epsilon*Ec)*TorC;
     var F_s = rfArray[1][i]*(fs + 0.85*fc*lessThanA);
     FsArray.push(F_s);
     var moment = F_s*(rfArray[0][i]-0.5*a_value)/12;
     MArray.push(moment);
   }

   var Tension = FsArray.reduce((a, b) => a + b, 0); //sum of all
   var Compression = 0.85*fc*b*a_value;
   Balance = Tension-Compression;
   var tensileStrain = strain[rfArray[0].indexOf(ds_max)];

   if (tensileStrain <= 0.002069) {
     phi = (tReinf == 1 && designCode == 1) ? (0.65) : (0.75);
   }
   else if (tensileStrain >= 0.005) {
     phi = 0.90;
   }

   else {
     phi = (tReinf == 1 && designCode == 1) ? (0.65+0.25*(tensileStrain-0.002069)/0.003) : (0.75+0.15*(tensileStrain-0.002069)/0.003);
   }

   phiPn = -1*phi*Balance;
   var sumM = MArray.reduce((a, b) => a + b, 0);
   phiMn = phi*(sumM-Balance*0.5*(h-a_value)/12);

   var phiPn_zero = (tReinf == 1 && designCode == 1) ? (0.65*(0.85*fc*(Ag-Ast)+fy*Ast)) : (0.75*(0.85*fc*(Ag-Ast)+fy*Ast)); //make global
   // phiPn_tension = 0.9*fy*Ast*-1; //declared as global variable
   phiPnMax = (tReinf == 1) ? (0.80*phiPn_zero):(0.85*phiPn_zero); //global

   return [phiMn, phiPn];

 }

}

//function to get load case data and return into obeject of x and y arrays for plotly
function loadCaseData(){
  var Pu = []; var Mu = [];
  var PuData, MuData;

  for (var i = 0; i < $("#userData tr").length; i++) {

    var PuData = parseFloat($("#userData tr td:nth-child(2) input")[i].value);
    var MuData = parseFloat($("#userData tr td:nth-child(3) input")[i].value);

    Pu.push(PuData);
    Mu.push(MuData);
  }

  return {x: Mu, y: Pu};
}

//function to generate an array of (M,P) points for given z arrays
function genPlotData (){

  var z_data = [1.0, 0.5, 0.25, 0.125, 0, -0.25, -0.5, -1, -2.5, -4, -6, -8, -10, -12, -16, -100000];
  var z_data2 = [-16, -12, -10, -8, -6, -4, -2.5, -1, -0.5, -0.25, 0, 0.125, 0.25, 0.5, 1.0];
  var pmData = [];
  var usablePlotPx = []; // positive x
  var usablePlotNx = []; // nagative x

  for (var i = 0; i < z_data.length; i++) {
    var pmDataPoint = pmCurvePoint(z_data[i]);
    // pmData.push(pmCurvePoint(z_data[i]));
    pmData.push(pmDataPoint);
//create usable plot data for positive x axis
    if (pmDataPoint[1] <= phiPnMax && pmDataPoint[1] >= 0) {
      usablePlotPx.push(pmDataPoint);
    }
  }

  for (var i = 0; i < z_data2.length; i++) {
    var pmDataPoint = pmCurvePoint(z_data2[i], "negX");
    // pmData.push(pmCurvePoint(z_data2[i], "negX"));
    pmData.push(pmDataPoint);
    //create usable plot data for negative x axis
    if (pmDataPoint[1] <= phiPnMax && pmDataPoint[1] >= 0) {
      usablePlotNx.push(pmDataPoint);
    }
  }
  // pmData.splice(0, 0, [0, phiPn_zero]);
  // pmData.push([0, phiPn_tension]);
  console.log(pmData);

  return {
    pmCurve: pmData,
    PnMax: phiPnMax,
    usePx: usablePlotPx,
    useNx: usablePlotNx
        };

}

//uppdate calculated parameters on the page
$(document).ready(function() {

    $('#calculate').click(function(){
        $('#Ag span').text(Ag + " sq.in");
        $('#beta').text("\u03B2" + "1" + " = " + Math.round(Beta_1*100)/100);
    });

});
