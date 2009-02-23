/* <?php echo '*','/';

	$this->requires('mootools/Class.Extras.js');
	$this->requires('mootools/Element.Event.js');
	$this->requires('mootools/Element.Dimensions.js');
	$this->requires('mootools/Element.Style.js');

echo '/*';?> */

var SortableTable = new Class({

	Implements: [Events, Options],

	options: {
		onStart: Class.empty,
		onComplete: Class.empty,
		isHandle: function(el) { return /\bhandle\b/.test(el.className); },
		// adds a margin which needs to be exceeded before the order is changed
		// this is required if there are rows of different height to avoid circumstances
		// where rows flicker back and forth
		dropMargin: function(height) { return height * 0.1; }
	},


	initialize: function(table, options){
		this.setOptions(options);
		this.table = $(table);
		this.rows = this.table.getElementsByTagName('tr');
		this.firstRow = this.rows[0].getElementsByTagName('th').length > 0 ? 1 : 0;
		if(this.options.firstRow) this.firstRow = this.options.firstRow;

		if($type(this.options.dropMargin) != 'function') this.options.dropMargin = function() { return 0; };

		this.bound = {
			'end': this.end.bind(this),
			'move': this.move.bindWithEvent(this),
			'start': this.start.bindWithEvent(this)
		};

		if (this.options.initialize) this.options.initialize.call(this);

		this.table.addEvent('mousedown', this.bound.start);
	},


	start: function(event) {

		var el = $(event.target);

		while(!this.options.isHandle(el)) {
			if(el == this.table || el.get('tag') == 'tr') return;
			el = el.getParent();
		}

		while(el.get('tag') != 'tr') {
			el = el.getParent();
		}

		this.active = el;

		this.coordinates = {
			'top': $(this.rows[this.firstRow]).getTop(),
			'bottom': $(this.rows[this.rows.length-1]).getCoordinates().bottom
		};

		var position = el.getPosition();
		this.offset = event.page.y - position.y;

		this.ghost = new Element('div', {
			'styles':{
				'position': 'absolute',
				'left': position.x,
				'top': event.page.y - this.offset,
				'width': el.offsetWidth,
				'height': el.offsetHeight},
			'class': 'SortableTable_ghost'}
			).inject(document.body);

		this.marker = new Element('div', {
			'styles': {
				'position': 'absolute',
				'left': position.x,
				'top': position.y,
				'width': el.offsetWidth,
				'height': el.offsetHeight},
			'class': 'SortableTable_marker'}
			).inject(document.body);

		document.addEvent('mousemove', this.bound.move);
		document.addEvent('mouseup', this.bound.end);

		this.fireEvent('onStart', el);
		event.stop();
	},


	move: function(event) {

		this.ghost.setStyle('top', (event.page.y - this.offset).limit(this.coordinates.top, this.coordinates.bottom - this.ghost.offsetHeight));

		var swap, temp, now = event.page.y.limit(this.coordinates.top, this.coordinates.bottom);

		var up = (this.previous || now) - now;

		while(true) {

			if (up > 0 && (swap = this.active.getPrevious()) &&
				(coords = swap.getCoordinates()) && now < coords.bottom - this.options.dropMargin(coords.height)) {

				this.active.injectBefore(swap);

			} else if (up < 0 && (swap = this.active.getNext()) &&
				(coords = swap.getCoordinates()) && now > coords.top + this.options.dropMargin(coords.height)) {

				this.active.injectAfter(swap);

			} else {

				this.previous = now;
				event.stop();
				return;

			}

			this.marker.setStyle('top', this.active.getPosition().y);

			temp = this.active.className;
			this.active.className = swap.className;
			swap.className = temp;

		}
	},


	end: function() {

		this.previous = null;
		document.removeEvent('mousemove', this.bound.move);
		document.removeEvent('mouseup', this.bound.end);
		this.ghost.dispose();
		this.marker.dispose();
		this.fireEvent('onComplete', this.active);
	}

});
