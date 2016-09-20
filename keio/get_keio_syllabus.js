var casper = require('casper').create({
    clientScripts: ['./jquery.js']
});

var fs = require('fs');

var index = 'https://gslbs.adst.keio.ac.jp/menu/Slt_Kamoku.php';

casper.on('get_syllabus_link', function(addr){
    casper.then(function(){
    var addr_list = Array.prototype.slice.call(document.querySelectorAll('ListTbl_in tr'));
    this.echo(addr_list);
         casper.capture("hoge.ong");
    });
    

});

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
    /*
    var tr_list = this.evaluate(function(){
        //スペルちげえでやんの
        var tr = document.querySelectorAll('.ListTbl_in tbody tr a');
        return tr[1];
    });

    this.echo(tr_list.innerText);
    */
    this.echo(this.getCurrentUrl());
    //this.onclick('.ListTbl_in tr td:nth-of-type(5)');
    //this.evaluate(function(){
    this.evaluate(function(){
        document.form1.action = "https://gslbs.adst.keio.ac.jp/lecture/View_Lecture.php";
        document.form1.hid_lessoncd.value		 = '16505';
        document.form1.hid_tourokubango.value	 = '19367';
        document.form1.hid_nowpage.value = 0;
        document.form1.submit();
    });
        
    //});
    
    //casper.capture("mita.png");
    //casper.emit('get_syllabus_link', index);
});

casper.then(function(){
    this.echo("hogw");
    this.echo(this.getCurrentUrl());
    casper.capture("mita.png");
});

casper.run();