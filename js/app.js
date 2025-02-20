// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

     // Extract metadata array from the data
     let metadata = data.metadata;
 
     // Filter metadata to find the object matching the selected sample ID
     // Similar to pandas .loc, this creates an array with just the matching object
     let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);

     // Get the first (and only) item from the filtered array
     let result = resultArray[0];

     // Select the HTML element with ID 'sample-metadata' using D3
     let PANEL = d3.select('#sample-metadata');

     // Clear any existing content in the panel
     PANEL.html("");

     // Iterate through each key-value pair in the metadata
     // Append each pair as an h6 element with formatted text
     for (key in result) {
         PANEL.append('h6').text(`${key.toUpperCase()}: ${result[key]}`);
     };
 });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

   // Extract samples array from the data
   let samples = data.samples;
 
   // Filter for the selected sample, similar to above
   let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
   let result = resultArray[0];

   // Extract the required arrays for plotting
   let otu_ids = result.otu_ids;
   let otu_labels = result.otu_labels;
   let sample_values = result.sample_values;

   // Create bubble chart configuration
   var bubbleLayout = {
       title: 'Bacteria Cultures Per Sample',
       margin: { t: 30 },
       hovermode: 'closest',
       xaxis: { title: 'OTU ID' }
   };

   // Define bubble chart data structure
   var bubbleData = [{
       x: otu_ids,                    // X-axis: OTU IDs
       y: sample_values,              // Y-axis: Sample values
       text: otu_labels,              // Hover text
       mode: 'markers',               // Display as bubbles
       marker: {
           size: sample_values,       // Bubble size based on sample values
           color: otu_ids,            // Color based on OTU IDs
           colorscale: 'Earth'        // Color scheme
       }
   }];

   // Create the bubble chart
   Plotly.newPlot('bubble', bubbleData, bubbleLayout);

   // Create formatted y-axis labels for bar chart
   // Takes top 10 OTU IDs and formats them as "OTU {id}"
   let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

   // Define bar chart data structure
   let barData = [{
       x: sample_values.slice(0, 10).reverse(),  // Top 10 sample values
       y: yticks,                                // Formatted OTU IDs
       text: otu_labels.slice(0, 10).reverse(),  // Hover text
       type: 'bar',
       orientation: 'h'                          // Horizontal bar chart
   }];

   // Bar chart layout configuration
   let barLayout = {
       title: 'Top 10 Bacteria Cutures Found',
       margin: { t: 30, l: 150 }
   };

   // Create the bar chart
   Plotly.newPlot('bar', barData, barLayout);
});
}

// Initialization function - runs when the page loads
function init() {}
// Select the dropdown element
let selector = d3.select('#selDataset');

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get array of sample names
    let sampleOfNames = data.names;
 
    // Add each sample to the dropdown menu
    for (let i = 0; i < sampleOfNames.length; i++) {
        selector
            .append('option')
            .text(sampleOfNames[i])
            .property('value', sampleOfNames[i]);
    };

    // Use first sample to build initial display
    let firstSample = sampleOfNames[0];
    buildMetadata(firstSample);
    buildCharts(firstSample);
});
}

// Function that runs when a new sample is selected from dropdown
function optionChanged(sampleID) {
// Update metadata and charts with new sample data
buildMetadata(sampleID);
buildCharts(sampleID);
}

// Initialize the dashboard when the page loads
init();