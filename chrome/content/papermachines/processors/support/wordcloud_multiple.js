var fontSize = d3.scale.log().range(data["FONTSIZE"]);

var color = d3.scale.category10().domain(d3.range(10));

var width = data["WIDTH"], height = data["HEIGHT"];

var clouds = data["CLOUDS"];
var order = data["ORDER"];
var cloudVis = {}, cloudHash = {};

function valueformat(value) {
  if (value === undefined) return '';
  return data["FORMAT"] ? data["FORMAT"].replace("{0}", value.toString()) : value;
}

for (var i in order) {
  cloudVis[order[i]] = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height + 16)
    .append("g")
      .attr("transform", "translate(" + width/2 + "," + height/2 + ")");
}

function draw(label, words) {
  var vis = cloudVis[label];
  vis.selectAll("text.cloud")
      .data(words)
    .enter().append("text")
      .style("font-size", function(d) { return d.size + "px"; })
      .attr("text-anchor", "middle")
      .attr("class", "cloud")
      .style("fill", function (d) { return color(~~(Math.random() * 10));})
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] +")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; })
      .append("svg:title").text(function (d) { return cloudHash[label][d.text]});
      // .filter(function (d) { return d.hasOwnProperty("original_text");})
      // .append("title")
      // .text(function (d) { return d.original_text; });

  vis.append("text")
    .attr("transform", "translate(0," + ((height/2)) + ")")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .text(label);

}  
order.forEach(function (i) {
  var data = clouds[i];
  cloudHash[i] = {};
  data.forEach(function (d) {
     cloudHash[i][d.text] = valueformat(d.value);
  });
  var vals = data.map(function (d) { return +d.value});
  fontSize.domain([d3.min(vals), d3.max(vals)]);

  var myDraw = function (thisLabel) {
    return function(words) { draw(thisLabel, words);};
  };
  var layout = d3.layout.cloud().size([width, height])
    .words(data)
    .timeInterval(10)
    .rotate(function() { return ~~(Math.random() * 2) * 90; })
    .fontSize(function(d) { return fontSize(+d.value); })
    .on("end", (myDraw)(i))
    .start();
});