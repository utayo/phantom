var casper = require('casper').create({
    clientScripts: ['./jquery.js']
});

var fs = require('fs');

var index = 'https://gslbs.adst.keio.ac.jp/menu/Slt_Kamoku.php';

casper.start(index,
    function(){
        //var mita = document.querySelector("#chk_campus0");

        this.evaluate(function(){
            document.querySelector('#chk_campus0').checked = true;
            document.form1.submit();
        });
    }
);

casper.then(function(){
    var table = this.evaluate(function(){
            //スペルちげえでやんの
            return document.querySelector('#serch_word');
        });
        this.echo(table.innerText);
        casper.capture("mita.png");
});

casper.run();