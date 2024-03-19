// Store URL in a variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function init(){
    // Fetch JSON data and log it in a console
    d3.json(url).then(function(alldata){
    // Selecting dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Get all of the names from JSON
    let names = alldata.names;

    // Fix dropdown
    names.forEach(function(id){
        dropdownMenu.append('option').text(id).property('value', id);
    });

    // Pass first name and call the functions
    chartvalues(names[0]);
    metadata(names[0]);
    });
};

// Set changing options function
function optionChanged(passedValue) {
    chartvalues(passedValue);
    metadata(passedValue);
};

// Change it to another function
function chartvalues(passedValue){
    // Use JSON data
    d3.json(url).then(function(alldata){

        // Retreive samples
        let samples = alldata.samples;

        // Filter
        let id = samples.filter(take=>take.id == passedValue);

        // Sourcing data for al the charts
        let sample_values = id[0].sample_values;
        let otu_ids = id[0].otu_ids;
        let otu_labels = id[0].otu_labels;

        // Call the function
        charts(sample_values, otu_ids, otu_labels);
    });
};

// Create a function that displays bar and bubble charts
function charts(sample_values, otu_ids, otu_labels){
    // Use JSON data
    d3.json(url).then(function(alldata){
        // Load data for the bar chart
        let bar_data = [{
            type: 'bar',
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(id=> `OTU ${id}`).reverse(),
            text: otu_labels,
            orientation: 'h'
        }];

        // Load data for bubble chart
        let bubble_data = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker:{
                color: otu_ids,
                colorscale: 'Earth',
                size: sample_values
            }
        }];

        // Set layout for the bar chart
        let bar_layout = {
            title: 'Bar Chart',
            height: 600,
            width: 400
        };
        // Set layout for the bubble chart
        let bubble_layout = {
            title: 'Bubble Chart',
            height: 550,
            width: 1000
        };

        // Display bar char
        Plotly.newPlot('bar', bar_data, bar_layout);
        Plotly.newPlot('bubble', bubble_data, bubble_layout);
    });
};

function metadata(passedValue){
    // Load JSON data
    d3.json(url).then(function(alldata){
        // Retreive samples
        let samples = alldata.metadata;

        // Filter through metadata
        let id = samples.filter(take => take.id == passedValue);
        let sample_metadata = d3.select('#sample-metadata').html('');

        // Iterate through the values
        Object.entries(id[0]).forEach(([key, value])=> {
            // Display information in demographic style (chart and table)
            sample_metadata.append("h6").text(`${key}: ${value}`);
        });
    });
};
init();