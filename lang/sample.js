casper = require('casper').create();
 
 //指定のURLへ遷移する
 casper.start('http://www.yahoo.co.jp', function() {
     //サービスメニューのリンク一覧を取得(配列として取得)
		     var AnchorArrays = this.getElementsAttribute('#yahooservice > ul > li > a', 'href');
				     //取得した内容を表示する
						     require('utils').dump(AnchorArrays);
								 });
								  
									//処理の実行
									casper.run();
