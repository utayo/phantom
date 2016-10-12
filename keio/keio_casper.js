var casper = require('casper').create({
    clientScripts: ['./jquery.js']
});

var fs = require('fs');
var index = 'https://gslbs.adst.keio.ac.jp/menu/Slt_Kamoku.php';
var aList;

casper.on('get_syllabus', function(list, i){
    var a = list[i];
    this.echo(i+":"+a);
    /*
    this.then(function(){
        a.click();
    })
    
    this.then(function(){
        
        this.evaluate(function(){
            this.capture('png/'+i+'.png');
            document.querySelector('.back a').click();
        });
    });
    */
    if(list.length-1>i) casper.emit('get_syllabus', list, i+1);
    
});

casper.on('get_syllabus_list', function(){
    this.echo('get link');
    var addr_list = this.evaluate(function(){
        var a_list = Array.prototype.slice.call(document.querySelectorAll('.ListTbl_in tbody tr a'));
        
        return a_list.map(function(a){
            if(a.href!="") return a;
            return false;
        });
        
        //return a_list;
    });
    addr_list = Array.prototype.slice.call(addr_list);

    addr_list.map(function(v, i){
        if(!v.href){
            addr_list.splice(i, 1);
        }
    });
    this.echo(addr_list);
    casper.emit('get_syllabus', addr_list, 0);
});

casper.on('move_pages', function(){
    this.emit('get_syllabus_list');
    var next = "aaa";
    this.then(function(){
        next = this.evaluate(function(){
            var nList = Array.prototype.slice.call(document.querySelectorAll('.PageListTbl a'));
            if(nList[nList.length-1].innerText=='次へ→'){
                nList[nList.length-1].click();
            }
            return nList[nList.length-1];
        });
    }).wait(10).then(function(){
        this.capture('next.png');
        this.echo(next.innerText);
        if(next.innerText=='次へ→'){
            this.emit('move_pages');
        }else{
            this.echo('finish');
        }
    });
});

casper.start(index,
    function(){
        this.echo('start');
        this.evaluate(function(){
            document.querySelector('#chk_campus0').checked = true;
            document.querySelector('#chk_gakubu02').checked = true;
            document.querySelector('#chk_time0').checked = true;
            document.form1.submit();
        });
    }
);

casper.then(function(){
    casper.emit('move_pages');
});

casper.run();
