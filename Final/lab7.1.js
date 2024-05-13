// Set up the SVG canvas dimensions
var w = 1000;
var h = 600;

// Create the SVG element
var svg = d3.select("#chart")
  .append("svg")
  .attr("width", w)
  .attr("height", h)
  .style("outline", "solid thin skyblue");

// Read the data from CSV file
d3.csv("Unemployment_78-95.csv", function(d) {
  // Parse date and number
  return {
    date: new Date(+d.year, +d.month - 1), // Parse date
    number: +d.number // Parse number
  };
}).then(function(data) {
  // Call the line chart function with the dataset
  lineChart(data);
  // Log the dataset to console
  console.table(data, ["date", "number"]);
});

// Function to create the line chart
function lineChart(dataset) {
  // Set up scales
  var xScale = d3.scaleTime()
    .domain([d3.min(dataset, d => d.date), d3.max(dataset, d => d.date)])
    .range([100, w - 50]);

  var yScale = d3.scaleLinear()
    .domain([0, 1000000])
    .range([h - 50, 100]);

  // Create line generator
  var line = d3.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.number));

  // Append area to SVG
  svg.append("path")
    .datum(dataset)
    .attr("class", "area")
    .attr("d", d3.area()
      .x(d => xScale(d.date))
      .y0(h - 50)
      .y1(d => yScale(d.number))
    );

  // Create x-axis
  var xAxis = d3.axisBottom()
    .ticks(d3.timeYear.every(2)) // Display ticks every 2 years
    .tickFormat(d3.timeFormat("%Y")) // Format ticks as 4-digit years
    .scale(xScale);

  // Create y-axis
  var yAxis = d3.axisLeft()
    .ticks(5)
    .scale(yScale);

  // Append x-axis to SVG
  svg.append("g")
    .attr("transform", "translate(0," + (h - 50) + ")")
    .call(xAxis);

  // Append y-axis to SVG
  svg.append("g")
    .attr("transform", "translate(100, 0)")
    .call(yAxis);

  // Draw line for half a million mark
  svg.append("line")
    .attr("class", "line halfMilMark")
    .attr("x1", 100)
    .attr("y1", yScale(500000))
    .attr("x2", w - 50)
    .attr("y2", yScale(500000))
    .attr("stroke", "red")
    .attr("stroke-width", 2);

  // Add text label for half a million mark
  svg.append("text")
    .attr("class", "halfMilLabel")
    .attr("x", 110)
    .attr("y", yScale(500000) - 7)
    .text("Half a million unemployed");
}
