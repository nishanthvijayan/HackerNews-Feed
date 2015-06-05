function putdata(res)
{ 
  // removes the present posts
  $("#content > li").remove();
  $("hr").remove();
  $("span").remove();
  
  $.each(res,function(i,post){

    var node = document.createElement("li");
    node.data = post.url;

    var nameText = document.createTextNode((i+1)+".  "+post.title);
    var nameNode = document.createElement("h3");
    nameNode.appendChild(nameText);
    node.appendChild(nameNode);

    node.appendChild(document.createElement("br"));

    scoreText=document.createTextNode('');
    if (post.points=='1')var scoreText = document.createTextNode('( '+post.points + ' point )');
    else if(post.points!=null) var scoreText = document.createTextNode('( '+post.points + ' points )');
    var scoreNode = document.createElement("h5");
    scoreNode.appendChild(scoreText);
    scoreNode.data = "https://news.ycombinator.com/item?id="+post.id;
    node.appendChild(scoreNode);
    
    document.getElementById("content").appendChild(node);
    document.getElementById("content").appendChild(document.createElement("hr"));
  });
}

function fetchdata(){
  
  imgToggle();
  req =  new XMLHttpRequest();
  req.open("GET",'http://node-hnapi.herokuapp.com/news',true);
  req.send();
  req.onload = function(){
    res = JSON.parse(req.responseText);
    imgToggle();
    putdata(res);
    $("footer").append('<span>&nbsp;&nbsp;&nbsp;<iframe src="https://ghbtns.com/github-btn.html?user=nishanthvijayan&type=follow&count=false" frameborder="0" scrolling="0" width="170px" height="20px"></iframe></span>');
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
    self.port.emit("postClicked",this.data);
    return false;
  });
  
  $("body").on('click',"h5", function(){
    self.port.emit("postClicked",this.data);
    return false;
  });
  
  $("body").on('click',"a", function(){
    self.port.emit("postClicked",$(this).attr('data'));
    return false;
  });
  
  $("body").on('click',".gh-btn", function(){
    self.port.emit("postClicked", "https://github.com/nishanthvijayan/HackerNews-Feed");
  });
  
  // this makes sure that fetchdata() is called only when the icon
  // is reload icon and not when it is the loading gif.
  $("body").on('click',".loading", function(){
    src = $('.loading').attr('src');
    if(src=="refresh-white.png") fetchdata();
  });

});

