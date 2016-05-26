var casper = require('casper').create({clientScripts: ['./jquery.js']});
var arr = [];
var url_num = 0;

casper.on('get_syllabus', function(){
	var url = arr[url_num];

	this.open(url).then(function(){
		url_num++;
		casper.viewport(800, 800);
		this.capture('./syllabus/' + url_num + '/ss.png');
		var data = [];
		var fs = require('fs');

		data = this.evaluate(function(){
			arr = Array.prototype.slice.call(document.querySelectorAll('table'));
			return arr.map(function(a){
				return a.innerHTML;
			});
		});
		fs.write('./syllabus/' + url_num + '/table.txt', data, 'a');

		if(url_num<arr.length&&url_num<3){
			casper.emit('get_syllabus');
		}
	});
});

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
	if(arr.length > 0){
		casper.emit('get_syllabus');
	}else{
		console.log('Not find');
	}
});



casper.run();
