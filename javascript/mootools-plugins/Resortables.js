/* <?php echo '*','/';

	$this->requires('mootools/Sortables.js');
	$this->requires('mootools/Fx.Morph.js');
	$this->requires('mootools/Fx.Transitions.js');
	$this->requires('mootools/Selectors.js');

echo '/*';?> */

var Resortables = new Class({

	Extends: Sortables,

	options: {
		opacity: 0,
		clone: true,
		revert: {duration: 300, transition: 'cubic:out'},
		handle: 'li',
		constrain: false
	},

	initialize: function(){
		this.parent.apply(this, arguments);
	},

	addItems: function(){
		return this;
	},

	addLists: function(){
		Array.flatten(arguments).each(function(list){
			this.lists.push(list);
			if(!list.retrieve('sortables:mousedown')) {
				var mousedown = list.retrieve('sortables:mousedown', this.mouseDown.bindWithEvent(this, list));
				list.addEvent('mousedown', mousedown);
			}
		}, this);
		return this;
	},

	mouseDown: function(event, list){
		if(!this.idle) return;
		var element = $(event.target);
		while(true) {
			if(element.match(this.options.handle)) {
				this.start(event, element);
				break;
			}
			if(element == list) break;
			element = element.getParent();
		}
	},

	removeItems: function(){
		return this;
	},

	removeLists: function(){
		var lists = [];
		Array.flatten(arguments).each(function(list){
			lists.push(list);
			this.lists.erase(list);
			var mousedown = list.retrieve('sortables:mousedown');
			if(mousedown) list.removeEvent('mousedown', mousedown);
		}, this);
		return $$(lists);
	},

	getClone: function(){
		var clone = this.parent.apply(this, arguments);
		return clone.setStyle('z-index', 1);
	},

	start: function() {
		this.parent.apply(this, arguments);
		this.drag.options.preventDefault = true;
	},

	end: function(){
		this.drag.detach();
		if (this.effect){
			var dim = this.element.getStyles('width', 'height');
			var pos = this.clone.computePosition(this.element.getPosition(this.clone.offsetParent));
			this.effect.element = this.clone;
			this.effect.addEvent('complete', this.element.set.create({bind: this.element, arguments: ['opacity', this.opacity]}));
			this.effect.addEvent('complete', this.reset.create({delay:10, bind: this}));
			this.effect.start({
				top: pos.top,
				left: pos.left,
				width: dim.width,
				height: dim.height
			});
		} else {
			this.element.set('opacity', this.opacity);
			this.reset();
		}
	}


});
