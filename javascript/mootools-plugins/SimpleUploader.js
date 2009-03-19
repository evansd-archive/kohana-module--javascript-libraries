/* <?php echo '*','/';

	$this->requires('mootools-plugins/Swiff.Uploader.js');
	$this->requires('mootools-plugins/Fx.ProgressBar.js');

echo '/*';?> */

var SimpleUploader = new Class({

	Extends: Swiff.Uploader,

	options: {
		autostart: true
	},

	initialize: function(status, options) {
		this.status = $(status);
		if (options.callBacks) {
			this.addEvents(options.callBacks);
			options.callBacks = null;
		}
		this.parent(options);
		this.render();
	},

	render: function() {
		this.overallProgress = new Fx.ProgressBar(this.status.getElement('.overall-progress'));
	},

	onAllSelect: function() {
		if(this.options.autostart) this.upload();
	},

	onProgress: function(file, current, overall) {
		this.overallProgress.start(overall.bytesLoaded, overall.bytesTotal);
	},

	onAllComplete: function(current) {
		this.overallProgress.start(100);
		this.overallProgress.element.setStyle.delay(1000, this.overallProgress.element, ['visibility', 'hidden']);
	},

	upload: function(options) {
		var ret = this.parent(options);
		if (ret !== true) {
			if (ret) alert(ret);
		} else {
			this.overallProgress.set(0);
			this.overallProgress.element.setStyle('visibility', 'visible');
		}
	},

	cancelAll: function() {
		this.getFileList().each(this.removeFile, this);
		this.overallProgress.element.setStyle('visibility', 'hidden');
	}

});
