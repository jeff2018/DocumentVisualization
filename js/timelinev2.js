var margin = {top: 200, right: 40, bottom: 200, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var data =[0,137]
var specifier = "%M:%S";
var parsedData = data.map(function(d) {
    return d3.timeParse(specifier)(d)
});

var formatCount = d3.format(",.0f"),
    formatTime = d3.timeFormat("%H:%M"),
    formatMinutes = function(d){ return formatTime(new Date(2012,0,1,0,d));};
var values = d3.range(1000).map(d3.randomLogNormal(Math.log(800), .4));
console.log(values);

var x = d3.scaleTime()
    .domain([0,Math.ceil(d3.max(data)*1000)])
    .range([0, width])
    ;

var y = d3.scaleTime()
    .domain([0,Math.ceil(d3.max(data)*1000)])
    .range([0, width]);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("rect")
    .attr("class","grid-background")
    .attr("width",width)
    .attr("height",height)
svg.append("g")
    .attr("class","x grid")
    .attr("transform","translate(0,"+height+")")
    .call(d3.axisBottom(x)
        .ticks(d3.timeSecond,1)
        //.tickValues(x)
        .tickFormat(function(){
            return null
        })//d3.timeFormat('%M:%S'))
        .tickSize(-height))

svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
        .ticks(d3.timeSecond, 10)
        .tickFormat(d3.timeFormat('%M:%S'))
        )

    .attr("text-anchor", "middle")
    .selectAll("text")
    .attr("x",0);

svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0,0)")
    .call(d3.axisTop(y)
        .ticks(d3.timeSecond, 5)
        .tickFormat(d3.timeFormat('%M:%S'))
        //.tickValues(1)
    )
    .attr("text-anchor","middle")
    .selectAll(".tick")
    .classed("tick--minor",function(d,i){
        if(i % 2){
            return d
        }else{
            d3.select(this).remove()
        }
    })
    .selectAll("text")
    .attr("x",0)


svg.append("g")
    .attr("class", "brush")
    .call(d3.brushX()
        .extent([[0, 0], [width, height]])
        .on("end", brushended));

function brushended() {
    if (!d3.event.sourceEvent) return; // Only transition after input.
    if (!d3.event.selection) return; // Ignore empty selections.
    var d0 = d3.event.selection.map(x.invert),
        d1 = d0.map(d3.timeSecond);

    // If empty when rounded, use floor & ceil instead.
    if (d1[0] >= d1[1]) {
        d1[0] = d3.timeSecond.floor(d0[0]);
        d1[1] = d3.timeSecond.offset(d1[0]);
    }

    d3.select(this).transition().call(d3.event.target.move, d1.map(x));
}