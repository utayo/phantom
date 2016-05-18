var page = require('webpage').create();


page.onInitialized = function(){
	page.evaluate(function(){
		document.addEventListener('DOMContentLoaded', function(){
			window.callPhantom('DOMContentLoaded');
		},false);
	});
};


// ページが読み込まれたら登録した関数の配列を順次実行してくれるクラス
var funcs = function(funcs) {
	this.funcs = funcs;
	this.init();
};
funcs.prototype = {
	// ページが読み込まれたら next() を呼ぶ
	init: function() {
		var self = this;
		page.onCallback = function(data){
			if (data === 'DOMContentLoaded') self.next();
		}
	},
	// 登録した関数の配列から１個取り出して実行
	next: function() {
		var func = this.funcs.shift();
		if (func !== undefined) {
			func();
		} else {
			page.onCallback = function(){};
		}
	}
};


new funcs([
	function(){
		console.log('1st');
		//page.open('https://gslbs.adst.keio.ac.jp/');
		page.open('http://google.com', function(status){
			if(status==='success'){
				page.render('home.png');
				console.log('success');
			}
		});
	},
	function(){
		console.log('Exit PhantomJS');
		phantom.exit();
	}
]).next();
