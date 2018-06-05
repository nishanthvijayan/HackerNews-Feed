var $ = require("jquery");

var clearPosts = function(){
  $('#content > li').remove();
  $('#content > hr').remove();
};


var appendPostToList = function(post){
  document.getElementById('content').appendChild(post);
  document.getElementById('content').appendChild(document.createElement('hr'));
};


var renderTitle = function(index, post){
  var titleNode = document.createElement('h3');
  titleNode.data = (post.url.substring(0, 4) == 'item') ? 'https://news.ycombinator.com/' + post.url : post.url;

  var titleText = document.createTextNode((index + 1) + '.  ' + post.title);
  titleNode.appendChild(titleText);

  return titleNode;
};


var renderDomainLink = function(post){
  var domainLinkNode = document.createElement('span');
  domainLinkNode.className = 'detail';

  var domainLinkText = document.createTextNode('(' + post.domain + ')');
  domainLinkNode.appendChild(domainLinkText);

  return domainLinkNode;
}


var renderDetails = function(post){
    var detailsNode = document.createElement('h5');

    var score = (post.points != null) ? post.points + '▲ ' : '';
    var comments = (post.comments_count == '1') ? ' • ' + post.comments_count + ' comment ' : ' • ' + post.comments_count + ' comments ';
    var detailsText = document.createTextNode(score + ' ' + comments);

    detailsNode.appendChild(detailsText);
    detailsNode.data = 'https://news.ycombinator.com/item?id=' + post.id;
    detailsNode.className = 'detail';

    return detailsNode;
};


var renderTime = function(post){
  var timeNode = document.createElement('span');
  timeNode.className = 'detail';

  var timeText = document.createTextNode(' | ' + post.time_ago);
  timeNode.appendChild(timeText);

  return timeNode;
};


function renderPosts(posts)
{
  clearPosts();

  $.each(posts, function(index, post){
    var node = document.createElement('li');
    node.appendChild(renderTitle(index, post));

    if(post.type == 'link'){
      node.appendChild(renderDomainLink(post));
      node.appendChild(document.createElement('br'));
    }

    node.appendChild(document.createElement('br'));
    node.appendChild(renderDetails(post));
    node.appendChild(renderTime(post));
    node.appendChild(document.createElement('br'));

    appendPostToList(node);
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
	  renderPosts(res);

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
    renderPosts(JSON.parse(localStorage.cache));
    if(localStorage.scrollPosition){
      window.scroll(0, localStorage.scrollPosition);
    }
  }

  addEventListener('scroll', function(){
    localStorage.scrollPosition = window.scrollY;
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

  $("body").on('click',".up-btn", function(){
    window.scroll(0,0);  
  });


  // this makes sure that fetchdata() is called only when the icon
  // is reload icon and not when it is the loading gif.
  $("body").on('click',".loading", function(){
    src = $('.loading').attr('src');
    if(src=="refresh-white.png") fetchdata();
  });

});

