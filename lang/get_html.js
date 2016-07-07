var casper = require('casper').create({
	clientScripts: ['./jquery.js']
});

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
			
			obj["test"] = [];
			//	table要素から取得したい
			
			table_list = document.querySelectorAll('table');
			
			t_list = Array.prototype.slice.call(table_list[2].querySelectorAll('tbody tr'));
			t_list.map(function(t){
				if(t.querySelector('th')!=null){
					var th = t.querySelector('th').innerText;
					//obj["test"].push(th);
					if(th=='開講日程'){
						obj["schedule"] = t.querySelector('td').innerText;
					}else{
						obj["test"].push(t.querySelector('th').innerText);
					}

				}
			
			
			});
			return obj;	//	返却
		});

		//console.log(data);
		//require('utils').dump(data);
		var rdf = "<http://example.com/lecture#1>\n";
		rdf += '\tlecb:name "' + data["ja_name"] + '"@ja;\n';
		rdf += '\tlecb:lecture_id "' + data["lecture_id"] + '";\n';
		rdf += '\tlecb:schedule "' + data["schedule"] + '";\n';
		console.log(rdf);
		fs.write('title.txt', rdf, 'a');
		fs.write('hoge.txt', data["test"], 'a');
		//console.log(data["test"]);	
		console.log(data["schedule"]);
});

casper.run();
