
var res;
var req;



function putdata(res)
{ 
  $.each(res.result[0].Posts , function(i,post){ 
     $("body").append('<a data='+'"'+post[1]+'"'+'><li>'+(i+1)+".  "+post[0]+'</li></a>');
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
  // update feeds every 5 minutes
  setInterval(function(){
    $("a").remove();
    fetchdata() }, 300000)


//sends "link to be opened" to main.js
  $("body").on('click',"a", function(){
       self.port.emit("postClicked",$(this).attr('data'));
       return false;
     });


});

