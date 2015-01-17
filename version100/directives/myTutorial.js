angular.module('directives.myTutorial',[]).directive('myTutorial',['config', function (config){
	return {
		restrict: 'E',
		replace: true,
		template: '<div id="' + config.d3Id+ '"> <div class="col droptargets"></div> <div class="col draggables"></div> </div>',
		link: function (scope,element,attr){
			// -- 
			// Setup: Creating the dataset and placing the data in the document.
			// --

			// Establish our dataset
			var dwarfSet = {
				Fairytale : ["Blick","Flick","Glick","Quee"],
				Tolkien : ["Thorin","Gloin","Fili","Kili"],
				Pratchett : ["Carrot","Goodmountain","Littlebottom"]
			}

			var types = d3.keys(dwarfSet);
			var dwarves = d3.shuffle(d3.merge(d3.values(dwarfSet)));
			// Droppable items on the right
			var draggables = d3.select(".draggables").append("ul");
			draggables.selectAll("li").data(dwarves).enter()
				.append("li")
				.text(function(d) { return d })

			// Drop targets on the left
			var canvas = d3.select(".droptargets").append("svg")
				.attr("width",200)
				.attr("height",400)
				.attr("class","YlGn");

			var dropTargets = canvas.selectAll("rect").data(types).enter().append("g")

			dropTargets.append("rect")
				.attr({
					width: 180,
					height: 100,
					x: 10.5,
					y: function(d,i) { return (i * 110) + .5},
					rx: 20,
					ry: 20,
					class: function(d,i) { return "color" + (i+1) }
				})

			dropTargets.append("text")
				.text(function (d) { return d })
				.attr({
					x: 25.5,
					dy: 30,
					y: function(d,i) { return (i * 110) + .5}
				});

			// ---
			// Handle dragging from HTML to dropping on SVG
			// ---
			var DragDropManager = {
				dragged: null,
				droppable: null,
				draggedMatchesTarget: function() {
					if (!this.droppable) return false;
					return (dwarfSet[this.droppable].indexOf(this.dragged) >= 0);
				}
			}

			var body = d3.select("#chart").append("div").append("svg");
			
			// Register the associated element as a potential target on mouseOver
			// D3 events call listeners with the current datum
			// and index, so this is straightforward.
			dropTargets.on('mouseover',function(d,i){
				DragDropManager.droppable = d; 
			});

			// Clear the target from the DragDropManager on mouseOut.
			dropTargets.on('mouseOut',function(e){
				DragDropManager.droppable = null;
			});

			// Set up jqueryUI's draggable on the list items
			// 
			// Note that we have to move helper out of the way of the cursor
			// using the "cursorAt" property; otherwise the cursor will be 
			// located over the helper and the SVG element's mouseover/mouseout
			// events will not fire.

			$(".draggables li").draggable({
				revert: true,
				revertDuration: 200,
				cursorAt: { left: -2, top: -2 }, 

				// Register what we're dragging with the drop manager
				start: function (e) {
					// Getting the datum from the standard event target requires more work.
					DragDropManager.dragged = d3.select(e.target).datum();
				},
				// Set cursors based on matches, prepare for a drop
				drag: function (e) {
					matches = DragDropManager.draggedMatchesTarget();
					body.style("cursor",function() {
						return (matches) ? "copy" : "move";
					});
					// Eliminate the animation on revert for matches.
					// We have to set the revert duration here instead of "stop"
					// in order to have the change take effect.
					$(e.target).draggable("option","revertDuration",(matches) ? 0 : 200)
				},
				// Handle the end state. For this example, disable correct drops
				// then reset the standard cursor.
				stop: function (e,ui) {
					// Dropped on a non-matching target.
					if (!DragDropManager.draggedMatchesTarget()) return;
					$(e.target).draggable("disable");
					$("#chart").css("cursor","");
				}
			});

		}


	}
}])