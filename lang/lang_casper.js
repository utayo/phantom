var casper = require('casper').create({clientScripts: ['./jquery.js']});
var arr = [];

casper.start('http://vu.sfc.keio.ac.jp/course_u/data/2016/csec14_3.html',function(){
	this.echo("Language Home Window");
	//	くっそ重いので作らない
	//this.capture('lang_home_window.png');
	
		arr = this.evaluate(function(){
			//	Selectorで持ってきた<a>要素のhrefを抜き出す
			al = Array.prototype.slice.call(document.querySelectorAll('.course_title > a'));
			return  al.map(function(a){
				return a.getAttribute('href');
			});
		});
		require('utils').dump(arr);
});

//	まずは一つ取ってこれるように
casper.then(function(){
	var i = 0;
	arr.forEach(function(a){
		casper.start(a, function(){
			this.capture(i+'.png');
		});
		i++;
	});
});

casper.run();
