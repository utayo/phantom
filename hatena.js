var page = require('webpage').create();
var fs   = require('fs');

// ページが読み込まれたら page.onCallback を呼ぶ
page.onInitialized = function() {
	page.evaluate(function() {
		document.addEventListener('DOMContentLoaded', function() {
			window.callPhantom('DOMContentLoaded');
		}, false);
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

// 順次実行する関数
new funcs([
	function() {
		console.log('ログイン処理');
		page.open('https://twitter.com/login/'); // 次ページヘ
	},
	function() {
		console.log('ログイン画面');
		page.evaluate(function() {
			document.querySelector('.js-username-field').value = 'poyonex_bot';
			document.querySelector('.js-password-field').value = 'Juda2692';
			document.querySelector('form').submit(); // 次ページヘ
		});
		page.render('twi_login.png');
	},
	/**
	function() {
		console.log('ログイン中画面');
		// 自動で次ページヘ
	},
	**/
	function() {
		console.log('ログイン後画面');
		page.render('twi.png');
		// ログイン後の HTML を書き出し
		var html = page.evaluate(function() {
			return document.getElementsByTagName('html')[0].innerHTML;
		});
		fs.write('mypage.html', html, 'w');
		phantom.exit();
	}
]).next();
