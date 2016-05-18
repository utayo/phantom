var casper = require('casper').create();

casper.start('http://vu.sfc.keio.ac.jp/course_u/data/2016/title14.html', function(){
	this.echo("Home Window");
	//	とりあえず画面保存してみる
	this.capture('home.png');
	
	//	SFCの授業を取りに行ってみる
	this.then(function(){
		this.fill('form', { c_sem: '1' }, true);
	});
});

casper.then(function(){
	this.echo('After Window');
	this.capture('after.png');
});

casper.run();
