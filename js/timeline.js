var myVideos = [];
var duration= null;
window.URL = window.URL || window.webkitURL;

document.getElementById('fileUp').onchange = setFileInfo;

function setFileInfo() {
    var files = this.files;
    myVideos.push(files[0]);
    var video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = function() {
        window.URL.revokeObjectURL(video.src);
        duration = video.duration;
        myVideos[myVideos.length - 1].duration = duration;
        updateInfos();
    }

    video.src = URL.createObjectURL(files[0]);;
}


function updateInfos() {
    var infos = document.getElementById('infos');
    infos.textContent = "";
    for (var i = 0; i < myVideos.length; i++) {
        infos.textContent += myVideos[i].name + " duration: " + myVideos[i].duration + '\n';
    }
}
var endtime = 137
var starttime = 0

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours + ':' + minutes + ':' + seconds;
}

var margin = {top: 200, right: 40, bottom: 200, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


var data =[0,137]
var specifier = "%M:%S";
var parsedData = data.map(function(d) {
    return d3.timeParse(specifier)(d)
});
/*
var formatCount = d3.format(",.0f"),
    formatTime = d3.timeFormat("%H:%M"),
    formatMinutes = function(d){ return formatTime(new Date(2012,0,1,0,d));};

var x = d3.scaleLinear()
    .domain(parsedData)
    .rangeRound([0, width]);*/

var x = d3.scaleTime()
    .domain([new Date(2013, 7, 1), new Date(2013, 7, 15) - 1])
    .rangeRound([0, width]);



var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
    .attr("class", "axis axis--grid")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
        .ticks(d3.timeMinute, 1)
        .tickSize(-height)
        .tickFormat(function() { return null; }))
    .selectAll(".tick")
    .classed("tick--minor", function(d) {
        console.log(d)
        return d.getHours(); });

svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
        .ticks(d3.timeDay)
        .tickPadding(0))
    .attr("text-anchor", null)
    .selectAll("text")
    .attr("x", 6);
/*
svg.append("g")
    .attr("class", "brush")
    .call(d3.brushX()
        .extent([[0, 0], [width, height]])
        .on("end", brushended));*/

function brushended() {
    if (!d3.event.sourceEvent) return; // Only transition after input.
    if (!d3.event.selection) return; // Ignore empty selections.
    var d0 = d3.event.selection.map(x.invert),
        d1 = d0.map(d3.timeDay.round);

    // If empty when rounded, use floor & ceil instead.
    if (d1[0] >= d1[1]) {
        d1[0] = d3.timeDay.floor(d0[0]);
        d1[1] = d3.timeDay.offset(d1[0]);
    }

    d3.select(this).transition().call(d3.event.target.move, d1.map(x));
}