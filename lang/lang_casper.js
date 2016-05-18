var casper = require('casper').create({clientScripts: ['./jquery.js']});
var arr = [];

casper.start('http://vu.sfc.keio.ac.jp/course_u/data/2016/csec14_3.html',function(){
	this.echo("Language Home Window");
	//	くっそ重いので作らない
	//this.capture('lang_home_window.png');
	/*
	arr = this.evaluate(function(){
		return Array.prototype.forEach.call(
			document.querySelectorAll('div.course_title a'),
			function(node){
				console.log(node.href);
				node.href;
		});
	});
	this.echo(arr);
	*/
	//this.evaluate(function(){
		arr = this.evaluate(function(){
			al = Array.prototype.slice.call(document.querySelectorAll('.course_title > a'));
			return  al.map(function(a){
				return a.getAttribute('href');
			});
		});
		require('utils').dump(arr);
	//});
	//require('utils').dump(arr);
});


casper.then(function(){
	casper.start(arr[0], function(){
		this.capture('asdf.png');
	});
});
casper.run();
