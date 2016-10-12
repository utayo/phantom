var casper = require('casper').create({
    clientScripts: ['./jquery.js']
});

var fs = require('fs');

var index = 'https://gslbs.adst.keio.ac.jp/menu/Slt_Kamoku.php';
var trr = "";


casper.on('get_syllabus_link', function(addr){
    casper.then(function(){
        var addr_list = Array.prototype.slice.call(document.querySelectorAll('ListTbl_in tr'));
        this.echo(addr_list);
        casper.capture("hoge.png");
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
    this.echo(this.getHTML());
    this.echo(this.getCurrentUrl());
    //this.onclick('.ListTbl_in tr td:nth-of-type(5)');
    //this.evaluate(function(){
    trr = this.evaluate(function(){
        var tr = Array.prototype.slice.call(document.querySelectorAll('.ListTbl_in tbody tr a'));
        
        /*
        document.form1.action = "https://gslbs.adst.keio.ac.jp/lecture/View_Lecture.php";
        document.form1.hid_lessoncd.value		 = '16505';
        document.form1.hid_tourokubango.value	 = '19367';
        document.form1.hid_nowpage.value = 0;
        document.form1.submit();
        */
        tr[1].click();
        return tr[1].onclick;
    });
}).wait(10).then(function(){
    this.capture('hogea.png');
    this.evaluate(function(){
        document.querySelector('.back a').click();
    });
    //back.click();
}).wait(100).then(function(){
    this.echo('2nd');
    this.capture('menu.png');
});



casper.then(function(){
    this.echo("ho-ho"+trr);
    this.echo("hogw");
    this.echo(this.getCurrentUrl());
    casper.capture("aaaa.png");
});

casper.run();