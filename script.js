
dataSource1 = "Trump_Tweets_Frequency.csv"

function makePlot1(data) {

    function unpack(data, key) {
        return data.map(function(data) { return data[key]; });
      }

    var data = [{
        type: "scatter",
        mode: "lines",
        name: 'Trump Tweets',
        x: unpack(data, 'date'),
        y: unpack(data, 'Frequency'),
        line: {color: 'black'}
    }]

    console.log(data)
   
    var layout = { //layout information for the graph pretty standard 
        font: {
            size: 16,
            family: "Heebo",
            color: "black"
        },
        xaxis: {
            title: 'Date',
            range: ['2017-01-01', '2021-01-08'],
            type: 'date'
        },
        yaxis: {

            range: [0, 70],
            title: 'Tweets',
            type: 'linear'
        },
        hovermode: 'closest',

    };
     // Create the plot:
    Plotly.newPlot('firstPlot', {
        data: data,
        layout: layout,
        config: {
            displayModeBar: false} 
    }); 
}

Plotly.d3.csv(dataSource1, function (data) { makePlot1(data) })