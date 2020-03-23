// Load data
Promise.all([
    d3.csv('/data/facebook-fact-check.csv'),
  ]).then(files => {
    let data = files[0];

    // Change all engagement counts to numbers
    data.forEach(d => {
      const columns = Object.keys(d)
      for (const col of columns) {
        if (col == "share_count" || col == "reaction_count" || col == "comment_count" || col == "engagement_count") {
          d[col] = +d[col];
        }
      }
    });

    let processPerPageData = data => {
      // collect total posts for the page
      // collect each type of post for the page
      let names = [...new Set(data.map(d => d.Page))]
      let ratings = [... new Set(data.map(d => d.Rating))]
      let map = names.map(n => {
          let obj = {};
          ratings.forEach(r => obj[r] = 0);
          obj.name = n;
          return obj;
      })

      let perPageData = data.reduce((map, current) => {
          let page = map.find(d => d.name == current.Page);
          page[current.Rating]++;
          return map;
      }, map)

      console.log(perPageData);

      perPageData.forEach(d =>
        d.total = Object.values(d).filter(a => !isNaN(a)).reduce((sum, cur) => sum + cur)
      );

      return perPageData;
  }

  let perPageData = processPerPageData(data);
  console.log(perPageData);

    // Initialize color legend
    let categoryLegend = new colorLegend({ 
        parentElement: '#color-legend',
        squareSize: 18
    });
  
    // Initialize bubble vis
    let postBubbles = new bubbleVis({ 
      parentElement: '#bubbleVis',
      data: data,
      idValue: d => d.post_id,
      colorValue: d => d.Rating,
      zValue: d => d.engagement_count,
      pageValue: d => d.Page,
      selectedCategory: 'left',
      linkValue: d => d['Post URL'],
      formatValue: d => d['Post Type']
    });
  
    postBubbles.render();  

    let pageRankings = new circleJuxtaposeVis({
      parentElement: '#falseToAllPostsRanking',
      data: data,
      postMap: perPageData,
    })

    pageRankings.render();
    
    let truthPercentage = new stackedBarVis({
      parentElement: '#stackedBarVis',
      data: data,
      postMap: perPageData,
    })
  });
  