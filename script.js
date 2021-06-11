
dataSource1 = "Trump_Tweets_Frequency.csv"
dataSource2 = "Kmeans_clusters.csv"
function makePlot1(data) {

    function unpack(data, key) {
        return data.map(function (data) { return data[key]; });
    }

    var data = [{
        type: "bar",
        name: 'Trump Tweets',
        x: unpack(data, 'date'),
        y: unpack(data, 'Frequency'),
        line: { color: 'black' }
    }]

    var dates = [['2017-1-1', '2021-1-8'], ['2017-1-1', '2017-12-31'], ['2018-1-1', '2018-12-31'], ['2019-1-1', '2019-12-31'], ['2020-1-1', '2021-1-8']]

    var layout = { //layout information for the graph pretty standard 

        width: 800,
        font: {
            size: 16,
            family: "Heebo",
            color: "black"
        },
        xaxis: {

        },
        yaxis: {
            fixedrange: true
        },
        line: {
            width: 1
        },
        hovermode: 'closest',

        sliders: [{
            pad: { t: 30 },
            currentvalue: {
                xanchor: 'right',
                prefix: 'Year: ',
                font: {
                    color: '#888',
                    size: 20
                }
            },

            steps: [{
                label: 'All',
                method: 'relayout',
                args: ['xaxis.range', dates[0]]
            }, {
                label: '2017',
                method: 'relayout',
                args: ['xaxis.range', dates[1]]
            }, {
                label: '2018',
                method: 'relayout',
                args: ['xaxis.range', dates[2]]
            }, {
                label: '2019',
                method: 'relayout',
                args: ['xaxis.range', dates[3]]
            }, {
                label: '2020',
                method: 'relayout',
                args: ['xaxis.range', dates[4]]
            }]
        }]
    };



    // Create the plot:
    Plotly.newPlot('firstPlot', {
        data: data,
        layout: layout,
        config: {
            displayModeBar: false
        }
    });
}



//from https://codereview.stackexchange.com/a/171857
function convertToParagraph(sentence, maxLineLength) {
    let lineLength = 0;
    sentence = sentence.split(" ")
    return sentence.reduce((result, word) => {
        if (lineLength + word.length >= maxLineLength) {
            lineLength = word.length;
            return result + `<br>${word}`;
        } else {
            lineLength += word.length + (result ? 1 : 0);
            return result ? result + ` ${word}` : `${word}`;
        }
    }, '');
}

function makePlot2(data) {
    console.log(data)
    clusters = {
        2017: {},
        2018: {},
        2019: {},
        2020: {}
        }

    
    var search_year = 2016;
    var visibility = true
    for (i = 0; i < data.length; i++) {
        var datum = data[i]
        
        if (parseInt(datum.year) !== search_year){
            clusters[datum.year] = {
                x: [],
                y: [],
                mode: 'markers',
                type: 'scatter',
                customdata: [],
                hovertemplate:
                    "%{customdata}" +
                    "<extra></extra>",
                marker: {
                    size: 4,
                    color: [],
                },
                visible: visibility
            }
            visibility = false
            search_year++;
        }
        console.log(datum.clusterColor)
        if (datum.year == search_year) {
            clusters[datum.year].x.push(datum.x);
            clusters[datum.year].y.push(datum.y);
            clusters[datum.year].customdata.push(convertToParagraph(datum.text, 64));
            clusters[datum.year].marker.color.push(datum.clusterColor);
        }
    }


    var data = [clusters[2017],clusters[2018],clusters[2019],clusters[2020]
    ];

    var updatemenus=[
        {
            buttons: [
                {
                    args: [{'visible': [true, false, false, false]},
                           {'title': '2017 cluster'}],
                    label: '2017',
                    method: 'update'
                },
                {
                    args: [{'visible': [false, true, false, false,]},
                           {'title': '2018 cluster'}],
                    label: '2018',
                    method: 'update'
                },
                {
                    args: [{'visible': [false, false, true, false,]},
                           {'title': '2019 cluster'}],
                    label: '2019',
                    method: 'update'
                },
                {
                    args: [{'visible': [false, false, false, true,]},
                           {'title': '2020 cluster'}],
                    label: '2020',
                    method: 'update'
                },
    
            ],
            direction: 'left',
            pad: {'r': 10, 't': 10},
            showactive: true,
            type: 'buttons',
            x: .32,
            xanchor: 'left',
            y: -0.2,
            yanchor: 'bottom'
        },
    
    ]


    let layout = {
        visible: [true, false, false, false],
        title: '2017 cluster',
        width: 800,
        hovermode: "closest",
        xaxis: {
            visible: false,
        },
        yaxis: {
            visible: false,
        },
        showlegend: false,
        updatemenus: updatemenus,
    }

    Plotly.newPlot('secondPlot', data,layout, {displayModeBar: false});
}


Plotly.d3.csv(dataSource1, function (data) { makePlot1(data) })
Plotly.d3.csv(dataSource2, function (data) { makePlot2(data) })
