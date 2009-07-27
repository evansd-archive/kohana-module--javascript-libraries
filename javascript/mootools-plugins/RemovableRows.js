//= requires <mootools/Element.Event>

var RemovableRows = new Class({
	
	Implements: [Events, Options],
	
	options: {
		isRemoveTrigger: function(el) { return /\bremove\b/.test(el.className); },
		onRemove: Class.empty
	},
	
	
	initialize: function(table, options) {
		this.setOptions(options);
		this.table = $(table);
		
		this.table.addEvent('click', this.handleClick.bindWithEvent(this));
	},
	
	
	handleClick: function(event) {
		var el = $(event.target);
		
		while(!this.options.isRemoveTrigger(el)) {
			if(el == this.table || el.get('tag') == 'tr') return;
			el = el.getParent();
		}
		
		while(el.get('tag') != 'tr') {
			el = el.getParent();
		}
		
		this.removeRow(el);
		event.stop();
	},
	
	
	removeRow: function(row) {
	
		row = $(row);
		var last = row.className;
		var next = row.getNext();
		var temp;
		
		while(next) {
			temp = next.className;
			next.className = last;
			last = temp;
			next = next.getNext();
		}
		
		row.dispose();
		
		this.fireEvent('onComplete');
	}

});
