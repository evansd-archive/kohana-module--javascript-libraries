//= requires <mootools/Fx.Scroll>


// Scroll container the minimum amount necessary to ensure that the passed in element is fully visible
Fx.Scroll.implement(
{
	showElement: function(el)
	{
		var pos = $(el).getCoordinates(this.element);
		var scroll = this.element.getScroll();

		if(pos.top < scroll.y)
		{
			return this.cancel().start(scroll.x, pos.top);
		}

		var size = this.element.getSize();

		if(pos.bottom > size.y + scroll.y)
		{
			return this.cancel().start(scroll.x, pos.bottom - size.y);
		}

		return this;
	}
});
