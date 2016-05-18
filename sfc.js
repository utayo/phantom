var page = reqire('webpage').create();
var fs = require('fs');

page.onInitialized = function(){
	page.evaluate(function(){
		document.addEventListener('DOMContentLoaded'), function(){
			window.callPhantom('DOMContentLoaded');
		}, false);
	});
};

var funcs = function(funcs){
	this.funcs = funcs;
	this.init();
};

funcs.prototype = {
	init: function(){
		var self = this;
		page.onCallback = function(data){
			if(data === 'DOMContentLoaded') 
				self.next();
		}
	},

	next: function(){
		var func = this.funcs.shift();
		if(func !== undefined){
			func();
		}else{
			page.onCallback = function(){};
		}
	}
};

new funcs([
	function(){
		console.log('Login');
		page.open('https://twitter.com/login/');
	},
	function(){
		console.log('Insert Password');
		page.evaluate(function(){
			document.querySelector('[name="session[username_or_email]"]').value = 'poyonex_bot';
			document.querySelector('[name="session[password]"]').value = 'Juda2692';
			document.querySelector('form').submit(); 
		});
	},
	function(){
		page.render('mypage.png');

		phantom.exit();
	}
]).next();
