function putdata(res)
{ 
  // removes the present posts
  $("#content > li").remove();
  $("#content > hr").remove();

  $.each(res,function(i,post){

    var node = document.createElement("li");

    var nameText = document.createTextNode((i+1)+".  "+post.title);
    var nameNode = document.createElement("h3");
    nameNode.data = post.url;
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
    var timeNode = document.createElement("h5");
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

  $("body").on('click',"li > h3", function(){
    chrome.tabs.create({url: this.data});
    return false;
  });

  $("body").on('mousedown',"li > h3", function(e){
  	if( e.which == 2 ) {
  		chrome.tabs.create({url: this.data});
   	}
    return false;
  });
  
  $("body").on('click',"h5", function(){
    chrome.tabs.create({url: this.data});
    return false;
  });

  $("body").on('mousedown',"h5", function(e){
  	if( e.which == 2 ) {
  		chrome.tabs.create({url: this.data});
   	}
    return false;
  });

  $("body").on('click',"header > h2", function(){
    chrome.tabs.create({ url: 'https://news.ycombinator.com/' });
    return false;
  });

  $("body").on('mousedown',"header > h2", function(e){
  	if( e.which == 2 ) {
  		chrome.tabs.create({ url: 'https://news.ycombinator.com/' });
   	}
    return false;
  });

  $("body").on('click',".gh-btn", function(){
   	chrome.tabs.create({url: "https://github.com/nishanthvijayan/HackerNews-Feed"});
    return false;
  });

  $("body").on('mousedown',".gh-btn", function(e){
  	if( e.which == 2 ) {
   		chrome.tabs.create({url: "https://github.com/nishanthvijayan/HackerNews-Feed"});
   	}
    return false;
  });




  // this makes sure that fetchdata() is called only when the icon
  // is reload icon and not when it is the loading gif.
  $("body").on('click',".loading", function(){
    src = $('.loading').attr('src');
    if(src=="refresh-white.png") fetchdata();
  });

});

