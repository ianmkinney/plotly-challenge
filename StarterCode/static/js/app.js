// Create function to read data
function buildData(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var results = metadata.filter(sampleobject => sampleobject.id == sample);
        var result = results[0];
        var panel = d3.select("#sample-metadata");
        panel.html("");
        Object.entries(result).forEach(([key, value]) => {
            panel.append("h6").text(`${key}: ${value}`);
        });
    });
}

function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var resultsarray = samples.filter(sampleobject => sampleobject.id == sample);
        var result = resultsarray[0]

        var ids = result.otu_ids;
        var labels = result.otu_labels;
        var values = result.sample_values;

        var LayoutBubble = {
            margin: { t: 0 },
            xaxis: { title: "OTU ID" },
            hovermode: "closest",
            };
        
        var DataBubble = [ 
            {
                x: ids,
                y: values,
                text: labels,
                mode: "markers",
                marker: {
                color: ids,
                size: values,
                }
            }
        ];
        
        Plotly.newPlot("bubble", DataBubble, LayoutBubble);

        var bar_data =[
            {
                y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
                x:values.slice(0,10).reverse(),
                text:labels.slice(0,10).reverse(),
                type:"bar",
                orientation:"h"
        
            }
        ];
        
        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: { t: 30, l: 150 }
        };
        
        Plotly.newPlot("bar", bar_data, barLayout);
    });
}

function init() {
    var select = d3.select("#selDataset");
    d3.json("samples.json").then((data) => {
        var names = data.names;
        names.forEach((sample) => {
            select
              .append("option")
              .text(sample)
              .property("value", sample);
        });
        const first = names[0];
        buildCharts(first);
        buildData(first);
    });
}

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildData(newSample);
    }

init();