
dataSource1 = "Trump_Tweets_Frequency.csv"

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

    console.log(data)

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
                label: '2017',
                method: 'restyle',
                args: ['x-axis.range', '[1-1-2017,31-12-2017']
            }, {
                label: '2018',
                method: 'restyle',
                args: ['x-axis.range', '[1-1-2018,31-12-2018']
            }, {
                label: '2019',
                method: 'restyle',
                args: ['x-axis.range', '[1-1-2019,31-12-2019']
            }, {
                label: '2020',
                method: 'restyle',
                args: ['x-axis.range', '[1-1-2020,8-1-2021']
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

function make_plot(tweet_data, tsne_data) {
    let data = [{
        x: tsne_data.map(d => d.x),
        y: tsne_data.map(d => d.y),
        mode: 'markers',
        type: 'scatter',
        customdata: tweet_data.map(d => convertToParagraph(d.text, 64)),
        hovertemplate:
            "%{customdata}" +
            "<extra></extra>",
        marker: {
            size: 4,
            colorscale: 'Jet',
            color: tsne_data.map(d => d.cluster_id),
        }
    }];

    let layout = {
        width: 800,
        hovermode: "closest",
        xaxis: {
            visible: false,
        },
        yaxis: {
            visible: false,
        }
    }

    Plotly.newPlot('secondPlot', data, layout);
}


Plotly.d3.csv(dataSource1, function (data) { makePlot1(data) })
Plotly.d3.csv("trump_presidential_tweets.csv", (tweets) => {
    Plotly.d3.csv("tsne_trump_data_2020_2021.csv", (tnse_data) => {
        make_plot(tweets, tnse_data)
    });
});