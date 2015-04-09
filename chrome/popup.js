
var res;
var req;
var htmlString;
var now;

function putdata(res)
{ 
  htmlString = "";
  $.each(res.result[0].Posts , function(i,post){ 
     htmlString +='<a href='+'"'+post[1]+'"'+'><li>'+(i+1)+".  "+post[0]+'</li></a>';
    });
  $("body").append(htmlString);
  
}


function fetchdata(){
  
  req =  new XMLHttpRequest();
  req.open("GET",'http://hackernewslatestapi.herokuapp.com/',true);
  req.send();
  req.onload = function(){
	  res = JSON.parse(req.responseText);
	  putdata(res);

	  localStorage.cache = htmlString;
	  localStorage.time = now;
  };

}


$(document).ready(function(){

  now = (new Date()).getTime()/1000;
  if(!localStorage.cache || now - parseInt(localStorage.time) > 5*60){
    // cache is old or not set
    fetchdata();
  }
  else{
    // cache is fresh
    setTimeout(function(){$("body").append(localStorage.cache)},1000);
  }


  $("body").on('click',"a", function(){
       chrome.tabs.create({url: $(this).attr('href')});
       return false;
     });

});

