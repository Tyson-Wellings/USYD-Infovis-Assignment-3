
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
    var dates = [['2017-1-1','2021-1-8'],['2017-1-1','2017-12-31'],['2018-1-1','2018-12-31'],['2019-1-1','2019-12-31'],['2020-1-1','2021-1-8']]

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