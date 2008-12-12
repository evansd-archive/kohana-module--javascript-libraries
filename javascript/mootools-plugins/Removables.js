/* <?php echo '*','/';

	$this->requires('mootools/Element.js');
	$this->requires('mootools/Selectors.js');

echo '/*'; ?> */

var Removables = new Class({

	Implements: [Events, Options],

	options: {
		onComplete: $empty,
		startStyles: {'opacity': 0},
		endStyles: {'width': 0, 'height': 0},
		effect: {},
		handle: '.remove',
		handleToElement: function(handle) { return handle.getParent(); }
	},

	initialize: function(element, options){
		this.setOptions(options);
		this.element = $(element);
		this.boundClickHandler = this.click.bindWithEvent(this);
		this.attach();
	},

	attach: function(){
		this.element.addEvent('click', this.boundClickHandler);
	},

	detach: function(){
		this.element.removeEvent('click', this.boundClickHandler);
	},

	click: function(event){
		var el = $(event.target);
		while(el != this.element && !el.match(this.options.handle)) {
			el = el.getParent();
		}
		if(el.match(this.options.handle)) {
			var element = this.options.handleToElement(el);
			if(element) this.remove(element);
			return false;
		}
	},

	remove: function(element){
		var effect = new Fx.Morph(element, this.options.effect);
		effect.addEvent('complete', this.complete.bind(this, element));
		element.setStyles(this.options.startStyles);
		effect.start(this.options.endStyles);
	},

	complete: function(element){
		this.fireEvent('onComplete', element);
		element.destroy();
	}

});
