var casper = require('casper').create({
	clientScripts: ['./jquery.js']
});

var data = [];
var fs = require('fs');

casper.start(
	'https://vu.sfc.keio.ac.jp/course2014/summary/syll_view_c.cgi?yc=2016_25037&ks=B2001', 
	function(){
		data = this.evaluate(function(){
			arr = Array.prototype.slice.call(document.querySelectorAll('table'));
			return arr.map(function(a){
				return a.innerHTML;
			});
		});
		require('utils').dump(data);
		fs.write('table.txt', data, 'a');
});

casper.run();
