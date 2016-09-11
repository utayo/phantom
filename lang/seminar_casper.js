var casper = require('casper').create({
	clientScripts: ['./jquery.js']
});

var seminar_addr = 'http://vu.sfc.keio.ac.jp/project/html/2016s/index_ja.html';

var fs = require('fs');
var arr = [];


casper.on('get_rdf', function(addr, num){
		data = this.evaluate(function(){
			this.echo('aaaaaaaaaaa');
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
					if(th.nextElementSibling.innerText!=""){
					switch(th.innerText){
						case '開講日程':
							//obj["schedule"] = t.querySelector('td').innerText;
							obj["time"] = th.nextSibling.innerText;
							break;
						case '担当教員':
							obj["teacher"] = th.nextSibling.innerText;
							break;
						case '開講場所':
							obj["campas"] = th.nextElementSibling.innerText;
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
					}
					});
				}			
			});
			//シラバス側の取得
			//概要（＾ω＾）
			summary = table_list[3].querySelector('tbody tr td');
			
			obj["summary"] = summary.innerText;

			//シラバスの他の要素
			if(table_list.length>4){
			sylb_area = Array.prototype.slice.call(table_list[4].querySelectorAll('tbody tr'));
			obj["method"] = sylb_area[2].innerText;
			obj["schedule"] = sylb_area[10].innerText;
			}
			return obj;	//	返却
		});
		
		var rdf_elements = [
			"ja_name",
			"lecture_id",
			"time",
			"teacher",
			"campas",
			"course_type",
			"homepage"
		];

		var rdf_header = "@prefix sylbank: <http://example.com/syllabus:> .\n @prefix lect: <http://example.com/lecture_vocabulary:> .\n\n";
		var rdf = "";
		rdf += "<http://example.com/lecture#1>\n";
		rdf_elements.forEach(function(el){
			if(data[el]){
				if(el=="ja_name"){
					rdf += '\tlect:name "' + data[el] + '"@ja;\n';
				}else{
					rdf += '\tlect:' + el + ' "' + data[el] + '";\n';
				}
			}
		});

		this.echo(Object.keys(data));
		var lec = 'syllabus/seminar/' + data["lecture_id"] + '/lecture.ttl';
	
		var sylb_elements = [
			"summary",
			"method",
			"schedule"
		];
		
		var sylb_rdf_header = "@prefix sylbank: <http://example.com/syllabus:> .\n@prefix lect: <http://example.com/lecture_vocabulary:> .\n\n"
		var sylb_rdf = "";
		sylb_rdf += '\tlect:lecture_id"' + data["lecture_id"] + '";\n';
		sylb_elements.forEach(function(el){
			if(data[el])
				sylb_rdf += '\tsylb:' + el + ' "' + data[el] + '";\n';
		});
	
		var syl = 'syllabus/seminar/' + data["lecture_id"] + '/syllabus.ttl';
		this.echo(sylb_rdf);

		if(!list[data["lecture_id"]]){
			fs.write(lec, rdf_header + rdf, 'w');
			fs.write(syl, sylb_rdf_header + sylb_rdf, 'w');
			list[data["lecture_id"]] = true;
		}else{
			fs.write(lec, rdf, 'a');
			fs.write(syl, sylb_rdf, 'a');
		}
});

casper.on('get_syllabus', function(num){
	var url = arr[num];
	this.echo('get address : ' + url);
	this.open(url).then(function(){
		casper.emit('get_rdf', url, num);
		casper.then(
			function(){
				this.echo('次'+num);
				if(num+1<arr.length&&num<3){
					casper.emit('get_syllabus', num+1);
				}
			}
		);
	});
});

casper.on('get_addr', function(){
	casper.start(seminar_addr,
		function(){
			this.echo(seminar_addr);

			arr = this.evaluate(function(){
				var table = document.querySelector('table');
				var a_list = Array.prototype.slice.call(table.querySelectorAll('a'));
				var new_arr = [];
				a_list.map(function(a){
					if(a.href.match(/^http:\/\/vu.sfc.keio.ac.jp\/course2014\/summary\//)){
						new_arr[new_arr.length] = a.href;
					}
				});
				return new_arr;
			});
			casper.then(function(){
				casper.emit('get_syllabus', 0);
			});
		}
	);
});

casper.emit('get_addr');
casper.run();