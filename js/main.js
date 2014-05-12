var data;
var dataset;
var w;
var h;
var circleAmount = 100;
var svg;

var frequency = 5000; // expressed in miliseconds
var myInterval = 0;



d3.json("js/data.json", function(error, json){
	if (error) return console.log(error);
	data = json;
	init();
});

function init(){
	var projects = d3.select('#wrapper .projects');
	var project = projects.selectAll('a')
		.data(data.Projects)
		.enter()
		.append('a')
		.attr('class', 'project')
		.attr('href', function(d){return d.url})
		;

	var title = project.append('h2').append('p').html(function(d){return d.name}).attr('class','title');
	var description = project.append('p').html(function(d){return d.description}).attr('class','description');
	var atGuardian = title.append("span").attr('class','guardian')
		.html(function(d){
			if(d.atGuardian) return "GUARDIAN";
		})

	w = $('body').width();
	h = $(window).height();
	visualise();
}

function startLoop() {
	updateData();
window.setInterval(function(){
  updateData();
}, 20000);
}

function visualise(){
	svg = d3.select('body').append('div').attr('class','background').append('svg').attr('width',w).attr('height',h);
	svg.selectAll('circle')
		.data(fillDataset())
		.enter()
		.append("circle")
		.attr('cx',function(d){
			return d[0];
		})
		.attr('cy',function(d){
			return d[1];
		})
		.attr('r',1)
		.style('opacity', function(d){return Math.random()*0.5})
	startLoop();
	
}

function updateData(){
	console.log('doei');
	svg.selectAll('circle')
		.data(fillDataset())
		.transition()
		.duration(20000)
		.ease('linear')
		.attr('cx',function(d){
			return d[0];
		})
		.attr('cy',function(d){
			return d[1];
		})

}



function fillDataset(){
	dataset = [];
	for(var i=0; i<circleAmount; i++){
		dataset[i] = [Math.floor(Math.random()*w), Math.floor(Math.random()*h)];
	}
	return dataset;
}