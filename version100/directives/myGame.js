angular.module('directives.myGame',[]).directive('myGame',['config', function (config){
	return {
		restrict: 'E',
		replace: true,
		template: '<div id="'+ config.d3Id+'"></div>',
		link: function (scope,element,attr){
			var groups = ["uno", "dos", "tres", "cuatro"];
			var w = 350;
			var x = 0;
			var y = 0;
			var width = 1200;
			var h = 200;
			var height = 1200;
			
			var val = [];
			
			var drag = d3.behavior.drag()
	            .origin(function() {
	                var current = d3.select(this);
	                return {x: current.attr("x"), y: current.attr("y") };
	            })
				.on("drag", move);
				
			var resize = d3.behavior.drag()
				.origin(function() {
	                var current = d3.select(this);
	                return {x: current.attr("x"), y: current.attr("y") };
	            })
				.on("drag", dragResize);
			
		 	svg = d3.select("#chart").append("div").append("svg")
		 		.attr("width", width)
		 		.attr("height",height);
	            charts = svg.selectAll("g.chart")
	                .data(groups); //(dims);
	            box = charts.enter()
	                .append("g").classed("chart", true)
	                .attr("id", function(d,i) { return "box"+i})
					//.data([{x: 95, y: 0}]);
	                
	            
	            box.append("rect").classed("box", true)
					
	            var t = box.append("rect").classed("titleBox", true)
				t.call(drag);
	            box.append("text").classed("title", true).data(groups)
	            box.append("text").classed("legend", true).data(groups)
				box.append("rect").classed("icon", true)
					.call(resize);
	                
	            box.selectAll("rect.box")
	                .data([{x: 95, y: 0}])
	                .attr({
	                    x: function(d) { return d.x; },
	                    y: function(d) { return d.y; },
	                    width: w,
	                    height: function(d) { return 200}//d.length*30 + 60}
	                })
	                
	            box.selectAll("rect.titleBox")
					.classed("drag", true)
					.data([{x: 95, y: 0}])
	                .attr({
	                    x: function(d) { return d.x; },
	                    y: function(d) { return d.y; },
	                    width: w,
	                    height: 25,
	                    fill: "#000000"
	                })
	                
	                
	            box.selectAll("text.title")
	                .attr({
	                        x: 105,
	                        y: 20,
	                        width: 350,
	                        height: 25,
	                        fill: "#ffffff"
	                    })
	                .text(function(d) {
	                     console.log("i from title "+ d);
	                    return d;
	                })
	                
	            box.selectAll("text.legend")
	                .attr({
	                        x: 105,
	                        y: 45,
	                        width: 200,
	                        height: 25,
	                        fill: "#999999"
	                    })
	                .text(function(d) {
	                    return d;
	                })
					
					box.selectAll("rect.icon")
						.data([{x: 429, y: 184}])
						.attr({
	                        x: function(d) { return d.x; },
	                    	y: function(d) { return d.y; },
	                        width: 16,
	                        height: 16,
							fill: "#999999"
	                    })
				
				var dx = 429;
				var dy = 184;		
						//.attr("href", "icon_resize.gif")
					
				function move(){
					 var dragTarget = d3.select(this);
					 var dragObject = d3.select(this.parentNode);

					 console.log("move x:"+x+" y:"+y);
					 //console.log("d3.event.x:"+d3.event.x+" d3.event.y:"+d3.event.y);
					 
					 x += d3.event.x - parseInt(dragTarget.attr('x'));
					 y += d3.event.y - parseInt(dragTarget.attr("y"));
					 console.log("x:"+x+" y:"+y);
				
					 dragObject
					 	.attr("transform", "translate(" + x + "," + y + ")")
				};
				
				function dragResize(){
					 var dragx = Math.max(dx + (16/2), Math.min(w, dx + width + d3.event.dx));
					 var dragy = Math.max(dy + (16/2), Math.min(h, dy + height + d3.event.dy));
					 
					 //console.log("resize x:"+x+" y:"+y);
					 console.log("d3.event.x:"+d3.event.dx+" d3.event.y:"+d3.event.dy);
					 
					 var dragTarget = d3.select(this);
					 var dragObject = d3.select(this.parentNode);

					 var o = dragObject.select("rect.box");
					 var o1 = dragObject.select("rect.titleBox");

				
					 var oldx = dx; 
					 var oldy = dy;

					  dx = Math.max(0, Math.min(dx + width - (16 / 2), d3.event.x)); 
					  dy = Math.max(0, Math.min(dy + height - (16 ), d3.event.y));
					  w = w - (oldx - dx);
					  h = h - (oldy - dy);
					  
					  
					  dragTarget
	        			.attr("x", function(d) { return dragx - (16/2) })
						.attr("y", function(d) { return dragy - (16) })
					  
					  o.attr("width", w)
					   .attr("height", h);
					   
					  o1.attr("width", w);
				};
			}


	}
}])