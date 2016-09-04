function putdata(res)
{ 
  // removes the present posts
  $("#content > li").remove();
  $("#content > hr").remove();

  $.each(res,function(i,post){

    var node = document.createElement("li");

    var nameText = document.createTextNode((i+1)+".  "+post.title);
    var nameNode = document.createElement("h3");
    if(post.url.substring(0,4) == "item")nameNode.data = 'https://news.ycombinator.com/'+post.url;
    else nameNode.data = post.url;
    nameNode.appendChild(nameText);
    node.appendChild(nameNode);

    if(post.type=='link'){
      var domainText = document.createTextNode('('+post.domain+')');
      var domainNode = document.createElement("span");
      domainNode.className = "detail";
      domainNode.appendChild(domainText);
      node.appendChild(domainNode);
      node.appendChild(document.createElement("br"));
    }
    node.appendChild(document.createElement("br"));

    score = (post.points!=null) ? post.points + '▲ ' : '';
    comments = (post.comments_count=='1') ? ' • '+post.comments_count + ' comment ' : ' • '+post.comments_count + ' comments ';
    detailText=document.createTextNode(score +' '+comments);
    
    var scoreNode = document.createElement("h5");
    scoreNode.appendChild(detailText);
    scoreNode.data = "https://news.ycombinator.com/item?id="+post.id;
    scoreNode.className = "detail";
    node.appendChild(scoreNode);

    var timeText = document.createTextNode(' | '+post.time_ago);
    var timeNode = document.createElement("span");
    timeNode.className = "detail";
    timeNode.appendChild(timeText);
    node.appendChild(timeNode);
    node.appendChild(document.createElement("br"));
    
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
    self.port.emit("resizePanel");
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
  if(src=="img/refresh-white.png") $(".loading").attr("src","img/ajax-loader.gif");
  else $(".loading").attr("src","img/refresh-white.png");
}

$(document).ready(function(){
  
  fetchdata();
  // update feeds every 5 minutes
  setInterval(function(){
    fetchdata() }, 300000)


  //sends "link to be opened" to main.js
  $("body").on('click',"li > h3", function(){
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
    if(src=="img/refresh-white.png") fetchdata();
  });

	$("body").on('click',".up-btn", function(){
    window.scrollTo(0, 0);
  });

  addEventListener('scroll', function(){
    if($(".up-btn").css("display")=="none")$(".up-btn").show();
  });

});

