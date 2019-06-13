
function buildMetadata(sample) {
  
  d3.json(`/metadata/${sample}`).then((Data) => {
      var $data = d3.select("#sample-metadata");   
      $data.html("");  

      Object.entries(Data).forEach(([key, value]) => {
      $data.append("h6").text(`${key}: ${value}`);
      
    })

  })
};


    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel

    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

  d3.json(`/samples/${sample}`).then((Data) => {

console.log(Data.otu_ids);
    
    var x = Data.otu_ids
    //console.log(x);
    var y = Data.sample_values
    //console.log(y);
    //Bubble chart
    var trace2  = {
      x: x,
      y: y,
      
      mode: "markers",
      marker: {
        color: x, 
        colorscale: 'Earth',
        size: y,
        text: Data.otu_labels,
        symbol: ["circle"]
      }
    };
    var layout2 = {
      xaxis: {title:"OTU ID"}
     };

    var data = [trace2];

    Plotly.newPlot("bubble",data, layout2);

    

    // @TODO: Build a Pie Chart



    var items = []
      // i,
      // x = Data.otu_ids,
      // y = Data.sample_values;
    for (i = 0; i < x.length; i++) {
      items[i] = [x[i], y[i]];
    }
    console.log(items);

    //var items = Object.keys(dict).map(function(key) {
    //  return [key, dict[key]];
    //});
    items.sort(function(a, b) {
      return b[1] - a[1];
    });
    var slicedArray = items.slice(0,10);
    console.log(slicedArray);
    
    var xPie = [];
    var yPie = [];
    var i = 0;
      for (i=0; i<slicedArray.length; i++){
        if (slicedArray[i][0] && i<slicedArray.length);
        xPie.push(slicedArray[i][0]);
      }
      console.log(xPie);
      
      for (i=0; i<slicedArray.length; i++){
        if (slicedArray[i][1] && i<slicedArray.length);
        yPie.push(slicedArray[i][1]);
      }

      console.log(yPie);

    //Pie chart
    var trace1 = {
      labels: xPie,
      values: yPie,
      type: "pie",
      text: Data.otu_labels.map(row => row)
    }
    var pieData = [trace1];
    var layout1 = {
      height: 500,
      width: 500
    };

    Plotly.newPlot("pie", pieData, layout1);

 });

}
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

