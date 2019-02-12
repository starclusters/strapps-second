var plateSize, sizeChange, type, size, Exp_Length, pSlope, data1;
var textOption = "<option>None</option>";
var myNode = d3.select("#draw3").node();
var Dead_Load, Live_Load, xLoad;
var Bearing = {};
var plate = [];
document.getElementById("plateList").style.display = "none";
d3.select(".stepOneB").style("display", "none");
d3.select("#stepTwoInput").style("display", "none");
d3.select("#typeVerify").style("display", "none");
d3.select("#divResult").style("display", "none");


var btnDraw = document.getElementById("drawBtn");
btnDraw.addEventListener("click", myFunction);
// document.getElementById("drawBtn").addEventListener("click", myFunction);

// document.addEventListener("DOMContentLoaded", function(event) {
//   document.getElementById("DL").value =110;
//   document.getElementById("LL").value=100;
//    console.log("DOM fully loaded and parsed");
//    btnDraw.click();
//  });

function myFunction() {

  Dead_Load = isNaN(parseFloat(document.getElementById("DL").value)) ? Dead_Load = 0 : Dead_Load = parseFloat(document.getElementById("DL").value);
  Live_Load = isNaN(parseFloat(document.getElementById("LL").value)) ? Live_Load = 0 : Live_Load = parseFloat(document.getElementById("LL").value);
  hideResult();

  xLoad = Dead_Load + Live_Load;
  var y11 = 164.9323 + xLoad*1.3735
  var x12 = 503.419 - Dead_Load*1.72

  var CircleData = [{x: x12, y: y11}]
  var LineData = [{x1: 503.419, y1: y11, x2: x12, y2: y11}, {x1: x12, y1: 164.9323, x2: x12, y2: y11}]

  var svg = d3.select("#plot");


 svg.selectAll("line").remove();
 svg.selectAll("circle").remove();
 d3.select("#plot02").selectAll("line").remove();
 d3.select("#plot02").selectAll("circle").remove();
 d3.select("#brg2Result").html("");
 d3.select("#typeResult").html("");
 d3.select("#stepTwoInput").style("display", "none");
 d3.select("#typeVerify").style("display", "none");
 d3.select("#selectMessage").html("");
 d3.select("#brg3Result").html("");
 d3.select("#brg3Comment").html("");
 plate = [];
 while (myNode.firstChild) {
   myNode.removeChild(myNode.firstChild);
 }


 if ((Dead_Load > 240) || (Dead_Load <= 0) || (xLoad > 400) ||(xLoad < 0) ) {

   d3.select("#brg1Result").html("Warning: The plotted point is beyond the limits of Elastometic Bearing Design. Change the input to re-Plot.")
          .style("color","red");
   // d3.select("#brg1Result").style("color","red");
   d3.select("#plateList").style("display", "none");
   d3.select("#showMsg").text("Dead Load + Live Load = "+ xLoad + " kips");
   d3.select(".stepOneB").style("display", "none");
   d3.select("#stepTwoInput").style("display", "none");
   d3.select("#brg3Result").html("");
   d3.select("#brg3Comment").html("");
   while (myNode.firstChild) {
     myNode.removeChild(myNode.firstChild);
 }

 }
   else {

 svg.selectAll("circle").data(CircleData)
          .enter()
          .append("circle")
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
          .attr("r", 10);

 svg.selectAll("line")
          .data(LineData)
          .enter()
          .append("line")
          .attr("x1", function(d) {return d.x1; })
          .attr("y1", function(d) {return d.y1; })
          .attr("x2", function(d) {return d.x2; })
          .attr("y2", function(d) {return d.y2; });

  textOption = "<option>None</option>";

  d3.select("#showMsg").text("Dead Load + Live Load = "+ xLoad.toFixed(2) + " kips");
// "/static/elastobrg/data/bearing1.csv"
  d3.csv("/static/elastobrg/data/bearing1.csv", function(error, data){
     if (error) throw error;
// {% static 'elastobrg/css/bearing.css' %}
     data.forEach(function(d){
          d.x1 = +d.x1;
          d.x2 = +d.x2;
          d.y1 = +d.y1;
          d.y2 = +d.y2;
          d.dim = +d.dim;
          d.tone = +d.tone;
          d.ttwo = +d.ttwo;
          d.x11 = +d.x11;
          d.x22 = +d.x22;
          d.y11 = +d.y11;
          d.y22 = +d.y22;

      if ((xLoad >= d.x1) && (xLoad <= d.x2) && (Dead_Load >= d.y1) && (Dead_Load <= d.y2)) {
        plate.push(d.size);
        // textOption += "<option>" + d.size + "</option>";
      }
        });

      for (var i = 1; i < plate.length; i++) {
        textOption += "<option>" + plate[i] + "</option>";
      }

      if (plate.length != 0) {
        document.getElementById("brg1Result").innerHTML = "The plotted plate size for Types I & II is: " + plate[0];
        d3.select("#brg1Result").style("color", "");
        d3.select("#plateOption").html(textOption);
        d3.select("#plateList").style("display", "");
        d3.select(".stepOneB").style("display", "");
        d3.select("#brg3Result").html("");
        d3.select("#brg3Comment").html("");
        plateSize = plate[0];

      }
      else {
        // document.getElementById("brg1Result").innerHTML = "The plotted point is beyond the limits of Elastometic Bearing Design. Change the input to re-Plot.";
        d3.select("#brg1Result").html("The plotted point is beyond the limits of Elastometic Bearing Design. Change the input to re-Plot.")
            .style("color", "red");
        d3.select("#plateList").style("display", "none");
        // d3.select("#brg1Result").style("color","red");
        d3.select("#showMsg").text("Dead Load + Live Load = "+ xLoad + " kips");
        d3.select(".stepOneB").style("display", "none");
        d3.select("#stepTwoInput").style("display", "none");
        d3.select("#brg3Result").html("");
        d3.select("#brg3Comment").html("");
        while (myNode.firstChild) {
          myNode.removeChild(myNode.firstChild);
      }
      }

      data1 = data;

   });

 }

}
document.getElementById("drawBtn02").addEventListener("click", secondFunction);

function secondFunction() {

  Exp_Length = parseFloat(document.getElementById("EL").value);
  var y2 = 217.05 + Exp_Length*0.599;
  var x2 = 140.368;
  sizeChange = plateSize;
  hideResult();

  if (d3.select("#plateOption").property("value")!= "None") {
    sizeChange = d3.select("#plateOption").property("value");
  }
  else {
    sizeChange = plateSize;
  }

 size = sizeChange;

 data1.forEach(function(d){

  if (d.size == sizeChange) {
    x2 = d.dim;
    typeOneLimit = d.tone;
    typeTwoLimit = d.ttwo;
  }
 });

 if ((Exp_Length >= 0) && (Exp_Length <= typeOneLimit)) {
  type = "Type I";
  document.getElementById("typeResult").innerHTML = "The plotted bearing type is: " + type;
  d3.select("#typeResult").style("color","");
  d3.select("#brg2Result").style("display","none");
  d3.select("#stepTwoInput").style("display", "");
  d3.select("#typeVerify").style("display", "none");
  d3.select("#brg3Result").html("");
  d3.select("#brg3Comment").html("");
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
 }

 }
 else if ((Exp_Length > typeOneLimit) && (Exp_Length <= typeTwoLimit)) {
  type = "Type II";
  document.getElementById("typeResult").innerHTML = "The plotted bearing type is: " + type;
  d3.select("#typeResult").style("color","");
  d3.select("#brg2Result").style("display","none");
  d3.select("#stepTwoInput").style("display", "");
  d3.select("#typeVerify").style("display", "none");
  d3.select("#brg3Result").html("");
  d3.select("#brg3Comment").html("");
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
 }

 }
  else if ((Exp_Length > typeTwoLimit) && (Exp_Length <= 800)) {
   type = "Type III";
   document.getElementById("typeResult").innerHTML = "The plotted bearing type is: " + type;
   d3.select("#typeResult").style("color","");
   d3.select("#brg2Result").style("display","");
   d3.select("#stepTwoInput").style("display", "");
   d3.select("#typeVerify").style("display", "");
   plateTwo = [];
   var textOption2 = "List of other eligible Type III plate/plates : ";

  data1.forEach(function(d){

    if ((xLoad >= d.x11) && (xLoad <= d.x22) && (Dead_Load >= d.y11) && (Dead_Load <= d.y22)) {
      plateTwo.push(d.size);
    }
  });

  for (var i = 1; i < plateTwo.length; i++) {
    if (plateTwo.length == 1) {
      textOption2 += "None";
    }
    else {
      textOption2 += plateTwo[i] + ", ";
    }

  }

    if (plateTwo.length != 0) {
      document.getElementById("brg2Result").innerHTML = "The plotted plate size for Type III is: " + "<strong>"+ plateTwo[0]+"</strong>";
      d3.select("#brg3Result").html(textOption2);

      if ((plate[0] != plateTwo[0]) && (d3.select("#plateOption").node().value == "None")) {
        d3.select("#brg3Comment").html("The plotted plate size for Type III does not match the previous plot for the Type of Bearing in Step 1 (B). Select another plate from the dropdwon in Step 1 (A) and continue from there.");
        d3.select("#stepTwoInput").style("display", "none");
        console.log("whynotworking");

      }

      else if (plate[0] == plateTwo[0]) {
        d3.select("#brg3Comment").html("The plotted plate in Step 1 (B) is matching with Type III plate. First step is complete.");
        d3.select("#stepTwoInput").style("display", "");

      }

      else if (d3.select("#plateOption").node().value == plateTwo[0]) {
        d3.select("#brg3Comment").html("The selected plate in Step 1 (B) is matching with the plotted Type III plate. First step is complete.");
        d3.select("#stepTwoInput").style("display", "");

      }
      else {
        for (var i = 0; i < plateTwo.length; i++) {
          if (d3.select("#plateOption").node().value == plateTwo[i]) {
            d3.select("#brg3Comment").html("The selected plate in Step 1 (B) is matching with one of the eligible plates for Type III. First step is complete.");
            d3.select("#stepTwoInput").style("display", "");
            break;
          }
          else {
            d3.select("#brg3Comment").html("The selected plate in Step 1 (B) doesn't match with any of the eligible plates for Type III. The design parameters are beyond the limit of Elastomeric Bearing Design");
            d3.select("#stepTwoInput").style("display", "none");
          }

        }

      }

      d3.select("#brg2Result").style("color","");
      d3.select("#typeResult").style("display","");
      sizeChange = plateTwo[0];
      thirdFunction();
    }
    else {
      d3.select("#brg2Result").html("Warning: The plotted point is beyond the limits of Elastometic Bearing Design. Change the input to re-Plot.")
         .style("color","red");
      d3.select("#typeResult").style("display","none");
      d3.select("#stepTwoInput").style("display", "none");
      thirdFunction();
    }

 }

  else {
   d3.select("#typeResult").html("Warning: The Expansion Length is beyond the limits of Elastometic Bearing Design. Change the input to re-Plot.")
        .style("color","red");
   d3.select("#brg2Result").style("display","none");
   // d3.select("#typeResult").style("display","none");
   d3.select("#typeVerify").style("display", "none");
   d3.select("#brg3Comment").html("");
   d3.select("#stepTwoInput").style("display", "none");
 }

  var CircleData = [{x: x2, y: y2}]
  var LineData = [{x1: 466.599, y1: y2, x2: x2, y2: y2}]

  var svg = d3.select("#plot02");

 svg.selectAll("line").remove();
 svg.selectAll("circle").remove();

 if ((Exp_Length <= 800) && (Exp_Length >= 0)) {

 svg.selectAll("circle").data(CircleData)
          .enter()
          .append("circle")
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
          .attr("r", 10);

 svg.selectAll("line")
          .data(LineData)
          .enter()
          .append("line")
          .attr("x1", function(d) {return d.x1; })
          .attr("y1", function(d) {return d.y1; })
          .attr("x2", function(d) {return d.x2; })
          .attr("y2", function(d) {return d.y2; });

          }
}

function thirdFunction() {

  var y11 = 168.038 + xLoad*1.366096
  var x12 = 502.5329 - Dead_Load*1.70967

  var CircleTwoData = [{x: x12, y: y11}]
  var LineTwoData = [{x1: 502.5329, y1: y11, x2: x12, y2: y11}, {x1: x12, y1: 168.038, x2: x12, y2: y11}]

  if (!myNode.firstChild) {

      d3.xml("/static/elastobrg/svg/bearing3.svg").mimeType("image/svg+xml").get(function(error, xml) {
      if (error) throw error;
      // document.getElementById("draw3").appendChild(xml.documentElement);
      myNode.appendChild(xml.documentElement);

      var svg = d3.select("#plot03");

      svg.selectAll("circle").data(CircleTwoData)
                .enter()
                .append("circle")
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; })
                .attr("r", 10);

      svg.selectAll("line")
                .data(LineTwoData)
                .enter()
                .append("line")
                .attr("x1", function(d) {return d.x1; })
                .attr("y1", function(d) {return d.y1; })
                .attr("x2", function(d) {return d.x2; })
                .attr("y2", function(d) {return d.y2; });

    });

  }

 var svg = d3.select("#plot03");

 svg.selectAll("line").remove();
 svg.selectAll("circle").remove();

 svg.selectAll("circle").data(CircleTwoData)
          .enter()
          .append("circle")
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
          .attr("r", 10);

 svg.selectAll("line")
          .data(LineTwoData)
          .enter()
          .append("line")
          .attr("x1", function(d) {return d.x1; })
          .attr("y1", function(d) {return d.y1; })
          .attr("x2", function(d) {return d.x2; })
          .attr("y2", function(d) {return d.y2; });

}

function typeOneSeries(size, expL, slope){

  var seriesTable = [];
  var expTable = [];
  var slopeTable = [];
  var rowTable = [];
  var brgSeries, taper;

  d3.tsv("/static/elastobrg/data/typeOne.tsv", function(error, data){
      if (error) throw error;

      data.forEach(function(d,i){
           d.ExpL = +d.ExpL;
           d.mSlope = +d.mSlope;
           d.We_I = +d.We_I;
           d.Le_I = +d.Le_I;
           d.TeD = +d.TeD;
           d.Tp_f = svgFracText(d.Tp_f);
           d.z_f = svgFracText(d.z_f);
           d.Tp = conv16thFraction(d.Tp);
           d.Te = conv16thFraction(d.Te);
           d.z = conv16thFraction(d.z);


           if ((d.Size == size)) {
             seriesTable.push(d.Brg);
             expTable.push(d.ExpL);
             slopeTable.push(d.mSlope);
             rowTable.push(i);
           }
 });

 for (var i = 0; i < seriesTable.length; i++) {
   if ((expL <= expTable[i]) && (slope <= slopeTable[i])) {
     brgSeries = seriesTable[i];
     taper = "No";
     row = rowTable[i];
     break;
   }
   else {
     brgSeries = seriesTable[0];
     taper = "Yes"
     row = rowTable[0];
   }
 }

 Bearing = data[row];
 Bearing["Taper?"]=taper;
 var Wt = (Bearing.We_I + 1);
 Bearing["Wt"] = conv16thFraction(Wt);
 var Wf = Math.abs(document.getElementById("Wf").value);
 Lt = roundUp16thDecimal(Math.max(Wf, Bearing.Le_I+2));
 Bearing["Lt"] = conv16thFraction(Lt);
 var strReactImp = isNaN(parseFloat(document.getElementById("SRI").value)) ? 0 : parseFloat(document.getElementById("SRI").value);
 var brgStiffener = document.querySelector('input[name="stiffener"]:checked').value;
 var yieldStrength = document.querySelector('input[name="yieldstrength"]:checked').value;
 var rC = (yieldStrength === "36") ? 0.144 : 0.122;
 var stifFactor = (brgStiffener === "No") ? 1.0 : 0.80;
 Tt = roundUp16thDecimal(Math.max(rC*stifFactor*Math.sqrt(strReactImp*Bearing.Le_I/(Bearing.We_I+1)), 1.5));
 Bearing["Tt"] = conv16thFraction(Tt);
 Bearing["Th"] = conv16thFraction(Bearing.TeD + Tt);

 boltOption = document.getElementById('boltOption').value;
 boltDia = [0.625, 0.75, 1.0, 1.25, 1.5, 2.0, 2.5];
 boltY = [1.75, 1.875, 2.125, 2.375, 2.75, 3.25, 3.75];
 boltT = [0.5, 0.5, 0.5, 0.5, 0.625, 0.625, 0.625];
 Bearing["y"] = conv16thFraction(boltY[boltOption]);
 Bearing["t"] = conv16thFraction(boltT[boltOption]);

 var textTable01Head = "";
 var textTable01Row = "";
 var textTable02Head = "";
 var textTable02Row = "";
 // var brgObjectLength = Object.keys(Bearing).length;
 var brgTableArray01 = ["Size",	"Type",	"Bearing", "We",	"Le",	"Tp",	"Np",	"Ts",	"Ns",	"Te"];
 var brgTableArray02 = ["S.Max%", "W", "z", "Taper?",	"Wt",	"Lt", "Tt",	"Th",	"y",	"t"];

 //loop thru tableArray to get the corresponding keys to be shown in tabular form
 for (var i = 0; i < 10; i++) //10 = length of array brgTableArray01
 {
   // textTable01Head += '<th scope="col">' + Object.keys(Bearing)[i] + "</th>";
   textTable01Head += '<th scope="col">' + brgTableArray01[i] + "</th>";
   // textTable01Row += "<td>" + Bearing[Object.keys(Bearing)[i]] + "</td>";
   textTable01Row += "<td>" + Bearing[brgTableArray01[i]] + "</td>";

 }

 for (var i = 0; i < 10; i++) //10 = length of array brgTableArray02
 {
   // textTable02Head += '<th scope="col">' + Object.keys(Bearing)[i] + "</th>";
   textTable02Head += '<th scope="col">' + brgTableArray02[i] + "</th>";
   // textTable02Row += "<td>" + Bearing[Object.keys(Bearing)[i]] + "</td>";
   textTable02Row += "<td>" + Bearing[brgTableArray02[i]] + "</td>";
 }

 d3.select("#table01Head").html(textTable01Head);
 d3.select("#table01Row").html(textTable01Row);
 d3.select("#table02Head").html(textTable02Head);
 d3.select("#table02Row").html(textTable02Row);

 });

 //remove if existing and plot result of type 1
 var nodeType1 = d3.select("#draw4").node();
 var nodeType12 = d3.select("#draw5").node();
 var nodeType13 = d3.select("#draw6").node();

 while (nodeType1.firstChild) {
   nodeType1.removeChild(nodeType1.firstChild);
}
while (nodeType12.firstChild) {
  nodeType12.removeChild(nodeType12.firstChild);
}
while (nodeType13.firstChild) {
  nodeType13.removeChild(nodeType13.firstChild);
}

 d3.xml("/static/elastobrg/svg/Bearing-Sizes-24.svg").mimeType("image/svg+xml").get(function(error, xml) {
 if (error) throw error;
 nodeType1.appendChild(xml.documentElement);
 document.getElementById("wt").textContent=Bearing["Wt"];
 document.getElementById("we").textContent=Bearing.We;
 d3.select("#lt").html(svgFracText(Lt));
 // document.getElementById("wf").textContent= Wf.value+'"';
 d3.select("#wf").html(svgFracText(Wf.value));
 document.getElementById("le").textContent=Bearing.Le;
 // document.getElementById("tt").textContent=Bearing["Tt"];
 d3.select("#tt").html(svgFracText(Tt));
 d3.select("#th").html(svgFracText(Bearing.TeD + Tt));
 d3.select("#te").html(svgFracText(Bearing.TeD));
 // document.getElementById("tp").textContent=Bearing.Tp;
 d3.select("#tp").html(Bearing.Tp_f);
 document.getElementById("ns").textContent=Bearing.Ns;
 // document.getElementById("ts").textContent=Bearing.Ts;
 d3.select("#ts").html(Bearing.Ts);
 // d3.select("#ts").html(svgFracText(Bearing.Ts));
});

d3.xml("/static/elastobrg/svg/ABD-156_27.svg").mimeType("image/svg+xml").get(function(error, xml) {
if (error) throw error;
nodeType12.appendChild(xml.documentElement);
document.getElementById("W").textContent=Bearing.W;
d3.select("#y").html(svgFracText(boltY[boltOption]));
d3.select("#dia").html(svgFracText(boltDia[boltOption] + 0.25));
// document.getElementById("t").textContent=svgFracText(boltT[boltOption]);
d3.selectAll(".t").html(svgFracText(boltT[boltOption]));
d3.select("#z1").html(Bearing.z_f);
d3.select("#z2").html(Bearing.z_f);

});

d3.xml("/static/elastobrg/svg/retainer0.svg").mimeType("image/svg+xml").get(function(error, xml) {
if (error) throw error;
nodeType13.appendChild(xml.documentElement);
d3.select("#z3").html(Bearing.z_f);
});

}

function typeTwoSeries(size, expL, slope){

  var seriesTable = [];
  var expTable = [];
  var slopeTable = [];
  var rowTable = [];
  var taper, slopeLimit;

  d3.tsv("/static/elastobrg/data/typeTwo.tsv", function(error, data){
      if (error) throw error;

      data.forEach(function(d,i){
           d.ExpL = +d.ExpL;
           d.We_I = +d.We_I;
           d.Le_I = +d.Le_I;
           d.ERT = +d.ERT;
           d.TeD = +d.TeD;
           d.z = +d.z;
           d.Tp = conv16thFraction(d.Tp);
           d.Te = conv16thFraction(d.Te);

           slopeLimit = (12*Dead_Load*d.ERT)/(d.Le_I*Math.pow(d.We_I,2));

           if ((d.Size == size)) {
             seriesTable.push(d.Brg);
             expTable.push(d.ExpL);
             slopeTable.push(slopeLimit);
             rowTable.push(i);
           }
 });

 for (var i = 0; i < seriesTable.length; i++) {
   if ((expL <= expTable[i]) && (slope <= slopeTable[i])) {
     brgSeries = seriesTable[i];
     taper = "No";
     row = rowTable[i];
     break;
   }
   else {
     brgSeries = seriesTable[0];
     taper = "Yes"
     row = rowTable[0];
   }
 }
 Bearing = data[row];
 Bearing["Taper?"]=taper;
 Bearing["A"]=(Bearing.We_I > 7) ? conv16thFraction(1.5):'1"';
 var aforA = (Bearing.We_I > 7) ? 1.5:1;
 var expNT = Math.abs(document.getElementById("ENT").value);
 var Wt = roundUp16thDecimal((Bearing.We_I-2*aforA+2*expNT+2));
 Bearing["Wt"] = conv16thFraction(Wt);
 var Wf = Math.abs(document.getElementById("Wf").value);
 var Lt = roundUp16thDecimal(Math.max(Wf, Bearing.Le_I+2));
 Bearing["Lt"] = conv16thFraction(Lt);
 var strReactImp = isNaN(parseFloat(document.getElementById("SRI").value)) ? 0 : parseFloat(document.getElementById("SRI").value);
 var brgStiffener = document.querySelector('input[name="stiffener"]:checked').value;
 var yieldStrength = document.querySelector('input[name="yieldstrength"]:checked').value;
 var rC = (yieldStrength === "36") ? 0.144 : 0.122;
 var stifFactor = (brgStiffener === "No") ? 1.0 : 0.80;
 var Tt = roundUp16thDecimal(Math.max(rC*stifFactor*Math.sqrt(strReactImp*Bearing.Le_I/(Bearing.We_I+1)), 1.5));
 Bearing["Tt"] = conv16thFraction(Tt);
 Bearing["Th"] = conv16thFraction(Bearing.TeD + Tt);
 var Lb = Lt + 2*Bearing.z + 0.25;
 var strengthReact = isNaN(parseFloat(document.getElementById("SR").value)) ? 0 : parseFloat(document.getElementById("SR").value);
 var Wb = Bearing.We_I + 1;
 var Tb = roundUp16thDecimal(Math.max(rC*(Lb-Bearing.Le_I)*Math.sqrt(strengthReact/(Lb*Wb)), 1.0));
 Bearing["Lb"] = conv16thFraction(Lb);
 Bearing["Wb"] = conv16thFraction(Wb);
 Bearing["Tb"] = conv16thFraction(Tb);
 Bearing["z"] = conv16thFraction(Bearing.z);

 var boltOption = document.getElementById('boltOption').value;
 var boltY = [1.75, 1.875, 2.125, 2.375, 2.75, 3.25, 3.75];
 var boltT = [0.5, 0.5, 0.5, 0.5, 0.625, 0.625, 0.625];
 Bearing["y"] = conv16thFraction(boltY[boltOption]);
 Bearing["t"] = conv16thFraction(boltT[boltOption]);

 var textTable01Head = "";
 var textTable01Row = "";
 var textTable02Head = "";
 var textTable02Row = "";
 var brgObjectLength = Object.keys(Bearing).length;

//loop thru selective element index, not a good approach b/c index is not guaranteed
 for (var i = 5; i < 17; i++) {
   textTable01Head += '<th scope="col">' + Object.keys(Bearing)[i] + "</th>";
   textTable01Row += "<td>" + Bearing[Object.keys(Bearing)[i]] + "</td>";
 }

 for (var i = 17; i < brgObjectLength; i++) {
   textTable02Head += '<th scope="col">' + Object.keys(Bearing)[i] + "</th>";
   textTable02Row += "<td>" + Bearing[Object.keys(Bearing)[i]] + "</td>";
 }

 d3.select("#table01Head").html(textTable01Head);
 d3.select("#table01Row").html(textTable01Row);
 d3.select("#table02Head").html(textTable02Head);
 d3.select("#table02Row").html(textTable02Row);

 });

}

function typeThreeSeries(size, slope){

  var seriesTable = [];
  var slopeTable = [];
  var rowTable = [];
  var taper, slopeLimit;

  d3.tsv("/static/elastobrg/data/typeThree.tsv", function(error, data){
      if (error) throw error;

      data.forEach(function(d,i){
           d.We_I = +d.We_I;
           d.Le_I = +d.Le_I;
           d.ERT = +d.ERT;
           d.TeD = +d.TeD;
           d.z = +d.z;
           d.TbGr36 = +d.TbGr36;
           d.TbGr50 = +d.TbGr50;
           d.Tp = conv16thFraction(d.Tp);
           d.Te = conv16thFraction(d.Te);
           d.Dp = conv16thFraction(d.Dp);
           d.Ds = conv16thFraction(d.Ds);
           d.Hp = conv16thFraction(d.Hp);

           slopeLimit = (12*Dead_Load*d.ERT)/(d.Le_I*Math.pow(d.We_I,2));

           if ((d.Size == size)) {
             seriesTable.push(d.Brg);
             slopeTable.push(slopeLimit);
             rowTable.push(i);
           }
  });

 for (var j = 0; j < seriesTable.length; j++) {
   if (slope <= slopeTable[j]) {
     brgSeries = seriesTable[j];
     taper = "No";
     row = rowTable[j];
     break;

   }
   else {
     brgSeries = seriesTable[0];
     row = rowTable[0];
     taper = "Yes"
   }
 }

 Bearing = data[row];
 Bearing["Taper?"]=taper;
 Bearing["A"]=(Bearing.We_I > 7) ? conv16thFraction(1.5):'1"';
 var aforA = (Bearing.We_I > 7) ? 1.5:1;
 var expNT = Math.abs(document.getElementById("ENT").value);
 var Wt = roundUp16thDecimal((Bearing.We_I-2*aforA+2*expNT+2));
 Bearing["Wt"] = conv16thFraction(Wt);
 var Wf = Math.abs(document.getElementById("Wf").value);
 var Lt = roundUp16thDecimal(Math.max(Wf, Bearing.Le_I+2));
 Bearing["Lt"] = conv16thFraction(Lt);
 var strReactImp = isNaN(parseFloat(document.getElementById("SRI").value)) ? 0 : parseFloat(document.getElementById("SRI").value);
 var brgStiffener = document.querySelector('input[name="stiffener"]:checked').value;
 var yieldStrength = document.querySelector('input[name="yieldstrength"]:checked').value;
 var rC = (yieldStrength === "36") ? 0.144 : 0.122;
 var stifFactor = (brgStiffener === "No") ? 1.0 : 0.80;
 var Tt = roundUp16thDecimal(Math.max(rC*stifFactor*Math.sqrt(strReactImp*Bearing.Le_I/(Bearing.We_I+1)), 1.5));
 Bearing["Tt"] = conv16thFraction(Tt);
 Bearing["Th"] = conv16thFraction(Bearing.TeD + Tt);
 var Lb = Lt + 2*Bearing.z + 0.25;
 var strengthReact = isNaN(parseFloat(document.getElementById("SR").value)) ? 0 : parseFloat(document.getElementById("SR").value);
 var Wb = Bearing.We_I + 1;
 var Tb_min = (yieldStrength === "36") ? Bearing.TbGr36 : Bearing.TbGr50;
 var Tb = roundUp16thDecimal(Math.max(rC*(Lb-Bearing.Le_I)*Math.sqrt(strengthReact/(Lb*Wb)), Tb_min));
 Bearing["Lb"] = conv16thFraction(Lb);
 Bearing["Wb"] = conv16thFraction(Wb);
 Bearing["Tb"] = conv16thFraction(Tb);
 Bearing["z"] = conv16thFraction(Bearing.z);

 var boltOption = document.getElementById('boltOption').value;
 var boltY = [1.75, 1.875, 2.125, 2.375, 2.75, 3.25, 3.75];
 var boltT = [0.5, 0.5, 0.5, 0.5, 0.625, 0.625, 0.625];
 Bearing["y"] = conv16thFraction(boltY[boltOption]);
 Bearing["t"] = conv16thFraction(boltT[boltOption]);

 var textTable01Head = "";
 var textTable01Row = "";
 var textTable02Head = "";
 var textTable02Row = "";
 var brgObjectLength = Object.keys(Bearing).length;

 for (var i = 6; i < 17; i++) {
   textTable01Head += '<th scope="col">' + Object.keys(Bearing)[i] + "</th>";
   textTable01Row += "<td>" + Bearing[Object.keys(Bearing)[i]] + "</td>";
 }

 for (var i = 17; i < brgObjectLength; i++) {
   textTable02Head += '<th scope="col">' + Object.keys(Bearing)[i] + "</th>";
   textTable02Row += "<td>" + Bearing[Object.keys(Bearing)[i]] + "</td>";
 }

 d3.select("#table01Head").html(textTable01Head);
 d3.select("#table01Row").html(textTable01Row);
 d3.select("#table02Head").html(textTable02Head);
 d3.select("#table02Row").html(textTable02Row);

 });

}

document.getElementById("finalBtn").addEventListener("click", fourthFunction);

function fourthFunction(){
  pSlope = Math.abs(document.getElementById("SL").value);
  var flangeThick = Math.abs(document.getElementById("Tf").value);
  var boltDia = ["5/8", "3/4", "1", "1-1/4", "1-1/2", "2", "2-1/2"];

  if (type == "Type I") {
    typeOneSeries(size, Exp_Length, pSlope);
  }

  else if (type == "Type II") {
    typeTwoSeries(size, Exp_Length, pSlope);

  }
  else {
    typeThreeSeries(size, pSlope);

  }
showResult();

}

document.getElementById("plateOption").addEventListener("change", selectMessage);

function selectMessage(){
  if (d3.select("#plateOption").node().value != "None") {
    d3.select("#selectMessage").html("The selected plate size is: "+ this.value);
  }
  else {
    d3.select("#selectMessage").html("");
  }
}
