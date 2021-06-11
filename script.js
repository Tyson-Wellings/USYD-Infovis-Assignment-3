
dataSource1 = "Trump_Tweets_Frequency.csv"
dataSource2 = "Kmeans_clusters.csv"
dataSource3 = "blue_vocab_sorted.csv"
dataSource4 = "stacked_bar.csv"

function unpack(data, key) {
    return data.map(function (data) { return data[key]; });
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

function make_clusters_by_year(data){
    
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
        if (datum.year == search_year) {
            clusters[datum.year].x.push(datum.x);
            clusters[datum.year].y.push(datum.y);
            clusters[datum.year].customdata.push(convertToParagraph(datum.text, 64));
            clusters[datum.year].marker.color.push(datum.clusterColor);
        }
    }

    return clusters
}

function make_clusters_by_word(data){
    
    clusters = []
    var search_word = -1;
    var visibility = true
    for (i = 0; i < data.length; i++) {
        var datum = data[i]
        
        if (parseInt(datum.word) !== search_word){
            clusters[datum.word] = {
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
                    color: 'rgb(0, 14, 137)',
                },
                visible: visibility
            }
            visibility = false
            search_word++;
        }
        if (datum.word == search_word) {
            clusters[datum.word].x.push(datum.x);
            clusters[datum.word].y.push(datum.y);
            clusters[datum.word].customdata.push(convertToParagraph(datum.text, 64));
        }
    }

    return clusters
}

function makePlot1(data) {



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



function makePlot2(data) {

    clusters = make_clusters_by_year(data)

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

function makePlot3(data) {

    clusters = make_clusters_by_word(data)

    var data = [clusters[0],clusters[1],clusters[2],clusters[3],clusters[4],clusters[5]];
    var updatemenus=[
        {
            buttons: [
                {
                    args: [{'visible': [true, false, false, false, false, false]},
                           {'title': 'All Blue Tweets'}],
                    label: 'All',
                    method: 'update'
                },
                {
                    args: [{'visible': [false, true, false, false, false, false]},
                           {'title': 'Blue Tweets containing fake'}],
                    label: 'fake',
                    method: 'update'
                },
                {
                    args: [{'visible': [false, false, true, false, false, false]},
                           {'title': 'Blue Tweets containing radical'}],
                    label: 'radical',
                    method: 'update'
                },
                {
                    args: [{'visible': [false, false, false, true, false, false]},
                           {'title': 'Blue Tweets containing sleepy'}],
                    label: 'sleepy',
                    method: 'update'
                },
                {
                    args: [{'visible': [false, false, false, false, true, false]},
                           {'title': 'Blue Tweets containing corrupt'}],
                    label: 'corrupt',
                    method: 'update'
                },
                {
                    args: [{'visible': [false, false, false, false, false, true]},
                           {'title': 'Blue Tweets containing Lamestream'}],
                    label: 'Lamestream',
                    method: 'update'
                },
    
            ],
            direction: 'left',
            pad: {'r': 10, 't': 10},
            showactive: true,
            type: 'buttons',
            xanchor: 'left',
            y: -0.2,
            yanchor: 'bottom'
        },
    
    ]


    let layout = {
        title: 'All Blue Tweets',
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

    Plotly.newPlot('thirdPlot', data,layout, {displayModeBar: false});
}

function makePlot4(data) {

    function unpack(data, key) {
        return data.map(function (data) { return data[key]; });
    }

    var dates = [['2020-1-1', '2021-1-8'],['2020-1-1', '2020-1-31'], ['2020-2-1', '2020-2-29'], 
    ['2020-3-1', '2020-3-31'], ['2020-4-1', '2020-4-30'], ['2020-5-1', '2020-5-31'],
    ['2020-6-1', '2020-6-30'], ['2020-7-1', '2020-7-31'], ['2020-8-1', '2020-8-31'], 
    ['2020-9-1', '2020-9-30'], ['2020-10-1', '2020-10-31'],['2020-11-1', '2020-11-30'], 
    ['2020-12-1', '2021-1-8']]

    var traces = [];
    var words = ['fake','radical','sleepy','corrupt','Lamestream']
    for (i=0; i<words.length; i++){
        traces[i]={
            type: "bar",
            name: words[i],
            x: unpack(data, 'date'),
            y: unpack(data, words[i]),
            line: { colorscale: 'Rainbow' }
        }
    }
    console.log(traces)
    var layout = { //layout information for the graph pretty standard 

        barmode: 'stack',
        width: 900,
        font: {
            size: 16,
            family: "Heebo",
            color: "black"
        },
        xaxis: {
            fixedrange: false
           
        },
        yaxis: {
            fixedrange: true
        },
        line: {
            width: 1
        },
        hovermode: 'closest',

        sliders: [{
            pad: { t: 90 },
            currentvalue: {
                xanchor: 'right',
                prefix: 'Month: ',
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
                label: 'Jan',
                method: 'relayout',
                args: ['xaxis.range', dates[1]]
            }, {
                label: 'Feb',
                method: 'relayout',
                args: ['xaxis.range', dates[2]]
            }, {
                label: 'Mar',
                method: 'relayout',
                args: ['xaxis.range', dates[3]]
            }, {
                label: 'Apr',
                method: 'relayout',
                args: ['xaxis.range', dates[4]]
            }, {
                label: 'May',
                method: 'relayout',
                args: ['xaxis.range', dates[5]]
            }, {
                label: 'June',
                method: 'relayout',
                args: ['xaxis.range', dates[6]]
            }, {
                label: 'July',
                method: 'relayout',
                args: ['xaxis.range', dates[7]]
            }, {
                label: 'Aug',
                method: 'relayout',
                args: ['xaxis.range', dates[8]]
            }, {
                label: 'Sep',
                method: 'relayout',
                args: ['xaxis.range', dates[9]]
            }, {
                label: 'Oct',
                method: 'relayout',
                args: ['xaxis.range', dates[10]]
            }, {
                label: 'Nov',
                method: 'relayout',
                args: ['xaxis.range', dates[11]]
            }, {
                label: 'Dec/Jan',
                method: 'relayout',
                args: ['xaxis.range', dates[12]]
            }]
        }]
        

    };



    // Create the plot:
    Plotly.newPlot('fourthPlot', {
        data: traces,
        layout: layout,
        config: {
            displayModeBar: false
        }
    });
}


Plotly.d3.csv(dataSource1, function (data) { makePlot1(data) })
Plotly.d3.csv(dataSource2, function (data) { makePlot2(data) })
Plotly.d3.csv(dataSource3, function (data) { makePlot3(data) })
Plotly.d3.csv(dataSource4, function (data) { makePlot4(data) })
