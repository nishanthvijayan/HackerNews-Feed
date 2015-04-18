function putdata(res)
{ 
  
  // removes the present posts
  $(".content > li").remove();
  $("hr").remove();
  
  for (i = 0; i < 20; i++){ 
    
    post = res.result[0].Posts[i];
    $(".content").append('<li data='+'"'+post[1]+'"'+'><h3>'+(i+1)+".  "+post[0]+'<h3><br></li><hr>');
  
  }
  
}


function fetchdata(){
  
  imgToggle();
  req =  new XMLHttpRequest();
  req.open("GET",'http://hackernewslatestapi.herokuapp.com/',true);
  req.send();
  req.onload = function(){
	  imgToggle();

    res = JSON.parse(req.responseText);
	  putdata(res);

    now = (new Date()).getTime()/1000;
	  localStorage.cache  = req.responseText;
	  localStorage.time = now;
  };
  req.onerror = function(){
    imgToggle();
  }


}

// toggles between the loading gif,reload icon.
function imgToggle(){
  src = $('.loading').attr('src');
  if(src=="refresh-white.png") $(".loading").attr("src","ajax-loader.gif");
  else $(".loading").attr("src","refresh-white.png");
}

$(document).ready(function(){

  now = (new Date()).getTime()/1000;
  if(!localStorage.cache || now - parseInt(localStorage.time) > 5*60){
    // cache is old or not set
    fetchdata();
  }
  else{
    // cache is fresh
    putdata(JSON.parse(localStorage.cache));
    if(localStorage.scrollTop){
      document.body.scrollTop = localStorage.scrollTop;
    }
  }

  addEventListener('scroll', function(){
    localStorage.scrollTop = document.body.scrollTop;
  });

  $("body").on('click',"li", function(){
       chrome.tabs.create({url: $(this).attr('data')});
       return false;
     });

  $("body").on('click',"a", function(){
     chrome.tabs.create({url: $(this).attr('data')});
     return false;
   });

  // this makes sure that fetchdata() is called only when the icon
  // is reload icon and not when it is the loading gif.
  $("body").on('click',".loading", function(){
    src = $('.loading').attr('src');
    if(src=="refresh-white.png") fetchdata();
  });

});

