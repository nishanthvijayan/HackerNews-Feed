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
    res = JSON.parse(req.responseText);
    imgToggle();
    putdata(res);
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
  
  fetchdata();
  // update feeds every 5 minutes
  setInterval(function(){
    fetchdata() }, 300000)


  //sends "link to be opened" to main.js
  $("body").on('click',"li", function(){
    self.port.emit("postClicked",$(this).attr('data'));
    return false;
  });
  
  $("body").on('click',"a", function(){
    self.port.emit("postClicked",$(this).attr('data'));
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

