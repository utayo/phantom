var page = require('webpage').create();

page.open('https://gslbs.adst.keio.ac.jp/', function(status){
	if(status==='success'){
		
		page.render('google.png');
		var title = page.evaluate(function(){
			var title = document.title;

			return title;
		});
		page.render('twi_login.png');

		console.log(title);
	}
	phantom.exit();
});
