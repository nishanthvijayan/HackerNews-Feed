function putdata(res)
{ 
  
  // removes the present posts
  $(".content > li").remove();
  $("hr").remove();
  
  $.each(res,function(i,post){
    $(".content").append('<li data='+'"'+post.url+'"'+'><h3>'+(i+1)+".  "+post.title+'<h3><br></li><hr>');
  });
}

function fetchdata(){
  
  imgToggle();
  req =  new XMLHttpRequest();
  req.open("GET",'http://node-hnapi.herokuapp.com/news',true);
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

	setTimeout(function(){
    $("footer").prepend('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span><iframe src="https://ghbtns.com/github-btn.html?user=nishanthvijayan&repo=hackernews-feed&type=star&count=true" frameborder="0" scrolling="0" width="100px" height="20px"></iframe></span>');
  },1000);

});

