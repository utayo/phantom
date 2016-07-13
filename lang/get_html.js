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
					var th_list = Array.prototype.slice.call(t.querySelectorAll('th'));
					//obj["test"].push(th);
					th_list.map(function(th){
					switch(th.innerText){
						case '開講日程':
							//obj["schedule"] = t.querySelector('td').innerText;
							obj["time"] = th.nextSibling.innerText;
							break;
						case '担当教員':
							obj["teacher"] = th.nextSibling.innerText;
							break;
						case '開講場所':
							obj["campas"] = th.nextSibling.innerText;
							break;
						case '授業形態':
							obj["course_type"] = th.nextSibling.innerText;
							break;
						case '使用言語':
							obj["language"] = th.nextSibling.innerText;
							break;
						case '授業ホームページ':
							obj["homepage"] = th.nextSibling.innerText;
							break;
						default:
							obj["test"].push(th.innerText);
							break;
					}
					});
				}			
			});
			//シラバス側の取得
			//概要（＾ω＾）
			summary = table_list[3].querySelector('tbody tr td');
			
			obj["summary"] = summary.innerText;

			//シラバスの他の要素
			
			sylb_area = Array.prototype.slice.call(table_list[4].querySelectorAll('tbody tr'));
			obj["method"] = sylb_area[2].innerText;
			obj["schedule"] = sylb_area[10].innerText;

			return obj;	//	返却
		});

		//console.log(data);
		//require('utils').dump(data);
		var rdf = "";
		rdf += "@prefix sylbank: <http://example.com/syllabus#> .\n";
		rdf += "@prefix lecb: <http://example.com/lecture_vocabulary:> .\n\n";
		rdf += "<http://example.com/lecture#1>\n";
		rdf += '\tlecb:name "' + data["ja_name"] + '"@ja;\n';
		rdf += '\tlecb:lecture_id "' + data["lecture_id"] + '";\n';
		rdf += '\tlecb:time "' + data["time"] + '";\n';
		rdf += '\tlecb:teacher "' + data["teacher"] + '";\n';
		rdf += '\tlecb:campas "' + data["campas"] + '";\n';
		rdf += '\tlecb:course_type "' + data["course_type"] + '";\n';
		rdf += '\tlecb:homepage "' + data["homepage"] + '";\n';
		console.log(rdf);
		fs.write('lang_ttl.ttl', rdf, 'a');
		fs.write('hoge.txt', data["test"], 'a');
		console.log(data["test"]);
		console.log(data["schedule"]);
});

casper.run();
