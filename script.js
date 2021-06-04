
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

        width: 800,
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
            displayModeBar: false} 
    }); 
}

//from https://codereview.stackexchange.com/a/171857
function convertToParagraph(sentence, maxLineLength){
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