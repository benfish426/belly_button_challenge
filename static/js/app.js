function init(){
    // Fetch the JSON data and console log it
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(data => {
        console.log("Imported data:", data);
    
        // Create variables and store the data needed
        let names = data.names;
        let samples = data.samples;
        let metadata = data.metadata;
        
        // Use D3 to select the dropdown menu
        let dropdownMenu = d3.select("#selDataset");
        // Fill the dropdown with associated ids
        names.forEach(function(name){
            dropdownMenu.append("option").text(name).property("value", name)
        });
        
        let firstSubject = names[0];
        updatePlots(firstSubject, samples, metadata);

        dropdownMenu.on("change", function(){
            let specificSubject = d3.select(this).property("value");
            updatePlots(specificSubject, samples, metadata);
        });
    });
}

// Function to update the bar chart
function updateBarChart(selectedSample){
    //Generate the top 10 
    let otuIDS = selectedSample.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    let sampleValues = selectedSample.sample_values.slice(0, 10).reverse();
    let otuLabels = selectedSample.otu_labels.slice(0, 10).reverse();
    
    let trace = {
        x:sampleValues,
        y: otuIDS,
        text: otuLabels,
        type: "bar",
        orientation: "h"
    };

    let data = [trace];

    let layout = {
        title: "Top 10 OTU's Found"
    };

    Plotly.newPlot("bar", data, layout);
}

// Function to update the bubble chart
function updateBubbleChart(selectedSample){
    let trace = {
        x: selectedSample.otu_ids,
        y: selectedSample.sample_values,
        text: selectedSample.otu_labels,
        mode: "markers",
        marker: {
            size: selectedSample.sample_values,
            color: selectedSample.otu_ids,
            colorscale: "Earth"
        }
    };

    // Data for the plot
    let data = [trace];

    // Layout for the plot
    let layout = {
        xaxis: {title: "OTU IDs"},
    };

    // Plot the chart
    Plotly.newPlot("bubble", data, layout);
}


// Function to display sample metadata
function displayMetadata(metadata) {
    let metadataPanel = d3.select("#sample-metadata");
    metadataPanel.html(""); 

    // Iterate over each key-value pair in metadata and key-value to Panel
    Object.entries(metadata).forEach(([key, value]) => {
        metadataPanel.append("p").text(`${key}: ${value}`);
    });
}

// Function to update all plots and metadata based on the selected ID
function updatePlots(selectedID, samples, metadata) {
    let selectedSample = samples.filter(sample => sample.id === selectedID)[0];
    console.log("Selected Sample:", selectedSample);
    updateBarChart(selectedSample);
    updateBubbleChart(selectedSample);
    displayMetadata(metadata.filter(meta => meta.id.toString() === selectedID)[0]);
}

// Set variable to be the entire "demographic info" box using inspector
let demographicInfo = document.querySelector(".card-header");

// Change background color and font color in box
demographicInfo.style.backgroundColor = "#1f77b4";
demographicInfo.style.color = "white";

init();