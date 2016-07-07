var casper = require('casper').create({
	clientScripts: ['./jquery.js']
});

var data = [];
var fs = require('fs');

casper.start(
	'https://vu.sfc.keio.ac.jp/course2014/summary/syll_view_c.cgi?yc=2016_25037&ks=B2001', 
	function(){
		data = this.evaluate(function(){
			var obj = {};	//	結果出力用
			//	title, lecture_id
			arr = Array.prototype.slice.call(document.querySelectorAll('.ctitle14'));
			a = arr[0];
			obj["lecture_id"] = a.querySelector('.sm').innerText;
			a.querySelector('.sm').remove();
			a.querySelector('br').remove();
			obj["ja_name"] = a.innerText;
			
			//	table要素から取得したい

			return obj;	//	返却
		});
		//console.log(data);
		//require('utils').dump(data);
		var rdf = "<http://example.com/lecture#1>\n";
		rdf += '\tlecb:name "' + data["ja_name"] + '"@ja;\n';
		rdf += '\tlecb:lecture_id "' + data["lecture_id"] + '";\n';
		console.log(rdf);
		fs.write('title.txt', rdf, 'a');
		
		
});

casper.run();
