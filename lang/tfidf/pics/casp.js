var casper = require('casper').create({clientScripts: ['./jquery.js']});

addres = "https://vu.sfc.keio.ac.jp/course2014/summary/syll_view_c.cgi?yc=2016_25328&ks=C2015";

casper.on('getPics', function(addr){
	casper.start(addr,
	function(){
		casper.viewport(700, 700);
		this.open(addr).then(function(){
			//this.capture('a.png');
			this.captureSelector('b.png', "body p:nth-child(4)");
		});
	});
});

casper.emit('getPics', addres);

casper.run();

var arr = [];
var url_num = 0;
var files = 0;

var addr_list = [
	/**/ 
	'http://vu.sfc.keio.ac.jp/course_u/data/2016/csec14_2.html',
	'http://vu.sfc.keio.ac.jp/course_u/data/2016/csec14_3.html',
	'http://vu.sfc.keio.ac.jp/course_u/data/2016/csec14_4.html',
	'http://vu.sfc.keio.ac.jp/course_u/data/2016/csec14_5.html',
	'http://vu.sfc.keio.ac.jp/course_u/data/2016/csec14_6.html',
	'http://vu.sfc.keio.ac.jp/course_u/data/2016/csec14_7.html',
	'http://vu.sfc.keio.ac.jp/course_u/data/2016/csec14_8.html',
	'http://vu.sfc.keio.ac.jp/course_u/data/2016/csec14_9.html',
	'http://vu.sfc.keio.ac.jp/course_u/data/2016/csec14_10.html',
	'http://vu.sfc.keio.ac.jp/course_u/data/2016/csec14_11.html',
	'http://vu.sfc.keio.ac.jp/course_u/data/2016/csec14_12.html',
	'http://vu.sfc.keio.ac.jp/course_u/data/2016/csec14_13.html',
	'http://vu.sfc.keio.ac.jp/course_u/data/2016/csec14_15.html'

];

var fs = require('fs');
var list = {};

casper.on('hoge', function(addr, num){
	casper.start(addr,
	function(){
		id = this.evaluate(function(){
			buf = document.querySelector('.sm').innerText;
			return buf;
		});
		this.echo(id);
		this.viewport(800, 800);
		this.open(addr).then(function(){
			//this.capture('a.png');
			if(!list[id]){
				this.captureSelector('img/'+id+'.png', "body");
				list[id] = true;
			}
			//this.captureSelector('img/'+id+'.png', "body p:nth-child(4)");
		});
	});
});

casper.on('get_syllabus', function(){
	var url = arr[url_num];
	//this.echo(url_num);
	this.open(url).then(function(){
		casper.emit('hoge', url, url_num);

		casper.then(function(){
		this.echo('次'+(url_num+1));
		url_num++;
		if(url_num<arr.length&&url_num<10000){
			casper.emit('get_syllabus');
		}else{
			//console.log(Object.keys(list));
			//console.log(Object.keys(list).length);
			//casper.emit('aaa');
		}
		});
	});
});

casper.on('aaa', function(){
	console.log(Object.keys(list));
	this.echo('総ファイル数: ' + files);
});

casper.on('get_addr', function(n){
casper.start(addr_list[n],
	function(){
	this.echo(addr_list[n]);
	this.echo("Language Home Window");
		var new_arr = this.evaluate(function(){
			al = Array.prototype.slice.call(document.querySelectorAll('.course_title > a'));
			return  al.map(function(a){
				return a.getAttribute('href');
			});
		});
		require('utils').dump(new_arr);
		
		arr = arr.concat(new_arr);
		if(n+1<addr_list.length){
			casper.emit('get_addr', n+1);
		}else{
			casper.emit('get_syllabus');
		}
		this.echo(arr.length);
	//});
	//require('utils').dump(arr);
});
});

casper.emit('get_addr', 0);
//casper.emit('hoge', addres, 0);

casper.run();
