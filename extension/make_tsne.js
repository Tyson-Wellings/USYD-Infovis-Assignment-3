function calculate_tsne(vector_data){
  let vectors = [];
  let i = 0;
  for(let vector of vector_data){
    if(i++ > 100) break; //only do the first 100 tweets
    vectors.push(Object.values(vector).slice(1).map(Number));
  }
 
  //from https://github.com/karpathy/tsnejs
  let tsne = new tsnejs.tSNE();
  tsne.initDataRaw(vectors);

  for(let i = 0; i < 500; i++) {
    tsne.step(); // every time you call this, the solution gets better
    console.log("iteration " + i + " complete")
  }

  let embedding = tsne.getSolution();
  make_plot(embedding)
}

function make_plot(embedding){
  let data = [{
    x: embedding.map(embed => embed[0]),
    y: embedding.map(embed => embed[1]),
    mode: 'markers',
    type: 'scatter'
  }];

  Plotly.newPlot('plotDiv', data);
}

Plotly.d3.csv("data/obama_presidential_tweet_vectors.csv", (vectors) => {
  calculate_tsne(vectors)
});

