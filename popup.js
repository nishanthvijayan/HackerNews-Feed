
var res;
var req;



function putdata(res)
{ 
  $.each(res.result[0].Posts , function(i,post){ 
     $("body").append('<a href='+'"'+post[1]+'"'+'><li>'+(i+1)+".  "+post[0]+'</li></a>');
    });

  

}


function fetchdata(){
  
  req =  new XMLHttpRequest();
  req.open("GET",'http://hackernewslatestapi.herokuapp.com/',true);
  req.send();
  req.onload = function(){
  res = JSON.parse(req.responseText);
  putdata(res);
  };

}


$(document).ready(function(){

  fetchdata();

  $("body").on('click',"a", function(){
       chrome.tabs.create({url: $(this).attr('href')});
       return false;
     });

});

