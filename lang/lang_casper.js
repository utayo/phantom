var casper = require('casper').create({clientScripts: ['./jquery.js']});
var arr = [];
var url_num = 0;

var fs = require('fs');
var list = {};

casper.on('hoge', function(addr, num){
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
		
		/*
		fs.unlink('./lang_ttl.ttl', function(err){
			console.log('Delete');
		});
		*/
		//console.log(data);
		//require('utils').dump(data);
		var rdf_header = "@prefix sylbank: <http://example.com/syllabus:> .\n @prefix lect: <http://example.com/lecture_vocabulary:> .\n\n";
		var rdf = "";
		rdf += "<http://example.com/lecture#1>\n";
		rdf += '\tlect:name "' + data["ja_name"] + '"@ja;\n';
		rdf += '\tlect:lecture_id "' + data["lecture_id"] + '";\n';
		rdf += '\tlect:time "' + data["time"] + '";\n';
		rdf += '\tlect:teacher "' + data["teacher"] + '";\n';
		rdf += '\tlect:campas "' + data["campas"] + '";\n';
		rdf += '\tlect:course_type "' + data["course_type"] + '";\n';
		rdf += '\tlect:homepage "' + data["homepage"] + '";\n';
		//console.log(rdf);
		var lec = 'syllabus/' + data["lecture_id"] + '/lecture.ttl';
		
		var sylb_rdf_header = "@prefix sylbank: <http://example.com/syllabus:> .\n@prefix lect: <http://example.com/lecture_vocabulary:> .\n\n"
		var sylb_rdf = "";
		sylb_rdf += '\tlect:lecture_id"' + data["lecture_id"] + '"@ja;\n';
		sylb_rdf += '\tsylb:summary "' + data["summary"] + '";\n';
		sylb_rdf += '\tsylb:method "' + data["method"] + '";\n';
		sylb_rdf += '\tsylb:schedule "' + data["schedule"] + '";\n';
		var syl = 'syllabus/' + data["lecture_id"] + '/syllabus.ttl';
		//console.log(sylb_rdf);


		console.log(list[data["lecture_id"]]);
		if(!list[data["lecture_id"]]){
			fs.write(lec, rdf_header + rdf, 'w');
			fs.write(syl, sylb_rdf_header + sylb_rdf, 'w');
			list[data["lecture_id"]] = true;
		}else{
			fs.write(lec, rdf, 'a');
			fs.write(syl, sylb_rdf, 'a');
		}
});

casper.on('get_syllabus', function(){
	var url = arr[url_num];

	this.open(url).then(function(){
		url_num++;
		/*
		url_num++;
		casper.viewport(800, 800);
		this.capture('./syllabus/' + url_num + '/ss.png');
		var data = [];
		var fs = require('fs');

		data = this.evaluate(function(){
			arr = Array.prototype.slice.call(document.querySelectorAll('table'));
			return arr.map(function(a){
				return a.innerHTML;
			});
		});
		fs.write('./syllabus/' + url_num + '/table.txt', data, 'a');

		if(url_num<arr.length&&url_num<3){
			casper.emit('get_syllabus');
		}
		*/
		casper.emit('hoge', url, url_num);
		if(url_num<arr.length&&url_num<6){
			casper.emit('get_syllabus');
		}else{
			console.log(Object.keys(list));
			console.log(Object.keys(list).length);
		}
	});
});

casper.start('http://vu.sfc.keio.ac.jp/course_u/data/2016/csec14_3.html',function(){
	this.echo("Language Home Window");
	//	くっそ重いので作らない
	//this.capture('lang_home_window.png');
	/*
	arr = this.evaluate(function(){
		return Array.prototype.forEach.call(
			document.querySelectorAll('div.course_title a'),
			function(node){
				console.log(node.href);
				node.href;
		});
	});
	this.echo(arr);
	*/
	//this.evaluate(function(){
		arr = this.evaluate(function(){
			al = Array.prototype.slice.call(document.querySelectorAll('.course_title > a'));
			return  al.map(function(a){
				return a.getAttribute('href');
			});
		});
		require('utils').dump(arr);

	//});
	//require('utils').dump(arr);
});


casper.then(function(){
	if(arr.length > 0){
		casper.emit('get_syllabus');
	}else{
		console.log('Not find');
	}
});



casper.run();