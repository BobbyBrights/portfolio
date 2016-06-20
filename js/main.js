// I was a bit tired of overengineering simple web projects with dozens of npm packages and build tools. So I just made a nice and simple main.js. Ahhh.

var windowHeight = window.innerHeight;
var windowWidth = window.innerWidth;
var isMobile = windowWidth < 480 ? true : false;
var projectHeight = windowWidth < 1040 ? 480 : 720;
var scrollCount = 0;
var firstScroll = true;

if(isMobile){
	initMobile();
}

initProjectTurkey();
initProjectRefugees();

var projectEls = document.querySelectorAll('.project-wrapper');
var activeProjects = [];

window.onscroll = function(e){
	scrollCount++;
	if(scrollCount>5 || firstScroll){
		firstScroll = false;
		scrollCount = 0;

		for(c=0;c<projectEls.length;c++){
			var topOffset = projectEls[c].getBoundingClientRect().top;
			if(topOffset < windowHeight + projectHeight){
				if(projectEls[c].className.indexOf('played') < 0){
					projectEls[c].className += " played";
					var id = projectEls[c].id;
					if(id==="project-mekong"){
						initProjectMekong();
					}else if(id==="project-euro2016"){
						initProjectEuro2016();
					}else if(id==="project-popes"){
						initProjectPopes();
					}else if(id==="project-civilwar"){
						initProjectCivilwar();
					}else if(id==="project-worldcup"){
						initProjectWorldcup();
					}else if(id==="project-nhs"){
						initProjectNhs();
					}else if(id==="project-vangaal"){
						initProjectVangaal();
					}else if(id==="project-scotland"){
						initProjectScotland();
					}else if(id==="project-bangla"){
						initProjectBangla();
					}else if(id==="project-comments"){
						initProjectComments();
					}
				}
			}
		}
	}	
}


function initProjectComments(){
	var data = [{x:0, y:0, height:0}, {x:1, y:0, height:0}, {x:2, y:0, height:0},{x:4, y:0, height:0} ]
	var shape = d3_shape.area()
		.x(function(d){
			return (windowWidth/(data.length-1)) * d.x
		})
		.y0(function(d){
			return d.y - d.height
		})
		.y1(function(d){
			return d.y + d.height
		})
		.curve(d3_shape.curveBasis)

	for(j=0;j<3;j++){
		data = data.map(function(e){
			e.height = Math.random() * 100;
			e.y = Math.random() * projectHeight;

			return e
		})
		var path = shape(data);
		var el = document.querySelectorAll('#comments-viz path')[j];
		el.setAttribute('d',path);
	}

	setInterval(function(){
		var offsetTop = document.querySelector('#project-comments').getBoundingClientRect().top;

		if(offsetTop > -projectHeight && offsetTop < windowHeight){
			for(j=0;j<3;j++){
				data = data.map(function(e){
					e.height = Math.random() * 100;
					e.y = Math.random() * projectHeight;

					return e
				})
				var path = shape(data);
				var el = document.querySelectorAll('#comments-viz path')[j];
				el.setAttribute('d',path);
			}
		}
	},4000)
}

// Project 1
function initProjectVangaal(){
	var circles = [];
	var tries = 0;
	var projectContainer = document.querySelector('#project-vangaal');
	var oldGamma = 0;
	var amount = isMobile ? 40 : 200

	while(circles.length < amount){
		var circle = {
			xPos : Math.random() * windowWidth,
			yPos : Math.random() * projectHeight,
			rad : (Math.random() * 100) + 10
		}

		var isOverlapping = false;

		for(i=0;i<circles.length; i++){
			var otherCircle = circles[i];
			var a = otherCircle.xPos - circle.xPos;
			var b = otherCircle.yPos - circle.yPos;

			var dist = Math.sqrt( a*a + b*b );
			if(dist < otherCircle.rad + circle.rad){
				isOverlapping = true;
			}
		}
		if(!isOverlapping){
			circles.push(circle);
		}else{
			tries++;
		}

		if(tries > 10000){
			break;
		}
	}	

	circles.forEach(function(c){
		var cEl = document.createElement('div');
		cEl.className = "circle";
		cEl.style.left = c.xPos - c.rad + "px";
		cEl.style.top = c.yPos -c.rad + "px";
		cEl.style.width = c.rad*2 + "px";
		cEl.style.height = c.rad*2 + "px";

		projectContainer.appendChild(cEl)
	})

	var deg = 0;
	var circleEls = projectContainer.querySelectorAll('.circle');

	if(!isMobile){
		projectContainer.addEventListener('mousemove',function(e){
			deg += 3;
			for(var i =0; i<circleEls.length; i++){
				circleEls[i].style.transform = 'rotate(' + (deg + (i*5)) + 'deg) translateZ(0)';
			}
		})
	}else{
		var orientationData = new FULLTILT.DeviceOrientation();
		orientationData.start(function(e){
			var offsetTop = projectContainer.getBoundingClientRect().top;

			if(offsetTop > -projectHeight && offsetTop < windowHeight){
				var rotation = orientationData.getScreenAdjustedQuaternion().y;
				var transf = rotation * 180;

				for(var i =0; i<circleEls.length; i++){
					circleEls[i].style.transform = 'rotate(' + (transf + i*4) + 'deg)';
				}
			}
		})
	}
	
}



// Refugee challenge
function initProjectRefugees(){
	var canvas = document.querySelector('.draw-container');
	var counter = 0;
	var startDot = document.querySelector('.startDot');
	var routes = [];
	var el = document.querySelector('#project-refugees');

	canvas.width = windowWidth;
	canvas.height = projectHeight;
	if(projectHeight === 660){
		startDot.style.left = windowWidth-220 + "px";
	}else{
		startDot.style.left = windowWidth-150 + "px";
	}
	
	startDot.style.top = projectHeight-80 + "px";
	
	function getRandomInt(min, max) {
	  return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	var elOffset = canvas.getBoundingClientRect().top;
	var ctx = canvas.getContext('2d');

	ctx.lineJoin = ctx.lineCap = 'round';

	var isDrawing, points = [];

	if(isMobile){
		var elOffset = canvas.getBoundingClientRect().top;
		var startX = Number(startDot.style.left.replace('px','')) + 5;
		var startY = Number(startDot.style.top.replace('px','')) + 5;
		startDot.classList.remove('animating')

		routes.push([]);
		points = routes[routes.length-1];
		isDrawing = true;

	  	points.push({ 
	    	x: startX,
	    	y: startY,
	    	width: getRandomInt(1, 3)
	  	});

	  	setInterval(function(){
	  		var offsetTop = document.querySelector('#project-refugees').getBoundingClientRect().top;

			if(offsetTop > -projectHeight && offsetTop < windowHeight+projectHeight){
		  		points.push({ 
			    	x: points[points.length - 1].x + ((Math.random() * 30) - 20), 
			    	y: points[points.length - 1].y + ((Math.random() * 30) - 20),
			    	width: getRandomInt(1, 3)
			  	})

			  	for (var i = 1; i < points.length; i++) {
				    ctx.beginPath();
				    ctx.moveTo(points[i-1].x, points[i-1].y);
				    ctx.lineWidth = points[i].width;
				    ctx.lineTo(points[i].x, points[i].y );
				    ctx.strokeStyle = 'rgba(247,166,58,0.05)';
				    ctx.stroke();
				}
				if(points.length > 50){
					ctx.clearRect(0,0,windowWidth,windowHeight);
					points = [points[0]];
					
				}
			}
	  	},500)

	}

	el.onmousedown = function(e) {
		elOffset = canvas.getBoundingClientRect().top;
		var startX = Number(startDot.style.left.replace('px',''));
		var startY = Number(startDot.style.top.replace('px',''));

		if(e.clientX > startX && e.clientX < startX + 20 && e.clientY - elOffset > startY && e.clientY - elOffset < startY + 20){
			startDot.classList.remove('animating')

			routes.push([]);
			points = routes[routes.length-1];
			isDrawing = true;

		  	points.push({ 
		    	x: e.clientX, 
		    	y: e.clientY,
		    	width: getRandomInt(3, 5)
		  	});
		}
	};

	el.onmousemove = function(e) {
	  if (!isDrawing) return;

	  counter++;
	  
	  if(counter%2===0){
	  	points.push({ 
		    x: e.clientX, 
		    y: e.clientY,
		    width: getRandomInt(2, 4)
		  });
	  }
	  
	  for (var i = 1; i < points.length; i++) {
	    ctx.beginPath();
	    ctx.moveTo(points[i-1].x, points[i-1].y - elOffset);
	    ctx.lineWidth = points[i].width;
	    ctx.lineTo(points[i].x, points[i].y - elOffset);
	    ctx.strokeStyle = 'rgba(247,166,58,0.05)';
	    ctx.stroke();
	  }
	};

	el.onmouseup = function() {
		if(!isDrawing){return false}
			var endDot = document.createElement('div');
			endDot.className = "endDot";
			endDot.style.left = points[points.length-1].x - 10 + "px";
			endDot.style.top = points[points.length-1].y - elOffset -10 + "px";
			isDrawing = false;
			document.querySelector('#project-refugees').appendChild(endDot);
	};
}




function initProjectEuro2016(){
	var canvas = document.querySelector('#project-euro2016 .draw-container');
	var counter = 0;
	var routes = [];
	var el = document.querySelector('#project-euro2016');
	var shapes = [
		[{"x":743,"y":406,"width":1},{"x":741,"y":406,"width":1.1},{"x":737,"y":408,"width":3.1},{"x":732,"y":410,"width":0.1},{"x":725,"y":413,"width":3.1},{"x":721,"y":417,"width":1.1},{"x":718,"y":420,"width":3.1},{"x":714,"y":426,"width":1.1},{"x":711,"y":430,"width":3.1},{"x":710,"y":435,"width":0.1},{"x":709,"y":440,"width":1.1},{"x":709,"y":445,"width":2.1},{"x":709,"y":450,"width":0.1},{"x":709,"y":454,"width":0.1},{"x":709,"y":457,"width":1.1},{"x":710,"y":460,"width":2.1},{"x":712,"y":463,"width":1.1},{"x":716,"y":466,"width":3.1},{"x":719,"y":468,"width":1.1},{"x":723,"y":470,"width":0.1},{"x":727,"y":472,"width":2.1},{"x":732,"y":474,"width":0.1},{"x":736,"y":474,"width":2.1},{"x":741,"y":475,"width":2.1},{"x":745,"y":475,"width":1.1},{"x":750,"y":475,"width":2.1},{"x":755,"y":474,"width":0.1},{"x":758,"y":471,"width":1.1},{"x":763,"y":466,"width":0.1},{"x":767,"y":462,"width":0.1},{"x":772,"y":457,"width":0.1},{"x":774,"y":450,"width":2.1},{"x":776,"y":446,"width":1.1},{"x":776,"y":442,"width":0.1},{"x":777,"y":437,"width":1.1},{"x":777,"y":433,"width":1.1},{"x":777,"y":430,"width":3.1},{"x":777,"y":425,"width":0.1},{"x":775,"y":421,"width":1.1},{"x":773,"y":418,"width":1.1},{"x":771,"y":415,"width":0.1},{"x":767,"y":413,"width":0.1},{"x":765,"y":411,"width":2.1},{"x":762,"y":409,"width":3.1},{"x":760,"y":408,"width":3.1},{"x":759,"y":406,"width":2.1},{"x":758,"y":406,"width":3.1},{"x":756,"y":406,"width":2.1},{"x":754,"y":406,"width":1.1},{"x":751,"y":406,"width":1.1},{"x":747,"y":406,"width":2.1},{"x":743,"y":406,"width":0.1},{"x":740,"y":406,"width":0.1},{"x":736,"y":406,"width":3.1},{"x":732,"y":406,"width":3.1},{"x":729,"y":405,"width":1.1},{"x":725,"y":405,"width":2.1},{"x":722,"y":405,"width":0.1},{"x":721,"y":405,"width":1.1},{"x":720,"y":405,"width":0.1},{"x":719,"y":405,"width":2.1}],
		[{"x":788,"y":512,"width":1},{"x":786,"y":512,"width":2.1},{"x":778,"y":512,"width":0.1},{"x":767,"y":514,"width":2.1},{"x":750,"y":519,"width":1.1},{"x":731,"y":524,"width":2.1},{"x":720,"y":528,"width":1.1},{"x":708,"y":533,"width":3.1},{"x":700,"y":537,"width":2.1},{"x":695,"y":541,"width":0.1},{"x":692,"y":544,"width":2.1},{"x":690,"y":547,"width":1.1},{"x":689,"y":550,"width":2.1},{"x":688,"y":553,"width":2.1},{"x":688,"y":556,"width":1.1},{"x":688,"y":561,"width":1.1},{"x":688,"y":569,"width":1.1},{"x":688,"y":578,"width":0.1},{"x":688,"y":588,"width":3.1},{"x":691,"y":597,"width":0.1},{"x":694,"y":607,"width":2.1},{"x":696,"y":614,"width":1.1},{"x":697,"y":620,"width":1.1},{"x":700,"y":625,"width":2.1},{"x":702,"y":631,"width":2.1},{"x":705,"y":636,"width":1.1},{"x":709,"y":641,"width":0.1},{"x":715,"y":646,"width":1.1},{"x":721,"y":652,"width":2.1},{"x":726,"y":656,"width":1.1},{"x":730,"y":660,"width":2.1},{"x":736,"y":663,"width":1.1},{"x":743,"y":666,"width":1.1},{"x":751,"y":668,"width":1.1},{"x":762,"y":669,"width":3.1},{"x":774,"y":669,"width":1.1},{"x":787,"y":669,"width":1.1},{"x":798,"y":664,"width":3.1},{"x":810,"y":657,"width":0.1},{"x":819,"y":650,"width":2.1},{"x":828,"y":642,"width":2.1},{"x":835,"y":635,"width":1.1},{"x":843,"y":627,"width":3.1},{"x":850,"y":617,"width":2.1},{"x":855,"y":609,"width":0.1},{"x":859,"y":598,"width":1.1},{"x":861,"y":588,"width":1.1},{"x":861,"y":578,"width":2.1},{"x":861,"y":569,"width":3.1},{"x":861,"y":563,"width":1.1},{"x":860,"y":556,"width":2.1},{"x":854,"y":546,"width":1.1},{"x":844,"y":538,"width":0.1},{"x":836,"y":532,"width":0.1},{"x":824,"y":523,"width":3.1},{"x":814,"y":517,"width":1.1},{"x":806,"y":513,"width":2.1},{"x":798,"y":510,"width":0.1},{"x":791,"y":509,"width":1.1},{"x":782,"y":507,"width":2.1},{"x":777,"y":507,"width":2.1},{"x":769,"y":506,"width":1.1},{"x":764,"y":506,"width":0.1},{"x":759,"y":506,"width":1.1},{"x":752,"y":506,"width":2.1},{"x":749,"y":506,"width":0.1},{"x":742,"y":506,"width":3.1},{"x":739,"y":509,"width":0.1},{"x":736,"y":511,"width":0.1},{"x":732,"y":513,"width":0.1},{"x":727,"y":516,"width":2.1},{"x":724,"y":519,"width":0.1},{"x":721,"y":523,"width":0.1},{"x":718,"y":527,"width":0.1},{"x":716,"y":531,"width":0.1},{"x":715,"y":536,"width":3.1},{"x":713,"y":542,"width":3.1},{"x":712,"y":550,"width":2.1},{"x":712,"y":559,"width":1.1},{"x":712,"y":566,"width":2.1},{"x":712,"y":575,"width":3.1},{"x":712,"y":581,"width":3.1},{"x":712,"y":585,"width":1.1},{"x":712,"y":588,"width":0.1},{"x":712,"y":591,"width":0.1},{"x":712,"y":596,"width":2.1},{"x":712,"y":600,"width":2.1},{"x":713,"y":607,"width":3.1},{"x":714,"y":611,"width":1.1},{"x":716,"y":616,"width":2.1},{"x":719,"y":621,"width":3.1},{"x":723,"y":625,"width":1.1},{"x":727,"y":629,"width":3.1},{"x":733,"y":635,"width":3.1},{"x":738,"y":639,"width":2.1},{"x":745,"y":644,"width":0.1},{"x":751,"y":648,"width":3.1},{"x":756,"y":651,"width":0.1},{"x":763,"y":653,"width":0.1},{"x":770,"y":656,"width":3.1},{"x":779,"y":657,"width":0.1},{"x":786,"y":659,"width":1.1},{"x":791,"y":659,"width":3.1},{"x":799,"y":661,"width":3.1},{"x":805,"y":662,"width":0.1},{"x":813,"y":662,"width":3.1},{"x":823,"y":662,"width":1.1},{"x":831,"y":661,"width":1.1},{"x":837,"y":659,"width":0.1},{"x":841,"y":657,"width":0.1},{"x":843,"y":653,"width":0.1},{"x":847,"y":650,"width":1.1},{"x":848,"y":646,"width":2.1},{"x":851,"y":638,"width":0.1},{"x":853,"y":628,"width":3.1},{"x":855,"y":618,"width":0.1},{"x":856,"y":608,"width":0.1},{"x":856,"y":600,"width":1.1},{"x":856,"y":593,"width":1.1},{"x":855,"y":584,"width":2.1},{"x":853,"y":578,"width":2.1},{"x":849,"y":571,"width":0.1},{"x":842,"y":562,"width":3.1},{"x":835,"y":554,"width":1.1},{"x":828,"y":547,"width":2.1},{"x":823,"y":543,"width":0.1},{"x":818,"y":538,"width":1.1},{"x":814,"y":535,"width":0.1},{"x":811,"y":533,"width":2.1},{"x":806,"y":531,"width":3.1},{"x":800,"y":529,"width":2.1},{"x":792,"y":528,"width":0.1},{"x":785,"y":526,"width":3.1},{"x":777,"y":525,"width":0.1},{"x":769,"y":524,"width":1.1},{"x":765,"y":524,"width":2.1},{"x":758,"y":524,"width":0.1},{"x":753,"y":524,"width":2.1},{"x":748,"y":524,"width":3.1},{"x":743,"y":524,"width":3.1},{"x":738,"y":526,"width":2.1},{"x":735,"y":529,"width":2.1},{"x":732,"y":534,"width":2.1},{"x":727,"y":541,"width":2.1},{"x":723,"y":548,"width":2.1},{"x":721,"y":558,"width":1.1},{"x":719,"y":566,"width":0.1},{"x":718,"y":574,"width":2.1},{"x":718,"y":584,"width":1.1},{"x":718,"y":592,"width":0.1},{"x":718,"y":601,"width":3.1},{"x":718,"y":607,"width":1.1},{"x":721,"y":616,"width":3.1},{"x":723,"y":621,"width":2.1},{"x":727,"y":627,"width":3.1},{"x":730,"y":633,"width":1.1},{"x":735,"y":640,"width":1.1},{"x":738,"y":644,"width":3.1},{"x":741,"y":648,"width":3.1},{"x":743,"y":651,"width":2.1},{"x":745,"y":653,"width":3.1},{"x":748,"y":655,"width":2.1},{"x":755,"y":656,"width":1.1},{"x":770,"y":656,"width":3.1},{"x":781,"y":656,"width":3.1},{"x":792,"y":656,"width":0.1},{"x":804,"y":656,"width":3.1},{"x":810,"y":656,"width":3.1},{"x":819,"y":653,"width":1.1},{"x":829,"y":651,"width":1.1},{"x":842,"y":646,"width":0.1},{"x":853,"y":641,"width":2.1},{"x":861,"y":634,"width":2.1},{"x":866,"y":629,"width":1.1},{"x":869,"y":624,"width":0.1},{"x":870,"y":616,"width":2.1},{"x":871,"y":608,"width":1.1},{"x":871,"y":602,"width":2.1},{"x":871,"y":592,"width":3.1},{"x":868,"y":582,"width":2.1},{"x":861,"y":568,"width":2.1},{"x":852,"y":559,"width":3.1},{"x":841,"y":547,"width":2.1},{"x":834,"y":541,"width":2.1},{"x":823,"y":535,"width":1.1},{"x":814,"y":529,"width":1.1},{"x":805,"y":526,"width":2.1},{"x":798,"y":522,"width":1.1},{"x":788,"y":520,"width":0.1},{"x":777,"y":517,"width":0.1},{"x":763,"y":514,"width":3.1},{"x":754,"y":512,"width":1.1},{"x":742,"y":509,"width":2.1},{"x":734,"y":507,"width":0.1},{"x":724,"y":507,"width":0.1},{"x":718,"y":507,"width":3.1},{"x":715,"y":507,"width":3.1},{"x":710,"y":510,"width":0.1},{"x":707,"y":514,"width":0.1},{"x":702,"y":520,"width":2.1},{"x":696,"y":528,"width":1.1},{"x":693,"y":537,"width":2.1},{"x":690,"y":543,"width":3.1},{"x":688,"y":546,"width":2.1}],
		[{"x":103,"y":423,"width":1},{"x":103,"y":422,"width":2.1},{"x":106,"y":420,"width":1.1},{"x":112,"y":416,"width":2.1},{"x":119,"y":412,"width":2.1},{"x":126,"y":408,"width":3.1},{"x":131,"y":405,"width":0.1},{"x":138,"y":401,"width":3.1},{"x":145,"y":395,"width":1.1},{"x":154,"y":389,"width":2.1},{"x":164,"y":382,"width":2.1},{"x":174,"y":376,"width":0.1},{"x":183,"y":370,"width":1.1},{"x":195,"y":363,"width":2.1},{"x":208,"y":355,"width":0.1},{"x":221,"y":348,"width":0.1},{"x":234,"y":339,"width":2.1},{"x":251,"y":330,"width":0.1},{"x":261,"y":324,"width":1.1},{"x":270,"y":317,"width":0.1},{"x":277,"y":312,"width":2.1},{"x":283,"y":309,"width":0.1},{"x":288,"y":305,"width":0.1},{"x":294,"y":302,"width":1.1},{"x":298,"y":299,"width":3.1},{"x":302,"y":297,"width":1.1},{"x":305,"y":296,"width":2.1},{"x":307,"y":294,"width":0.1},{"x":308,"y":293,"width":2.1},{"x":309,"y":293,"width":3.1},{"x":310,"y":292,"width":1.1},{"x":311,"y":292,"width":1.1},{"x":312,"y":291,"width":0.1},{"x":313,"y":291,"width":0.1},{"x":313,"y":290,"width":1.1},{"x":314,"y":290,"width":2.1},{"x":315,"y":290,"width":1.1},{"x":315,"y":289,"width":2.1},{"x":314,"y":289,"width":3.1},{"x":311,"y":289,"width":0.1},{"x":306,"y":289,"width":1.1},{"x":297,"y":290,"width":0.1},{"x":289,"y":292,"width":1.1},{"x":281,"y":293,"width":0.1},{"x":274,"y":295,"width":0.1},{"x":268,"y":295,"width":0.1},{"x":262,"y":295,"width":3.1},{"x":258,"y":295,"width":0.1},{"x":254,"y":295,"width":3.1},{"x":251,"y":295,"width":3.1},{"x":247,"y":295,"width":2.1},{"x":244,"y":295,"width":0.1},{"x":242,"y":295,"width":1.1},{"x":240,"y":295,"width":2.1},{"x":239,"y":295,"width":3.1},{"x":238,"y":295,"width":2.1},{"x":239,"y":295,"width":0.1},{"x":241,"y":295,"width":2.1},{"x":247,"y":295,"width":1.1},{"x":253,"y":295,"width":2.1},{"x":260,"y":295,"width":1.1},{"x":270,"y":295,"width":1.1},{"x":278,"y":295,"width":3.1},{"x":284,"y":295,"width":0.1},{"x":292,"y":295,"width":2.1},{"x":296,"y":295,"width":0.1},{"x":298,"y":295,"width":2.1},{"x":302,"y":295,"width":3.1},{"x":305,"y":295,"width":2.1},{"x":309,"y":295,"width":1.1},{"x":312,"y":295,"width":1.1},{"x":315,"y":295,"width":2.1},{"x":316,"y":295,"width":2.1},{"x":317,"y":295,"width":1.1},{"x":318,"y":295,"width":2.1},{"x":317,"y":295,"width":1.1},{"x":316,"y":295,"width":0.1},{"x":315,"y":295,"width":0.1},{"x":313,"y":297,"width":2.1},{"x":310,"y":300,"width":0.1},{"x":307,"y":305,"width":1.1},{"x":303,"y":311,"width":3.1},{"x":299,"y":317,"width":0.1},{"x":295,"y":321,"width":2.1},{"x":293,"y":325,"width":3.1},{"x":291,"y":327,"width":0.1},{"x":290,"y":329,"width":0.1},{"x":288,"y":332,"width":1.1},{"x":286,"y":336,"width":3.1},{"x":284,"y":339,"width":3.1},{"x":281,"y":342,"width":0.1},{"x":281,"y":343,"width":0.1},{"x":280,"y":345,"width":2.1},{"x":279,"y":345,"width":3.1},{"x":279,"y":346,"width":3.1},{"x":279,"y":345,"width":1.1},{"x":279,"y":343,"width":0.1},{"x":280,"y":339,"width":3.1},{"x":282,"y":334,"width":2.1},{"x":284,"y":329,"width":1.1},{"x":287,"y":322,"width":3.1},{"x":290,"y":315,"width":2.1},{"x":293,"y":307,"width":3.1},{"x":297,"y":298,"width":3.1},{"x":300,"y":293,"width":3.1},{"x":303,"y":288,"width":0.1},{"x":304,"y":284,"width":0.1},{"x":306,"y":281,"width":3.1},{"x":308,"y":279,"width":1.1},{"x":308,"y":277,"width":3.1},{"x":309,"y":276,"width":0.1},{"x":309,"y":275,"width":3.1},{"x":310,"y":275,"width":3.1},{"x":310,"y":274,"width":2.1},{"x":310,"y":275,"width":2.1},{"x":310,"y":277,"width":3.1},{"x":310,"y":281,"width":3.1},{"x":310,"y":284,"width":2.1},{"x":309,"y":288,"width":1.1},{"x":306,"y":291,"width":2.1},{"x":305,"y":295,"width":2.1},{"x":303,"y":298,"width":1.1},{"x":301,"y":303,"width":2.1},{"x":299,"y":307,"width":0.1},{"x":297,"y":309,"width":2.1},{"x":294,"y":315,"width":1.1},{"x":292,"y":319,"width":2.1},{"x":289,"y":324,"width":1.1},{"x":287,"y":327,"width":2.1},{"x":285,"y":329,"width":1.1},{"x":283,"y":332,"width":0.1},{"x":281,"y":334,"width":2.1},{"x":281,"y":335,"width":0.1},{"x":280,"y":335,"width":1.1},{"x":280,"y":334,"width":3.1}],
		[{"x":1149,"y":756,"width":1},{"x":1149,"y":756,"width":1.1},{"x":1149,"y":760,"width":3.1},{"x":1149,"y":762,"width":0.1},{"x":1149,"y":763,"width":0.1},{"x":1148,"y":765,"width":0.1},{"x":1146,"y":767,"width":3.1},{"x":1144,"y":770,"width":0.1},{"x":1141,"y":773,"width":2.1},{"x":1137,"y":778,"width":0.1},{"x":1133,"y":784,"width":1.1},{"x":1129,"y":789,"width":0.1},{"x":1126,"y":792,"width":3.1},{"x":1123,"y":796,"width":1.1},{"x":1120,"y":800,"width":2.1},{"x":1117,"y":805,"width":2.1},{"x":1114,"y":808,"width":1.1},{"x":1107,"y":812,"width":1.1},{"x":1101,"y":816,"width":0.1},{"x":1097,"y":819,"width":0.1},{"x":1091,"y":824,"width":3.1},{"x":1086,"y":828,"width":2.1},{"x":1082,"y":833,"width":0.1},{"x":1077,"y":837,"width":1.1},{"x":1072,"y":842,"width":1.1},{"x":1068,"y":845,"width":0.1},{"x":1063,"y":848,"width":0.1},{"x":1058,"y":851,"width":2.1},{"x":1053,"y":852,"width":0.1},{"x":1047,"y":854,"width":0.1},{"x":1041,"y":857,"width":0.1},{"x":1035,"y":859,"width":3.1},{"x":1029,"y":859,"width":0.1},{"x":1024,"y":860,"width":0.1},{"x":1021,"y":861,"width":0.1},{"x":1016,"y":862,"width":1.1},{"x":1013,"y":862,"width":0.1},{"x":1010,"y":862,"width":1.1},{"x":1009,"y":862,"width":2.1},{"x":1008,"y":862,"width":3.1},{"x":1007,"y":862,"width":3.1},{"x":1008,"y":862,"width":1.1},{"x":1008,"y":861,"width":2.1},{"x":1009,"y":861,"width":1.1},{"x":1010,"y":861,"width":1.1},{"x":1010,"y":860,"width":3.1},{"x":1012,"y":859,"width":1.1},{"x":1014,"y":857,"width":1.1},{"x":1017,"y":854,"width":2.1},{"x":1020,"y":850,"width":1.1},{"x":1023,"y":845,"width":2.1},{"x":1025,"y":841,"width":1.1},{"x":1027,"y":836,"width":1.1},{"x":1028,"y":832,"width":0.1},{"x":1030,"y":827,"width":1.1},{"x":1032,"y":825,"width":3.1},{"x":1034,"y":820,"width":2.1},{"x":1035,"y":817,"width":1.1},{"x":1036,"y":815,"width":1.1},{"x":1037,"y":814,"width":2.1},{"x":1038,"y":814,"width":2.1},{"x":1038,"y":815,"width":2.1},{"x":1036,"y":818,"width":2.1},{"x":1033,"y":824,"width":0.1},{"x":1029,"y":831,"width":1.1},{"x":1025,"y":838,"width":2.1},{"x":1022,"y":842,"width":2.1},{"x":1019,"y":848,"width":2.1},{"x":1016,"y":851,"width":2.1},{"x":1014,"y":852,"width":1.1},{"x":1013,"y":854,"width":0.1},{"x":1011,"y":855,"width":1.1},{"x":1010,"y":856,"width":3.1},{"x":1009,"y":856,"width":0.1},{"x":1008,"y":857,"width":1.1},{"x":1008,"y":858,"width":1.1},{"x":1007,"y":859,"width":1.1},{"x":1006,"y":860,"width":3.1},{"x":1006,"y":860,"width":2.1},{"x":1006,"y":861,"width":3.1},{"x":1007,"y":861,"width":2.1},{"x":1008,"y":861,"width":1.1},{"x":1010,"y":861,"width":2.1},{"x":1012,"y":862,"width":1.1},{"x":1014,"y":864,"width":3.1},{"x":1018,"y":867,"width":0.1},{"x":1020,"y":868,"width":1.1},{"x":1022,"y":870,"width":1.1},{"x":1025,"y":871,"width":1.1},{"x":1026,"y":873,"width":2.1},{"x":1027,"y":873,"width":2.1},{"x":1029,"y":875,"width":0.1},{"x":1031,"y":876,"width":1.1},{"x":1032,"y":877,"width":0.1},{"x":1034,"y":878,"width":2.1},{"x":1037,"y":878,"width":0.1},{"x":1039,"y":880,"width":2.1},{"x":1040,"y":881,"width":3.1},{"x":1041,"y":882,"width":1.1},{"x":1043,"y":882,"width":2.1},{"x":1043,"y":883,"width":0.1},{"x":1044,"y":883,"width":2.1},{"x":1045,"y":883,"width":1.1},{"x":1045,"y":884,"width":2.1},{"x":1046,"y":884,"width":0.1},{"x":1047,"y":885,"width":2.1},{"x":1048,"y":885,"width":1.1},{"x":1048,"y":886,"width":2.1},{"x":1050,"y":886,"width":2.1},{"x":1051,"y":887,"width":2.1},{"x":1051,"y":887,"width":1.1},{"x":1051,"y":888,"width":1.1},{"x":1052,"y":888,"width":0.1},{"x":1053,"y":888,"width":1.1},{"x":1054,"y":889,"width":3.1},{"x":1055,"y":890,"width":2.1},{"x":1056,"y":891,"width":0.1},{"x":1057,"y":892,"width":2.1},{"x":1058,"y":892,"width":3.1}],
		[{"x":1011,"y":400,"width":1},{"x":1011,"y":398,"width":0.1},{"x":1016,"y":393,"width":0.1},{"x":1023,"y":386,"width":0.1},{"x":1030,"y":380,"width":0.1},{"x":1036,"y":375,"width":3.1},{"x":1041,"y":369,"width":2.1},{"x":1045,"y":365,"width":0.1},{"x":1049,"y":362,"width":0.1},{"x":1051,"y":361,"width":3.1},{"x":1052,"y":360,"width":3.1},{"x":1053,"y":359,"width":3.1},{"x":1054,"y":359,"width":3.1},{"x":1054,"y":358,"width":2.1},{"x":1053,"y":359,"width":3.1},{"x":1049,"y":363,"width":3.1},{"x":1044,"y":369,"width":2.1},{"x":1038,"y":375,"width":2.1},{"x":1035,"y":380,"width":3.1},{"x":1031,"y":384,"width":1.1},{"x":1028,"y":386,"width":2.1},{"x":1026,"y":388,"width":3.1},{"x":1025,"y":389,"width":2.1},{"x":1025,"y":389,"width":2.1},{"x":1026,"y":389,"width":0.1},{"x":1026,"y":389,"width":1.1},{"x":1027,"y":389,"width":1.1},{"x":1030,"y":389,"width":1.1},{"x":1035,"y":391,"width":3.1},{"x":1041,"y":393,"width":1.1},{"x":1045,"y":394,"width":1.1},{"x":1048,"y":395,"width":1.1},{"x":1049,"y":395,"width":3.1},{"x":1050,"y":395,"width":2.1},{"x":1050,"y":396,"width":2.1},{"x":1049,"y":396,"width":0.1},{"x":1047,"y":394,"width":0.1},{"x":1043,"y":392,"width":2.1},{"x":1040,"y":389,"width":3.1},{"x":1037,"y":388,"width":3.1},{"x":1034,"y":385,"width":1.1},{"x":1031,"y":383,"width":2.1},{"x":1029,"y":381,"width":3.1},{"x":1027,"y":379,"width":2.1},{"x":1025,"y":376,"width":3.1},{"x":1023,"y":374,"width":3.1},{"x":1021,"y":372,"width":2.1},{"x":1020,"y":371,"width":2.1},{"x":1019,"y":369,"width":1.1},{"x":1018,"y":368,"width":1.1},{"x":1017,"y":367,"width":2.1},{"x":1015,"y":365,"width":2.1},{"x":1013,"y":363,"width":0.1},{"x":1011,"y":361,"width":3.1},{"x":1010,"y":360,"width":3.1},{"x":1009,"y":359,"width":2.1},{"x":1009,"y":358,"width":3.1},{"x":1009,"y":359,"width":0.1},{"x":1009,"y":360,"width":3.1},{"x":1012,"y":363,"width":1.1},{"x":1015,"y":366,"width":3.1},{"x":1018,"y":369,"width":1.1},{"x":1020,"y":371,"width":1.1},{"x":1022,"y":373,"width":2.1},{"x":1023,"y":374,"width":1.1},{"x":1024,"y":376,"width":1.1},{"x":1026,"y":378,"width":3.1},{"x":1028,"y":380,"width":0.1},{"x":1030,"y":382,"width":1.1},{"x":1031,"y":383,"width":0.1},{"x":1033,"y":384,"width":3.1},{"x":1034,"y":385,"width":0.1},{"x":1035,"y":386,"width":3.1},{"x":1036,"y":387,"width":2.1},{"x":1037,"y":387,"width":3.1},{"x":1037,"y":388,"width":3.1},{"x":1038,"y":388,"width":1.1},{"x":1038,"y":389,"width":0.1},{"x":1039,"y":389,"width":0.1},{"x":1039,"y":390,"width":3.1},{"x":1040,"y":390,"width":3.1},{"x":1040,"y":391,"width":0.1},{"x":1041,"y":392,"width":1.1},{"x":1042,"y":393,"width":2.1},{"x":1043,"y":394,"width":1.1},{"x":1044,"y":395,"width":2.1},{"x":1045,"y":396,"width":0.1},{"x":1045,"y":397,"width":2.1},{"x":1046,"y":397,"width":2.1},{"x":1046,"y":398,"width":0.1},{"x":1047,"y":398,"width":3.1},{"x":1047,"y":399,"width":1.1},{"x":1048,"y":399,"width":3.1},{"x":1048,"y":398,"width":1.1},{"x":1046,"y":396,"width":2.1},{"x":1042,"y":394,"width":1.1},{"x":1037,"y":392,"width":1.1},{"x":1034,"y":389,"width":3.1},{"x":1031,"y":386,"width":2.1},{"x":1028,"y":384,"width":1.1},{"x":1026,"y":382,"width":1.1},{"x":1024,"y":380,"width":2.1},{"x":1021,"y":378,"width":3.1},{"x":1019,"y":376,"width":0.1},{"x":1015,"y":373,"width":2.1},{"x":1013,"y":371,"width":2.1},{"x":1011,"y":369,"width":1.1},{"x":1010,"y":368,"width":0.1},{"x":1009,"y":366,"width":0.1},{"x":1008,"y":365,"width":2.1},{"x":1006,"y":364,"width":0.1},{"x":1006,"y":363,"width":3.1},{"x":1005,"y":362,"width":2.1},{"x":1005,"y":362,"width":3.1},{"x":1005,"y":362,"width":3.1},{"x":1008,"y":364,"width":3.1},{"x":1010,"y":366,"width":1.1},{"x":1014,"y":369,"width":0.1},{"x":1016,"y":371,"width":0.1},{"x":1020,"y":374,"width":1.1},{"x":1023,"y":376,"width":3.1},{"x":1028,"y":379,"width":0.1},{"x":1031,"y":382,"width":2.1},{"x":1035,"y":386,"width":1.1},{"x":1037,"y":388,"width":1.1},{"x":1040,"y":391,"width":3.1},{"x":1044,"y":393,"width":2.1},{"x":1046,"y":395,"width":1.1},{"x":1048,"y":397,"width":1.1},{"x":1051,"y":398,"width":1.1},{"x":1052,"y":399,"width":0.1},{"x":1053,"y":400,"width":0.1}],
		[{"x":551,"y":325,"width":1},{"x":552,"y":324,"width":2.1},{"x":553,"y":323,"width":1.1},{"x":555,"y":321,"width":0.1},{"x":557,"y":319,"width":3.1},{"x":559,"y":318,"width":3.1},{"x":561,"y":316,"width":1.1},{"x":562,"y":315,"width":0.1},{"x":565,"y":313,"width":0.1},{"x":567,"y":312,"width":2.1},{"x":569,"y":309,"width":3.1},{"x":572,"y":308,"width":0.1},{"x":575,"y":306,"width":2.1},{"x":577,"y":303,"width":2.1},{"x":580,"y":302,"width":0.1},{"x":582,"y":302,"width":0.1},{"x":584,"y":301,"width":1.1},{"x":586,"y":299,"width":2.1},{"x":590,"y":299,"width":3.1},{"x":592,"y":297,"width":1.1},{"x":594,"y":297,"width":0.1},{"x":596,"y":295,"width":2.1},{"x":598,"y":294,"width":1.1},{"x":600,"y":294,"width":0.1},{"x":603,"y":294,"width":3.1},{"x":605,"y":294,"width":3.1},{"x":608,"y":294,"width":3.1},{"x":611,"y":293,"width":0.1},{"x":613,"y":293,"width":2.1},{"x":615,"y":293,"width":2.1},{"x":617,"y":293,"width":3.1},{"x":618,"y":293,"width":2.1},{"x":620,"y":293,"width":2.1},{"x":622,"y":293,"width":0.1},{"x":624,"y":293,"width":2.1},{"x":626,"y":293,"width":0.1},{"x":628,"y":293,"width":3.1},{"x":630,"y":293,"width":3.1},{"x":632,"y":293,"width":3.1},{"x":634,"y":293,"width":3.1},{"x":637,"y":293,"width":1.1},{"x":639,"y":293,"width":1.1},{"x":641,"y":294,"width":0.1},{"x":643,"y":294,"width":1.1},{"x":645,"y":295,"width":0.1},{"x":646,"y":295,"width":2.1},{"x":647,"y":296,"width":0.1},{"x":648,"y":297,"width":3.1},{"x":650,"y":297,"width":2.1},{"x":651,"y":298,"width":0.1},{"x":652,"y":299,"width":1.1},{"x":654,"y":299,"width":2.1},{"x":655,"y":300,"width":1.1},{"x":655,"y":300,"width":2.1},{"x":656,"y":300,"width":3.1},{"x":656,"y":301,"width":1.1},{"x":657,"y":301,"width":3.1},{"x":658,"y":302,"width":3.1},{"x":659,"y":302,"width":2.1},{"x":659,"y":303,"width":2.1},{"x":661,"y":304,"width":2.1},{"x":662,"y":304,"width":0.1},{"x":662,"y":305,"width":3.1},{"x":663,"y":305,"width":1.1},{"x":664,"y":305,"width":1.1},{"x":664,"y":306,"width":0.1},{"x":665,"y":306,"width":1.1},{"x":665,"y":307,"width":0.1},{"x":666,"y":307,"width":1.1},{"x":667,"y":308,"width":0.1},{"x":668,"y":309,"width":0.1},{"x":669,"y":309,"width":0.1},{"x":670,"y":310,"width":3.1},{"x":671,"y":311,"width":3.1},{"x":672,"y":311,"width":0.1},{"x":673,"y":312,"width":1.1},{"x":674,"y":313,"width":1.1},{"x":675,"y":313,"width":1.1},{"x":675,"y":314,"width":0.1},{"x":676,"y":314,"width":2.1},{"x":677,"y":314,"width":1.1},{"x":677,"y":315,"width":3.1},{"x":678,"y":315,"width":3.1},{"x":678,"y":316,"width":1.1},{"x":679,"y":316,"width":3.1},{"x":680,"y":317,"width":0.1},{"x":680,"y":317,"width":1.1},{"x":681,"y":318,"width":1.1},{"x":682,"y":318,"width":3.1},{"x":682,"y":318,"width":2.1},{"x":683,"y":318,"width":0.1},{"x":683,"y":317,"width":1.1},{"x":683,"y":317,"width":0.1},{"x":683,"y":316,"width":1.1},{"x":682,"y":315,"width":0.1},{"x":682,"y":314,"width":1.1},{"x":682,"y":313,"width":2.1},{"x":682,"y":312,"width":2.1},{"x":681,"y":310,"width":1.1},{"x":681,"y":307,"width":0.1},{"x":681,"y":305,"width":1.1},{"x":681,"y":302,"width":0.1},{"x":681,"y":300,"width":2.1},{"x":681,"y":298,"width":2.1},{"x":681,"y":297,"width":3.1},{"x":681,"y":296,"width":2.1},{"x":681,"y":295,"width":3.1},{"x":681,"y":293,"width":2.1},{"x":681,"y":292,"width":0.1},{"x":681,"y":291,"width":2.1},{"x":681,"y":290,"width":2.1},{"x":681,"y":289,"width":1.1},{"x":681,"y":290,"width":1.1},{"x":681,"y":292,"width":0.1},{"x":681,"y":294,"width":1.1},{"x":681,"y":298,"width":1.1},{"x":681,"y":300,"width":1.1},{"x":681,"y":303,"width":2.1},{"x":681,"y":305,"width":1.1},{"x":681,"y":307,"width":1.1},{"x":680,"y":308,"width":2.1},{"x":680,"y":309,"width":0.1},{"x":680,"y":310,"width":2.1},{"x":680,"y":311,"width":1.1},{"x":679,"y":313,"width":2.1},{"x":679,"y":314,"width":3.1},{"x":679,"y":314,"width":0.1},{"x":679,"y":315,"width":3.1},{"x":679,"y":316,"width":1.1},{"x":679,"y":317,"width":3.1},{"x":679,"y":318,"width":0.1},{"x":679,"y":318,"width":3.1},{"x":678,"y":318,"width":1.1},{"x":677,"y":318,"width":0.1},{"x":676,"y":318,"width":1.1},{"x":675,"y":318,"width":1.1},{"x":674,"y":318,"width":1.1},{"x":671,"y":319,"width":2.1},{"x":668,"y":321,"width":0.1},{"x":665,"y":322,"width":2.1},{"x":662,"y":322,"width":1.1},{"x":659,"y":323,"width":0.1},{"x":656,"y":323,"width":0.1},{"x":655,"y":323,"width":3.1},{"x":653,"y":324,"width":1.1},{"x":652,"y":324,"width":0.1},{"x":650,"y":324,"width":3.1},{"x":649,"y":325,"width":2.1},{"x":648,"y":325,"width":0.1},{"x":649,"y":325,"width":2.1},{"x":650,"y":325,"width":1.1},{"x":651,"y":325,"width":0.1},{"x":652,"y":325,"width":2.1},{"x":653,"y":325,"width":0.1},{"x":654,"y":325,"width":2.1},{"x":655,"y":324,"width":0.1},{"x":657,"y":324,"width":1.1},{"x":658,"y":324,"width":0.1},{"x":660,"y":324,"width":0.1},{"x":662,"y":324,"width":0.1},{"x":663,"y":324,"width":3.1},{"x":664,"y":323,"width":3.1},{"x":666,"y":323,"width":2.1},{"x":667,"y":323,"width":0.1},{"x":668,"y":322,"width":1.1},{"x":670,"y":322,"width":3.1},{"x":671,"y":321,"width":1.1},{"x":672,"y":321,"width":1.1},{"x":674,"y":321,"width":0.1},{"x":675,"y":320,"width":2.1},{"x":676,"y":320,"width":2.1},{"x":677,"y":320,"width":2.1},{"x":678,"y":320,"width":2.1},{"x":679,"y":319,"width":3.1},{"x":680,"y":319,"width":1.1},{"x":681,"y":319,"width":2.1}],
		[{"x":108,"y":170,"width":1},{"x":107,"y":170,"width":3.1},{"x":105,"y":170,"width":1.1},{"x":101,"y":171,"width":3.1},{"x":93,"y":173,"width":1.1},{"x":84,"y":178,"width":3.1},{"x":77,"y":182,"width":0.1},{"x":71,"y":186,"width":3.1},{"x":66,"y":189,"width":3.1},{"x":63,"y":192,"width":2.1},{"x":61,"y":196,"width":1.1},{"x":61,"y":200,"width":1.1},{"x":61,"y":203,"width":3.1},{"x":61,"y":207,"width":2.1},{"x":61,"y":211,"width":1.1},{"x":61,"y":215,"width":3.1},{"x":62,"y":221,"width":0.1},{"x":63,"y":223,"width":1.1},{"x":66,"y":226,"width":3.1},{"x":68,"y":228,"width":2.1},{"x":72,"y":230,"width":3.1},{"x":77,"y":231,"width":3.1},{"x":85,"y":231,"width":3.1},{"x":94,"y":231,"width":1.1},{"x":103,"y":229,"width":2.1},{"x":109,"y":226,"width":3.1},{"x":114,"y":223,"width":2.1},{"x":117,"y":221,"width":0.1},{"x":119,"y":217,"width":3.1},{"x":122,"y":214,"width":0.1},{"x":123,"y":211,"width":0.1},{"x":123,"y":208,"width":1.1},{"x":124,"y":203,"width":2.1},{"x":124,"y":197,"width":0.1},{"x":124,"y":192,"width":3.1},{"x":124,"y":187,"width":0.1},{"x":124,"y":182,"width":2.1},{"x":121,"y":176,"width":3.1},{"x":117,"y":172,"width":1.1},{"x":110,"y":167,"width":2.1},{"x":103,"y":163,"width":1.1},{"x":98,"y":160,"width":3.1},{"x":91,"y":158,"width":3.1},{"x":88,"y":157,"width":2.1},{"x":86,"y":156,"width":2.1},{"x":84,"y":156,"width":1.1},{"x":83,"y":156,"width":3.1},{"x":80,"y":157,"width":3.1},{"x":77,"y":162,"width":0.1},{"x":73,"y":169,"width":2.1},{"x":69,"y":176,"width":1.1},{"x":64,"y":184,"width":2.1},{"x":60,"y":193,"width":2.1},{"x":58,"y":198,"width":1.1},{"x":56,"y":203,"width":2.1},{"x":54,"y":207,"width":2.1},{"x":54,"y":209,"width":2.1},{"x":54,"y":212,"width":2.1},{"x":54,"y":214,"width":0.1},{"x":54,"y":218,"width":1.1},{"x":54,"y":223,"width":2.1},{"x":54,"y":228,"width":0.1},{"x":58,"y":232,"width":1.1},{"x":62,"y":238,"width":2.1},{"x":65,"y":241,"width":1.1},{"x":69,"y":243,"width":1.1},{"x":74,"y":245,"width":2.1},{"x":81,"y":246,"width":2.1},{"x":88,"y":246,"width":0.1},{"x":95,"y":245,"width":0.1},{"x":105,"y":242,"width":0.1},{"x":112,"y":237,"width":1.1},{"x":117,"y":233,"width":3.1},{"x":121,"y":229,"width":2.1},{"x":124,"y":226,"width":3.1},{"x":125,"y":223,"width":2.1},{"x":126,"y":216,"width":0.1},{"x":127,"y":211,"width":2.1},{"x":127,"y":204,"width":3.1},{"x":127,"y":198,"width":2.1},{"x":123,"y":189,"width":3.1},{"x":118,"y":181,"width":0.1},{"x":108,"y":174,"width":0.1},{"x":99,"y":168,"width":2.1},{"x":90,"y":163,"width":3.1},{"x":83,"y":160,"width":1.1},{"x":77,"y":160,"width":3.1},{"x":69,"y":160,"width":1.1}],
		[{"x":50,"y":655,"width":1},{"x":49,"y":655,"width":1.1},{"x":47,"y":655,"width":1.1},{"x":44,"y":658,"width":2.1},{"x":40,"y":661,"width":1.1},{"x":35,"y":668,"width":3.1},{"x":30,"y":674,"width":0.1},{"x":25,"y":679,"width":1.1},{"x":22,"y":684,"width":2.1},{"x":19,"y":691,"width":3.1},{"x":18,"y":696,"width":1.1},{"x":17,"y":702,"width":2.1},{"x":17,"y":708,"width":1.1},{"x":17,"y":713,"width":2.1},{"x":17,"y":717,"width":2.1},{"x":17,"y":719,"width":3.1},{"x":17,"y":721,"width":3.1},{"x":19,"y":724,"width":2.1},{"x":20,"y":726,"width":0.1},{"x":23,"y":728,"width":1.1},{"x":27,"y":731,"width":1.1},{"x":29,"y":733,"width":2.1},{"x":33,"y":736,"width":0.1},{"x":38,"y":739,"width":2.1},{"x":44,"y":740,"width":0.1},{"x":50,"y":742,"width":0.1},{"x":54,"y":743,"width":3.1},{"x":57,"y":743,"width":3.1},{"x":59,"y":743,"width":1.1},{"x":60,"y":743,"width":3.1},{"x":61,"y":743,"width":2.1},{"x":61,"y":742,"width":2.1},{"x":63,"y":738,"width":3.1},{"x":65,"y":733,"width":1.1},{"x":68,"y":727,"width":1.1},{"x":70,"y":719,"width":2.1},{"x":73,"y":712,"width":0.1},{"x":75,"y":706,"width":1.1},{"x":76,"y":702,"width":2.1},{"x":77,"y":696,"width":3.1},{"x":77,"y":693,"width":3.1},{"x":77,"y":689,"width":1.1},{"x":77,"y":685,"width":0.1},{"x":77,"y":681,"width":1.1},{"x":77,"y":676,"width":3.1},{"x":77,"y":671,"width":2.1},{"x":77,"y":667,"width":0.1},{"x":76,"y":664,"width":0.1},{"x":75,"y":661,"width":1.1},{"x":74,"y":658,"width":1.1},{"x":72,"y":655,"width":2.1},{"x":70,"y":653,"width":1.1},{"x":67,"y":652,"width":3.1},{"x":65,"y":650,"width":0.1},{"x":62,"y":649,"width":0.1},{"x":59,"y":649,"width":1.1},{"x":56,"y":649,"width":1.1},{"x":53,"y":649,"width":1.1},{"x":50,"y":649,"width":2.1},{"x":48,"y":649,"width":0.1},{"x":45,"y":650,"width":2.1},{"x":43,"y":651,"width":2.1},{"x":40,"y":654,"width":3.1},{"x":37,"y":657,"width":0.1},{"x":32,"y":660,"width":2.1},{"x":30,"y":663,"width":1.1},{"x":27,"y":665,"width":1.1},{"x":25,"y":667,"width":3.1},{"x":23,"y":669,"width":3.1},{"x":22,"y":671,"width":1.1},{"x":21,"y":673,"width":3.1},{"x":21,"y":676,"width":0.1},{"x":20,"y":679,"width":2.1},{"x":20,"y":684,"width":0.1},{"x":20,"y":687,"width":0.1},{"x":20,"y":694,"width":1.1},{"x":20,"y":699,"width":1.1},{"x":20,"y":704,"width":2.1},{"x":20,"y":709,"width":1.1},{"x":21,"y":713,"width":1.1},{"x":22,"y":715,"width":2.1},{"x":25,"y":718,"width":3.1},{"x":28,"y":721,"width":2.1},{"x":31,"y":724,"width":2.1},{"x":35,"y":727,"width":1.1},{"x":38,"y":729,"width":2.1},{"x":40,"y":732,"width":2.1},{"x":43,"y":734,"width":2.1},{"x":45,"y":735,"width":3.1},{"x":47,"y":736,"width":0.1},{"x":49,"y":737,"width":1.1},{"x":52,"y":738,"width":1.1},{"x":54,"y":739,"width":3.1},{"x":57,"y":739,"width":1.1},{"x":61,"y":739,"width":3.1},{"x":64,"y":739,"width":0.1},{"x":66,"y":739,"width":0.1},{"x":70,"y":737,"width":1.1},{"x":74,"y":733,"width":3.1},{"x":76,"y":729,"width":0.1},{"x":79,"y":724,"width":1.1},{"x":80,"y":720,"width":1.1},{"x":81,"y":716,"width":2.1},{"x":81,"y":709,"width":1.1},{"x":81,"y":702,"width":0.1},{"x":81,"y":694,"width":3.1},{"x":81,"y":686,"width":0.1},{"x":81,"y":680,"width":2.1},{"x":80,"y":674,"width":0.1},{"x":80,"y":669,"width":0.1},{"x":79,"y":666,"width":3.1},{"x":78,"y":663,"width":2.1},{"x":77,"y":661,"width":1.1},{"x":74,"y":658,"width":3.1},{"x":71,"y":655,"width":1.1},{"x":66,"y":651,"width":0.1},{"x":61,"y":647,"width":3.1},{"x":56,"y":643,"width":0.1},{"x":51,"y":639,"width":1.1},{"x":47,"y":637,"width":0.1},{"x":44,"y":636,"width":2.1},{"x":40,"y":635,"width":3.1},{"x":37,"y":635,"width":1.1},{"x":35,"y":635,"width":2.1},{"x":32,"y":637,"width":3.1},{"x":30,"y":638,"width":3.1}],
		[{"x":1455,"y":642,"width":1},{"x":1454,"y":642,"width":0.1},{"x":1449,"y":645,"width":2.1},{"x":1442,"y":650,"width":2.1},{"x":1437,"y":655,"width":1.1},{"x":1430,"y":664,"width":3.1},{"x":1426,"y":671,"width":1.1},{"x":1423,"y":682,"width":2.1},{"x":1422,"y":691,"width":2.1},{"x":1422,"y":699,"width":0.1},{"x":1422,"y":706,"width":3.1},{"x":1422,"y":713,"width":1.1},{"x":1424,"y":719,"width":1.1},{"x":1428,"y":726,"width":1.1},{"x":1435,"y":731,"width":0.1},{"x":1446,"y":734,"width":3.1},{"x":1463,"y":734,"width":1.1},{"x":1474,"y":733,"width":1.1},{"x":1485,"y":727,"width":3.1},{"x":1492,"y":723,"width":2.1},{"x":1497,"y":715,"width":1.1},{"x":1499,"y":705,"width":2.1},{"x":1499,"y":694,"width":3.1},{"x":1499,"y":683,"width":0.1},{"x":1499,"y":671,"width":2.1},{"x":1498,"y":663,"width":0.1},{"x":1496,"y":658,"width":1.1},{"x":1493,"y":653,"width":3.1},{"x":1488,"y":650,"width":3.1},{"x":1483,"y":648,"width":1.1},{"x":1476,"y":646,"width":3.1},{"x":1468,"y":646,"width":2.1},{"x":1458,"y":646,"width":1.1},{"x":1453,"y":646,"width":1.1},{"x":1444,"y":646,"width":1.1},{"x":1438,"y":646,"width":1.1},{"x":1432,"y":647,"width":1.1},{"x":1429,"y":649,"width":3.1},{"x":1427,"y":650,"width":0.1},{"x":1425,"y":651,"width":0.1}],
		[{"x":118,"y":316,"width":1},{"x":116,"y":316,"width":2.1},{"x":115,"y":316,"width":1.1},{"x":112,"y":317,"width":0.1},{"x":110,"y":320,"width":3.1},{"x":107,"y":324,"width":3.1},{"x":106,"y":327,"width":1.1},{"x":104,"y":331,"width":1.1},{"x":103,"y":336,"width":2.1},{"x":103,"y":340,"width":1.1},{"x":103,"y":343,"width":3.1},{"x":103,"y":346,"width":1.1},{"x":103,"y":348,"width":2.1},{"x":103,"y":349,"width":1.1},{"x":104,"y":349,"width":0.1},{"x":108,"y":350,"width":2.1},{"x":114,"y":350,"width":1.1},{"x":119,"y":350,"width":3.1},{"x":128,"y":350,"width":3.1},{"x":133,"y":350,"width":2.1},{"x":138,"y":348,"width":1.1},{"x":143,"y":345,"width":2.1},{"x":146,"y":342,"width":3.1},{"x":148,"y":340,"width":2.1},{"x":150,"y":336,"width":0.1},{"x":150,"y":334,"width":3.1},{"x":151,"y":331,"width":0.1},{"x":151,"y":329,"width":2.1},{"x":151,"y":326,"width":1.1},{"x":151,"y":324,"width":1.1},{"x":150,"y":322,"width":1.1},{"x":148,"y":320,"width":0.1},{"x":143,"y":316,"width":1.1},{"x":138,"y":314,"width":3.1},{"x":135,"y":312,"width":2.1},{"x":130,"y":311,"width":1.1},{"x":126,"y":310,"width":0.1},{"x":124,"y":310,"width":1.1},{"x":121,"y":310,"width":0.1},{"x":119,"y":310,"width":2.1},{"x":118,"y":310,"width":0.1},{"x":116,"y":312,"width":3.1},{"x":114,"y":316,"width":3.1},{"x":113,"y":321,"width":0.1},{"x":111,"y":325,"width":0.1},{"x":109,"y":330,"width":2.1},{"x":108,"y":333,"width":2.1},{"x":108,"y":338,"width":1.1},{"x":107,"y":344,"width":2.1},{"x":107,"y":348,"width":1.1},{"x":107,"y":352,"width":0.1},{"x":107,"y":354,"width":1.1},{"x":107,"y":356,"width":1.1},{"x":107,"y":357,"width":2.1},{"x":108,"y":358,"width":1.1},{"x":109,"y":359,"width":0.1},{"x":111,"y":359,"width":2.1},{"x":113,"y":359,"width":0.1},{"x":115,"y":359,"width":1.1},{"x":119,"y":359,"width":1.1},{"x":124,"y":356,"width":1.1},{"x":130,"y":352,"width":2.1},{"x":135,"y":347,"width":0.1},{"x":138,"y":344,"width":1.1},{"x":142,"y":341,"width":1.1},{"x":143,"y":340,"width":0.1},{"x":144,"y":337,"width":3.1},{"x":145,"y":336,"width":2.1},{"x":145,"y":333,"width":2.1},{"x":145,"y":332,"width":0.1},{"x":145,"y":330,"width":0.1},{"x":145,"y":327,"width":0.1},{"x":143,"y":324,"width":0.1},{"x":140,"y":321,"width":0.1},{"x":136,"y":317,"width":2.1},{"x":133,"y":314,"width":2.1},{"x":130,"y":313,"width":0.1},{"x":126,"y":311,"width":0.1},{"x":122,"y":311,"width":1.1},{"x":118,"y":311,"width":3.1},{"x":115,"y":311,"width":2.1}],
		[{"x":1934,"y":598,"width":1},{"x":1934,"y":600,"width":3.1},{"x":1932,"y":604,"width":3.1},{"x":1931,"y":609,"width":2.1},{"x":1929,"y":614,"width":1.1},{"x":1926,"y":619,"width":1.1},{"x":1922,"y":625,"width":0.1},{"x":1919,"y":630,"width":3.1},{"x":1916,"y":634,"width":2.1},{"x":1913,"y":639,"width":2.1},{"x":1910,"y":641,"width":1.1},{"x":1907,"y":644,"width":0.1},{"x":1904,"y":647,"width":2.1},{"x":1902,"y":649,"width":0.1},{"x":1900,"y":651,"width":3.1},{"x":1898,"y":653,"width":1.1},{"x":1895,"y":654,"width":0.1},{"x":1893,"y":656,"width":0.1},{"x":1891,"y":657,"width":0.1},{"x":1889,"y":659,"width":1.1},{"x":1886,"y":659,"width":1.1},{"x":1884,"y":660,"width":0.1},{"x":1881,"y":661,"width":1.1},{"x":1879,"y":662,"width":2.1},{"x":1876,"y":663,"width":3.1},{"x":1874,"y":664,"width":3.1},{"x":1871,"y":665,"width":0.1},{"x":1868,"y":666,"width":2.1},{"x":1865,"y":667,"width":2.1},{"x":1863,"y":667,"width":1.1},{"x":1861,"y":668,"width":3.1},{"x":1860,"y":669,"width":0.1},{"x":1858,"y":670,"width":1.1},{"x":1855,"y":670,"width":2.1},{"x":1852,"y":671,"width":3.1},{"x":1849,"y":672,"width":2.1},{"x":1846,"y":672,"width":1.1},{"x":1843,"y":673,"width":0.1},{"x":1840,"y":673,"width":2.1},{"x":1836,"y":674,"width":0.1},{"x":1831,"y":674,"width":1.1},{"x":1828,"y":675,"width":2.1},{"x":1826,"y":675,"width":3.1},{"x":1824,"y":675,"width":1.1},{"x":1823,"y":675,"width":0.1},{"x":1821,"y":675,"width":1.1},{"x":1819,"y":675,"width":2.1},{"x":1817,"y":675,"width":3.1},{"x":1814,"y":675,"width":2.1},{"x":1812,"y":675,"width":1.1},{"x":1811,"y":675,"width":2.1},{"x":1809,"y":675,"width":2.1},{"x":1807,"y":675,"width":3.1},{"x":1805,"y":675,"width":1.1},{"x":1803,"y":675,"width":2.1},{"x":1799,"y":675,"width":1.1},{"x":1798,"y":675,"width":0.1},{"x":1797,"y":675,"width":0.1},{"x":1796,"y":675,"width":2.1},{"x":1795,"y":675,"width":3.1},{"x":1794,"y":675,"width":0.1},{"x":1793,"y":674,"width":0.1},{"x":1792,"y":674,"width":2.1},{"x":1790,"y":674,"width":2.1},{"x":1789,"y":673,"width":0.1},{"x":1787,"y":673,"width":3.1},{"x":1786,"y":673,"width":0.1},{"x":1785,"y":673,"width":2.1},{"x":1785,"y":672,"width":2.1},{"x":1786,"y":672,"width":1.1},{"x":1787,"y":672,"width":0.1},{"x":1788,"y":672,"width":2.1},{"x":1788,"y":671,"width":3.1},{"x":1789,"y":671,"width":1.1},{"x":1789,"y":671,"width":2.1},{"x":1789,"y":670,"width":0.1},{"x":1791,"y":669,"width":0.1},{"x":1794,"y":668,"width":2.1},{"x":1796,"y":666,"width":3.1},{"x":1798,"y":664,"width":3.1},{"x":1800,"y":662,"width":2.1},{"x":1802,"y":661,"width":2.1},{"x":1803,"y":660,"width":3.1},{"x":1803,"y":659,"width":3.1},{"x":1804,"y":658,"width":2.1},{"x":1804,"y":657,"width":1.1},{"x":1805,"y":656,"width":0.1},{"x":1806,"y":656,"width":1.1},{"x":1807,"y":655,"width":0.1},{"x":1808,"y":654,"width":2.1},{"x":1810,"y":652,"width":1.1},{"x":1811,"y":652,"width":3.1},{"x":1812,"y":651,"width":0.1},{"x":1813,"y":650,"width":0.1},{"x":1814,"y":649,"width":3.1},{"x":1815,"y":648,"width":1.1},{"x":1816,"y":648,"width":0.1},{"x":1816,"y":647,"width":2.1},{"x":1817,"y":646,"width":2.1},{"x":1818,"y":646,"width":0.1},{"x":1819,"y":646,"width":3.1},{"x":1819,"y":645,"width":1.1},{"x":1820,"y":645,"width":1.1},{"x":1820,"y":645,"width":2.1},{"x":1821,"y":645,"width":2.1},{"x":1821,"y":644,"width":3.1},{"x":1822,"y":644,"width":3.1},{"x":1821,"y":644,"width":2.1},{"x":1821,"y":644,"width":0.1},{"x":1820,"y":645,"width":3.1},{"x":1819,"y":645,"width":3.1},{"x":1817,"y":646,"width":0.1},{"x":1817,"y":647,"width":0.1},{"x":1815,"y":648,"width":0.1},{"x":1815,"y":649,"width":1.1},{"x":1814,"y":649,"width":3.1},{"x":1813,"y":651,"width":1.1},{"x":1813,"y":652,"width":1.1},{"x":1812,"y":653,"width":2.1},{"x":1811,"y":653,"width":3.1},{"x":1810,"y":654,"width":0.1},{"x":1809,"y":655,"width":2.1},{"x":1809,"y":656,"width":2.1},{"x":1808,"y":656,"width":3.1},{"x":1808,"y":657,"width":3.1},{"x":1807,"y":658,"width":2.1},{"x":1806,"y":658,"width":2.1},{"x":1806,"y":659,"width":2.1},{"x":1805,"y":660,"width":3.1},{"x":1804,"y":660,"width":3.1},{"x":1803,"y":661,"width":1.1},{"x":1801,"y":662,"width":3.1},{"x":1800,"y":662,"width":1.1},{"x":1800,"y":662,"width":2.1},{"x":1799,"y":664,"width":2.1},{"x":1797,"y":665,"width":2.1},{"x":1796,"y":665,"width":2.1},{"x":1795,"y":666,"width":2.1},{"x":1794,"y":666,"width":3.1},{"x":1794,"y":666,"width":3.1},{"x":1793,"y":666,"width":3.1},{"x":1792,"y":666,"width":1.1},{"x":1791,"y":666,"width":2.1},{"x":1791,"y":667,"width":1.1},{"x":1790,"y":667,"width":1.1},{"x":1789,"y":667,"width":3.1},{"x":1789,"y":668,"width":1.1},{"x":1788,"y":668,"width":3.1},{"x":1788,"y":668,"width":2.1},{"x":1788,"y":669,"width":1.1},{"x":1788,"y":670,"width":0.1},{"x":1787,"y":670,"width":2.1},{"x":1787,"y":671,"width":0.1},{"x":1788,"y":671,"width":0.1},{"x":1788,"y":672,"width":2.1},{"x":1789,"y":672,"width":0.1},{"x":1789,"y":672,"width":3.1},{"x":1790,"y":673,"width":0.1},{"x":1791,"y":673,"width":1.1},{"x":1792,"y":674,"width":1.1},{"x":1792,"y":675,"width":1.1},{"x":1793,"y":675,"width":2.1},{"x":1793,"y":676,"width":3.1},{"x":1793,"y":677,"width":2.1},{"x":1794,"y":677,"width":3.1},{"x":1794,"y":678,"width":0.1},{"x":1794,"y":679,"width":1.1},{"x":1794,"y":679,"width":2.1},{"x":1794,"y":680,"width":1.1},{"x":1795,"y":681,"width":0.1},{"x":1795,"y":682,"width":0.1},{"x":1795,"y":683,"width":1.1},{"x":1796,"y":683,"width":0.1},{"x":1796,"y":684,"width":3.1},{"x":1796,"y":685,"width":3.1},{"x":1797,"y":685,"width":2.1},{"x":1797,"y":686,"width":2.1},{"x":1798,"y":686,"width":1.1},{"x":1798,"y":687,"width":2.1},{"x":1799,"y":687,"width":0.1},{"x":1799,"y":688,"width":1.1},{"x":1799,"y":689,"width":0.1},{"x":1800,"y":689,"width":1.1},{"x":1801,"y":689,"width":3.1},{"x":1801,"y":690,"width":3.1},{"x":1802,"y":690,"width":1.1},{"x":1802,"y":691,"width":0.1},{"x":1803,"y":691,"width":1.1},{"x":1803,"y":692,"width":0.1},{"x":1804,"y":693,"width":2.1},{"x":1805,"y":693,"width":2.1},{"x":1806,"y":694,"width":1.1},{"x":1806,"y":695,"width":1.1},{"x":1807,"y":696,"width":1.1},{"x":1808,"y":697,"width":0.1},{"x":1809,"y":698,"width":3.1},{"x":1809,"y":699,"width":3.1},{"x":1810,"y":699,"width":0.1},{"x":1810,"y":700,"width":1.1},{"x":1810,"y":701,"width":3.1},{"x":1811,"y":701,"width":0.1},{"x":1811,"y":702,"width":1.1},{"x":1811,"y":703,"width":3.1},{"x":1812,"y":704,"width":1.1},{"x":1812,"y":704,"width":2.1},{"x":1813,"y":704,"width":2.1},{"x":1813,"y":705,"width":0.1},{"x":1813,"y":706,"width":1.1},{"x":1814,"y":706,"width":2.1},{"x":1814,"y":707,"width":1.1},{"x":1815,"y":707,"width":3.1},{"x":1815,"y":708,"width":2.1},{"x":1815,"y":709,"width":1.1},{"x":1816,"y":709,"width":0.1},{"x":1816,"y":710,"width":2.1},{"x":1816,"y":711,"width":3.1},{"x":1816,"y":711,"width":2.1},{"x":1816,"y":712,"width":2.1},{"x":1815,"y":712,"width":1.1},{"x":1814,"y":711,"width":2.1},{"x":1813,"y":709,"width":0.1},{"x":1812,"y":708,"width":2.1},{"x":1811,"y":707,"width":0.1},{"x":1810,"y":706,"width":0.1},{"x":1810,"y":706,"width":1.1},{"x":1810,"y":705,"width":2.1},{"x":1809,"y":705,"width":1.1},{"x":1807,"y":704,"width":3.1},{"x":1806,"y":703,"width":3.1},{"x":1806,"y":702,"width":3.1},{"x":1805,"y":702,"width":1.1},{"x":1804,"y":701,"width":3.1},{"x":1804,"y":700,"width":2.1},{"x":1803,"y":700,"width":3.1},{"x":1803,"y":699,"width":3.1},{"x":1802,"y":699,"width":0.1},{"x":1802,"y":698,"width":0.1},{"x":1802,"y":697,"width":2.1},{"x":1801,"y":697,"width":3.1},{"x":1801,"y":696,"width":0.1},{"x":1801,"y":696,"width":2.1},{"x":1801,"y":695,"width":3.1},{"x":1801,"y":694,"width":0.1},{"x":1800,"y":694,"width":1.1},{"x":1800,"y":693,"width":2.1},{"x":1798,"y":693,"width":0.1},{"x":1798,"y":692,"width":2.1},{"x":1797,"y":691,"width":1.1},{"x":1797,"y":690,"width":2.1},{"x":1796,"y":690,"width":1.1},{"x":1795,"y":688,"width":2.1},{"x":1794,"y":687,"width":2.1},{"x":1794,"y":686,"width":1.1},{"x":1793,"y":685,"width":1.1},{"x":1793,"y":683,"width":0.1},{"x":1792,"y":683,"width":0.1},{"x":1792,"y":682,"width":2.1},{"x":1790,"y":681,"width":1.1},{"x":1790,"y":680,"width":2.1},{"x":1789,"y":680,"width":0.1},{"x":1789,"y":679,"width":3.1},{"x":1788,"y":678,"width":1.1},{"x":1788,"y":678,"width":0.1},{"x":1787,"y":678,"width":1.1},{"x":1787,"y":676,"width":3.1},{"x":1786,"y":675,"width":0.1},{"x":1785,"y":674,"width":2.1},{"x":1785,"y":673,"width":1.1},{"x":1784,"y":672,"width":0.1},{"x":1784,"y":671,"width":0.1},{"x":1784,"y":671,"width":2.1},{"x":1782,"y":671,"width":0.1},{"x":1782,"y":670,"width":0.1},{"x":1781,"y":669,"width":0.1},{"x":1781,"y":668,"width":1.1}]
	]

	canvas.width = windowWidth;
	canvas.height = projectHeight;
	
	function getRandomInt(min, max) {
	  return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	var elOffset = canvas.getBoundingClientRect().top;
	var ctx = canvas.getContext('2d');

	ctx.lineJoin = ctx.lineCap = 'round';

	var isDrawing, points = [];

	initShapes();

	function initShapes(){
		var shapesCanvas = document.querySelector('#project-euro2016 .shapes-container');
		shapesCanvas.width = windowWidth;
		shapesCanvas.height = projectHeight;
		var shapesCtx = shapesCanvas.getContext('2d');
		shapesCtx.lineJoin = shapesCtx.lineCap = 'round';

		function beginShape(shapeNo){
			var shape = shapes[shapeNo];
			
			function drawShape(i){
				var loc = shape[i];
				if(i===0){
					shapesCtx.beginPath();
					shapesCtx.moveTo(loc.x, loc.y - 100);
				}else{
					shapesCtx.lineWidth = loc.width;
					shapesCtx.lineTo(loc.x, loc.y - 100);
					shapesCtx.strokeStyle = 'rgba(200,200,200,0.1)';
				    shapesCtx.stroke();
				}

				if(i < shape.length - 1){
					i++;
					setTimeout(function(){
						drawShape(i);
					},10)
				}else{
					shapesCtx.closePath();
					if(shapeNo < shapes.length -1){
						shapeNo++;
						beginShape(shapeNo)
					}else{
						shapesCtx.clearRect(0, 0, shapesCanvas.width, shapesCanvas.height);
						beginShape(0);
					}
				}
			}
			drawShape(0);
		}
		
		beginShape(0);
	}

	function getRandomInt(min, max) {
	  return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	el.onmousedown = function(e) {
		points = [];
		elOffset = canvas.getBoundingClientRect().top;
		routes.push([]);
		isDrawing = true;

		ctx.beginPath();
		ctx.moveTo(e.clientX, e.clientY - elOffset);
		points.push({
			x: e.clientX,
			y: e.clientY,
			width: 1
		})
	};

	el.onmousemove = function(e) {
	  if (!isDrawing) return;
	    var lineWidth = getRandomInt(0.1,3 )
	    ctx.lineWidth = lineWidth;
	    ctx.lineTo(e.clientX, e.clientY - elOffset);
	    ctx.strokeStyle = 'rgba(200,200,200,0.1)';
	    ctx.stroke();
	    points.push({
			x: e.clientX,
			y: e.clientY,
			width: lineWidth
		})
	};

	el.onmouseup = function() {
		if(!isDrawing){return false}
			ctx.closePath();
			isDrawing = false;
	};
}




// Turkish election
function initProjectTurkey(){
	var blockSize = 100;
	var blocksAmount = Math.floor(windowWidth/blockSize)+1;
	var projectContainer = document.querySelector('#project-turkey');

	for(i=0;i<blocksAmount;i++){
		var barWidth = windowWidth / blocksAmount;
		var barEl = document.createElement('div');
		barEl.className = 'bar';
		barEl.style.top = 0;
		barEl.style.position = 'absolute';
		barEl.style.left = barWidth*i + "px";
		barEl.style.width = barWidth - 1 + "px";
		barEl.style.height = Math.random()*projectHeight + "px";
		
		barEl.addEventListener('mouseenter',function(e){
			e.target.style.height = Math.random()*projectHeight + "px"
		})

		barEl.addEventListener('touchstart',function(e){
			e.target.style.height = Math.random()*projectHeight + "px"
		})

		projectContainer.appendChild(barEl)
	}		
}





// Project 3 World Cup
function initProjectWorldcup(){
	var countries = ["es","de","england","pt","be","it","ru","ch","at","hr","ua","cz","se","pl","ro","sk","hu","tr","ie","is","wales","al","ni"];
	var columnCount = Math.round(windowWidth/22) + 1;
	var rowCount = Math.round(projectHeight/22) + 1;
	var projectContainer = document.querySelector('.worldcup-ballscontainer');
	var counters = [];
	var hover = 0;
	var intervalCounter = 0;

	for(i=0;i<rowCount;i++){
		for(j=0;j<columnCount;j++){
			var dot = document.createElement('div');
			dot.className = 'dot row-' + i + ' column-' + j;
			dot.setAttribute('data-row',i);
			dot.setAttribute('data-column',j);
			dot.style.top = i*22 + 2 + "px";
			dot.style.left = j*22 + 2 + "px";
			if(!isMobile){
				dot.addEventListener('mouseenter',function(e){
					hover++;
		  			counters[hover] = 0;
		  			colorDot(e.currentTarget,hover,true);
				})
			}

			projectContainer.appendChild(dot);
		}
	}

	if(isMobile){
		setInterval(function(){
			var offsetTop = document.querySelector('#project-worldcup').getBoundingClientRect().top;

			if(offsetTop > -projectHeight && offsetTop < windowHeight+projectHeight){
				hover++;
				counters[hover] = 0;
				var els = document.querySelectorAll('.dot:not(.active)');
				var randomNo = Math.round(Math.random() * els.length);
				var e = els[randomNo];
				colorDot(e,hover,true)
			}
			intervalCounter++;
			if(intervalCounter === 20){
				intervalCounter = 0;
				var dotEls = document.querySelectorAll('.dot');

				for(var i = 0; i<dotEls.length; i++){
					dotEls[i].classList.remove('active');
					dotEls.innerHTML = "";
				}
			}
		},1000)
	}

	function colorDot(el,id,isFirst){
    	var row = Number(el.getAttribute('data-row'));
    	var column = Number(el.getAttribute('data-column'));
    	var img = document.createElement('img');
		img.src = 'imgs/flags/' + countries[Math.round(Math.random()*(countries.length-1))] + '.svg';
		el.appendChild(img);
		el.classList.add('active');

		if(isFirst){
			function findOther(){
				counters[id]++;
		    	var newRow = row + (Math.round((Math.random() * 4)) - 2);
				var newColumn = column + (Math.round((Math.random() * 4)) - 2);
				var newEl = document.querySelector('.row-'+newRow+'.column-'+newColumn);

				if(newRow !== row || newColumn !== column){
					if(newEl){
						if(newEl.className.indexOf('active') < 0){
							setTimeout(function(){
								colorDot(newEl);
								if(counters[id] < 3){
									findOther();
								}
							},100)
						}
					}
				}
			}
			findOther();
		}
    }


  	document.querySelector('#project-worldcup').addEventListener('click',function(){
  		var dotEls = document.querySelectorAll('.dot');

  		for(var i = 0; i<dotEls.length; i++){
  			dotEls[i].classList.remove('active');
  			dotEls.innerHTML = "";
  		}
  	})
  		
	
}


// Project 4
function initProjectNhs(){
	var projectContainer = document.querySelector('#project-nhs');

	function animateLetter(letter){
		var maxOffset = windowWidth < 740 ? 120 : 480
		var offset = -Math.random()*maxOffset;
		letter.querySelector('span').style.transform = "translateY(" + offset + "px) translateZ(0)";
	}

	var letters = projectContainer.querySelectorAll('.letter');

	for(i=0;i<letters.length;i++){
		animateLetter(letters[i]);
		letters[i].addEventListener('mouseenter',function(e){
			animateLetter(e.target);
			clearTimeout(nhsInterval);
		})
	}

	var nhsInterval = setInterval(function(){
		var offsetTop = projectContainer.getBoundingClientRect().top;
		if(offsetTop > -projectHeight && offsetTop < windowHeight+projectHeight){
			for(i=0;i<letters.length;i++){
				animateLetter(letters[i]);
			}
		}
	},2500)
}



// Project 5
function initProjectCivilwar(){
	var faders = document.querySelectorAll('#project-civilwar .fader-two');
	var projectContainer = document.querySelector('#project-civilwar');
	var up = false;
	if(!isMobile){
		projectContainer.addEventListener('mousemove',function(e){
			var opacity = (e.clientX/windowWidth);

			for(var i=0; i<faders.length; i++){
				faders[i].style.opacity = opacity;
			}

			document.querySelector('.now').style.opacity = opacity;
			document.querySelector('.then').style.opacity = 1-opacity;
		})
	}else{
		setInterval(function(){
			var offsetTop = projectContainer.getBoundingClientRect().top;
			
			if(offsetTop > -projectHeight && offsetTop < windowHeight){
				var opacity = up ? 1 : 0;
				up = !up;
					
				for(var i=0; i<faders.length; i++){
					faders[i].style.opacity = opacity;
				}

				document.querySelector('.now').style.opacity = opacity;
				document.querySelector('.then').style.opacity = 1-opacity;
			}
		},4000)
		

		
	}
	


}


// PRoject Bangla
function initProjectBangla(){
	var projectContainer = document.querySelector('#project-bangla');

	if(!isMobile){
		projectContainer.querySelector('video').src = "imgs/bangla.mp4";
		projectContainer.querySelector('video').play();
	}else{
		projectContainer.querySelector('.video-container').style.backgroundImage = "url(imgs/bangla.jpg)";
	}
	

	


	setInterval(function(){
		var offsetTop = projectContainer.getBoundingClientRect().top;
		if(!isMobile){
			if(offsetTop > -projectHeight && offsetTop < windowHeight){
				projectContainer.querySelector('video').play();
			}else{
				projectContainer.querySelector('video').pause();
			}
		}
	},1000)
}
	// Should start counting from start

	var wage = 1 / (60*60);
	var retailers = 38635000000 / (365*24*60*60);
	var startPoint = Date.now();

	setInterval(function(){
		var newDate = Date.now();
		var diff = Math.floor((newDate - startPoint)/1000);

		document.querySelector('.counter-retailers').innerHTML = '£'+Math.round((diff*retailers)/1000) + 'k';
		document.querySelector('.counter-wage').innerHTML = '£'+(diff*wage).toFixed(2);
	},1000)



// PRoject Mekong
function initProjectMekong(){
	var scrollThrottle = 0;
	var oldProject = 0;
	var projectContainer = document.querySelector('#project-mekong');
	var riverContainer = document.querySelector('.background-river');
	if(!isMobile){
		projectContainer.addEventListener('mousemove',function(e){
			scrollThrottle++;

			if(scrollThrottle>3){
				scrollThrottle = 0;
				var projectOffset = projectContainer.getBoundingClientRect().top;
				var yMousePos = e.clientY - projectOffset;
				var yValue = yMousePos/projectHeight;
				var xValue = e.clientX/windowWidth;
				var stop1 = "hsla(" + ((xValue*140) + 20) + ",30%," + (50 + (yValue*50))  + "%,1)"
				var stop2 = "hsla(" + ((yValue*140) + 20) + ",10%," + (80 - (xValue*50))  + "%,1)"

				riverContainer.style.backgroundImage = "linear-gradient(90deg, " + stop1 + "0%, " + stop2 + " 100%)"
			}
		})
	}else{
		setInterval(function(){
			var offsetTop =  projectContainer.getBoundingClientRect().top;

			if(offsetTop > -projectHeight && offsetTop < windowHeight){
				var yValue = Math.random();
				var xValue = Math.random();
				var stop1 = "hsla(" + ((xValue*120) + 20) + ",20%," + (50 + (yValue*30))  + "%,1)"

				riverContainer.style.background = stop1
			}
		},2000)
		
	}

	if(windowWidth>640){
		riverContainer.querySelector('img').src = "imgs/mekong/header.png";
	}

	
}


// PRoject 8
function initProjectScotland(){
	var donutCircle = document.querySelector('#donut-circle');
	var projectContainer = document.querySelector('#project-scotland');
	
	if(!isMobile){
		projectContainer.addEventListener('mousemove',function(e){
			var pos = e.clientX/windowWidth;
			var total = 270  - (pos * 180);
			donutCircle.style.transform = "rotate(" + total + "deg)"
		})
	}else{
		setInterval(function(){
			var offsetTop = document.querySelector('#project-scotland').getBoundingClientRect().top;

			if(offsetTop > -projectHeight && offsetTop < windowHeight){
				var pos = Math.random();
				var total = 270  - (pos * 180);
				
				donutCircle.style.transform = "rotate(" + total + "deg)"
			}
		},2000)
	}
	// createDonut();
}






function initProjectPopes(){
	var popeContainer = document.querySelector('#pope-container');
	var blockSize = isMobile ? 60 : 120;
	var activeCards = [];
	var activePopes = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26];

	var columns = Math.floor(windowWidth/(blockSize+10)) + 2;
	var rows = Math.floor(projectHeight/(blockSize+10)) + 1;

	for(i=0; i <columns; i++){
		for(j=0; j<rows; j++){
			var block = document.createElement('div');
			block.className = 'pope-card-container';
			block.innerHTML = '<div class="pope-card"><div class="front"></div><div class="back"></div></div>';
			block.style.left = i*blockSize + 10 + (4 - (Math.random()*8)) + "px";
			block.style.top = j*blockSize+ 10 + (4 - (Math.random()*8)) + "px";
			block.addEventListener('mouseenter',function(e){
				if(e.currentTarget.className.indexOf('turnt') < 0){
					var randomNumber = Math.round(Math.random()*(activePopes.length-1));
					addPope(e.currentTarget,randomNumber)
				}
			})
			popeContainer.appendChild(block);
		}
	}

	if(isMobile){
		var popeInterval = setInterval(function(){
			var offsetTop = document.querySelector('#project-popes').getBoundingClientRect().top;

			if(offsetTop > -projectHeight && offsetTop < windowHeight+projectHeight){
				var randomNumber = Math.round(Math.random()*(activePopes.length-1));
				var els = document.querySelectorAll('.pope-card-container:not(.turnt)');
				var randomElNo = Math.round(Math.random()*(els.length - 1));
				var e = els[randomElNo];

				addPope(e,randomNumber);
			}
		},1000)
	}

	function addPope(e,randomNumber){
		activeCards.push(e)
		e.classList.add('turnt');
		e.setAttribute('data-pope',activePopes[randomNumber]);
		e.querySelector('.back').style.backgroundImage = 'url(imgs/popes/pope-' + activePopes[randomNumber] + '.jpg)';

		activePopes.splice(randomNumber,1);

		var maxLength = isMobile ? 5 : 10;
		if(activeCards.length > maxLength){
			activeCards[0].classList.remove('turnt');
			var pope = activeCards[0].getAttribute('data-pope');
			activePopes.push(pope);
			activeCards.shift();
		}
	}
}



function initMobile(){
	window.ondeviceorientation = function(e){
		rotationGamma = e.gamma;
	}
}





