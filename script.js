
//these variables are used by functions so they are initialized globally
var dates = [['2017-1-1', '2017-12-31'], ['2018-1-1', '2018-12-31'], ['2019-1-1', '2019-12-31'], 
['2020-1-1', '2021-1-8'],['2017-1-1','2021-1-8']]
var years = ['2017','2018','2019','2020-2021','2017-2021']
var height =[[0,20],[0,20],[0,40],[0,70],[0,70]];
var Year = 2017;
var zoomCount=0

// data sources for our makePlot functions
dataSource1 = "Trump_Tweets_Frequency.csv"
dataSource2 = "Kmeans_clusters.csv"
dataSource3 = "blue_vocab_sorted.csv"
dataSource4 = "stacked_bar.csv"

//This function is taken from class provided code
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

//this custom function controls the buttons. Using arrays and index's cuts down on the lines of code I have to write.
function adjustPlot1 (index){
    
    Plotly.animate('firstPlot', {

        layout: {
          xaxis: {range: dates[index]},
          yaxis: {range: height[index]},
          title: {
            text: 'Total Daily Trump Tweets in '+years[index]}
        }
        }, {
        transition: {
          duration: 500,
          easing: 'cubic-in-out'
        }
    })
}


// This function sorts the kmeans clusters into different traces which are then shown according to the button interactions.

function make_clusters_by_year(data) {
 
    clusters = {
        2017: {},
        2018: {},
        2019: {},
        2020: {}
    }

//this code takes inspiration from the clusters code provided in week 11
    var search_year = 2016;
    var visibility = true
    for (i = 0; i < data.length; i++) {
        var datum = data[i]

        if (parseInt(datum.year) !== search_year) {
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
//similar function to the last one. This one is used for the 3rd graph hence  make_cluster_by_word
function make_clusters_by_word(data) {

    clusters = []
    var search_word = -1;
    var visibility = true
    for (i = 0; i < data.length; i++) {
        var datum = data[i]

        if (parseInt(datum.word) !== search_word) {
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

//inspired by the unpack function from before. This one is used in the fourth graph. 

function unpackDates (data,week){
    var range = ['2020-01-01']
    var endDate = week*7
    range.push(data[endDate].date)
    return range
}

//This function is used in graph 4 to toggle the y-axis
function zoomOut4 (reset){
    
    var max = [100,200,400,600,800,1000]
    zoomCount++
    if (reset == 0){
        zoomCount=0
    }
    if (zoomCount > 5){
        zoomCount = 5
    }
    Plotly.animate('fourthPlot', {

        layout: {
          yaxis: {range: [0, max[zoomCount]]}
        }
        }, {
        transition: {
          duration: 500,
          easing: 'cubic-in-out'
        }
    })
}

function makePlot1(data) {

    var data = [{
        type: "bar",
        name: 'Trump Tweets',
        x: unpack(data, 'date'),
        y: unpack(data, 'Frequency'),
        marker: { color: '1F7A8C' }
    }]

    var layout = { 
        title: {
            text: 'Total Daily Trump Tweets in '+years[0],
            font: {
                family: 'Cabin',
                size: 24,
                type: 'bold'
              },

        },
        plot_bgcolor: "#fafafa",
        paper_bgcolor: '#fafafa',
        width: 800,
        height: 400,
        font: {
            size: 12,
            family: "Cabin",
            color: "black"
        },
        xaxis: {
            range: dates[0]
        },
        yaxis: {
            range:[0,20]
        },
        line: {
            width: 1
        },
        hovermode: 'closest',
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

    var data = [clusters[2017], clusters[2018], clusters[2019], clusters[2020]
    ];

    var updatemenus = [
        {   //it says buttons but these become the dropdown menu. essentially the clusters are revealed based on what label is picked.
            buttons: [
                {
                    args: [{ 'visible': [true, false, false, false] },
                    { 'title': '2017 cluster' }],
                    label: '2017',
                    method: 'update'
                },
                {
                    args: [{ 'visible': [false, true, false, false,] },
                    { 'title': '2018 cluster' }],
                    label: '2018',
                    method: 'update'
                },
                {
                    args: [{ 'visible': [false, false, true, false,] },
                    { 'title': '2019 cluster' }],
                    label: '2019',
                    method: 'update'
                },
                {
                    args: [{ 'visible': [false, false, false, true,] },
                    { 'title': '2020 cluster' }],
                    label: '2020',
                    method: 'update'
                },

            ],
             direction: 'down',
            pad: { 'r': 5, 'l': 5, 'b':5, 't': 5 },
            showactive: true,
            type: 'dropdown',
            xanchor: 'left',
            x: .8,
            yanchor: 'top',
            y: 1 
        },

    ]


    let layout = {
        visible: [true, false, false, false],
        title: {
            text: '2017 cluster',
            font: {
                family: 'Cabin',
                size: 24,
                type: 'bold'
              },

        },
        plot_bgcolor: "#fafafa",
        paper_bgcolor: '#fafafa',
        width: 800,
        height: 400,
        font: {
            size: 12,
            family: "Cabin",
            color: "black"
        },
        xaxis: {
            visible: false,
        },
        yaxis: {
            visible: false,
        },
        showlegend: false,
        hovermode: "closest",
        updatemenus: updatemenus,
    }

    Plotly.newPlot('secondPlot', data, layout, { displayModeBar: false });
}

function makePlot3(data) {

    clusters = make_clusters_by_word(data)
    var data = [clusters[0], clusters[1], clusters[2], clusters[3], clusters[4], clusters[5]]; 
    var updatemenus = [
        {
            buttons: [
                {
                    args: [{ 'visible': [true, false, false, false, false, false] },
                    { 'title': 'All Blue Tweets' }],
                    label: 'All',
                    method: 'update'
                },
                {
                    args: [{ 'visible': [false, true, false, false, false, false] },
                    { 'title': 'Blue Tweets containing fake' }],
                    label: 'fake',
                    method: 'update'
                },
                {
                    args: [{ 'visible': [false, false, true, false, false, false] },
                    { 'title': 'Blue Tweets containing radical' }],
                    label: 'radical',
                    method: 'update'
                },
                {
                    args: [{ 'visible': [false, false, false, true, false, false] },
                    { 'title': 'Blue Tweets containing sleepy' }],
                    label: 'sleepy',
                    method: 'update'
                },
                {
                    args: [{ 'visible': [false, false, false, false, true, false] },
                    { 'title': 'Blue Tweets containing corrupt' }],
                    label: 'corrupt',
                    method: 'update'
                },
                {
                    args: [{ 'visible': [false, false, false, false, false, true] },
                    { 'title': 'Blue Tweets containing Lamestream' }],
                    label: 'Lamestream',
                    method: 'update'
                },

            ],
            direction: 'down',
            pad: { 'r': 10, 't': 10 },
            showactive: true,
            type: 'dropdown',
            xanchor: 'right',
            x: 1.2,
            yanchor: 'top',
            y: 1.05
        },

    ]


    let layout = {
        title: {
            text: 'All Blue Tweets',
            font: {
                family: 'Cabin',
                size: 24,
                type: 'bold'
              },

        },
        plot_bgcolor: "#fafafa",
        paper_bgcolor: '#fafafa',
        width: 800,
        height: 400,
        font: {
            size: 12,
            family: "Cabin",
            color: "black"
        },
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

    Plotly.newPlot('thirdPlot', data, layout, { displayModeBar: false });
}


function makePlot4(data) {
    var words,traces4 = []


    console.log(data)
    function unpack(data, key) {
        return data.map(function (data) { return data[key]; });
    }

    words = ['fake', 'radical', 'sleepy', 'corrupt', 'Lamestream']
    steps = []
    colors = ["053c5e","1f7a8c","20a4f3","ce7b91","c1292e"]


    for (i = 0; i < words.length; i++) {
        traces4[i] = {
            type: "bar",
            name: (words[i]),
            x: unpack(data, 'date'),
            y: unpack(data, words[i]),
            marker: {
                color:colors[i]
            }
        }
    } 
    
    numberOfWeeks = (data.length)/7-1
    for (j = 0; j < numberOfWeeks; j++) {
       
        steps.push(
            {   
                label: ('week '+(j+1)),
                method: 'relayout',
                args: ['xaxis.range', unpackDates(data,j+1)]
                    
            })
    } 

var layout = {
    title: {
        text: "Cumulative count of Trump Tweets Containing Specific Loaded Words",
        font: {
            family: 'Cabin',
            size: 24,
            type: 'bold'
          },

    },
    plot_bgcolor: "#fafafa",
    paper_bgcolor: '#fafafa',
    width: 800,
    height: 400,
    font: {
        size: 12,
        family: "Cabin",
        color: "black"
    },
    barmode: "stack",
    xaxis: {
        range: unpackDates(data, 1)

    },
    yaxis: {
        range:[0,100]
    },
    line: {
        width: 10
    },
    hovermode: 'closest',

    sliders: [{
        active: 0,
        pad: { t: 10 },
        currentvalue: {
            xanchor: 'right',
            font: {
                color: '#888',
                size: 20
            }
        },
        steps: steps
    }] 

}
Plotly.newPlot('fourthPlot', {
    data: traces4,
    layout: layout,
    config: {
        displayModeBar: false
    },
});
}

Plotly.d3.csv(dataSource1, function (data) { makePlot1(data) })
Plotly.d3.csv(dataSource2, function (data) { makePlot2(data) })
Plotly.d3.csv(dataSource3, function (data) { makePlot3(data) })
Plotly.d3.csv(dataSource4, function (data) { makePlot4(data) })
