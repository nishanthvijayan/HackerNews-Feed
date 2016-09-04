var clearPosts = function(){
  $("#content > li").remove();
  $("#content > hr").remove();
};

var appendPostToList = function(post){
  document.getElementById("content").appendChild(post);
  document.getElementById("content").appendChild(document.createElement("hr"));
};

var renderTitle = function(index, post){
  var titleNode = document.createElement("h3");
  titleNode.data = (post.url.substring(0, 4) == "item") ? 'https://news.ycombinator.com/' + post.url : post.url;

  var titleText = document.createTextNode((index + 1) + ".  " + post.title);
  titleNode.appendChild(titleText);

  return titleNode;
};

var renderDomainLink = function(post){
  var domainLinkNode = document.createElement("span");
  domainLinkNode.className = "detail";

  var domainLinkText = document.createTextNode('(' + post.domain + ')');
  domainLinkNode.appendChild(domainLinkText);

  return domainLinkNode;
}

var renderDetails = function(post){
    var detailsNode = document.createElement("h5");

    var score = (post.points != null) ? post.points + '▲ ' : '';
    var comments = (post.comments_count == '1') ? ' • ' + post.comments_count + ' comment ' : ' • ' + post.comments_count + ' comments ';
    var detailsText = document.createTextNode(score + ' ' + comments);

    detailsNode.appendChild(detailsText);
    detailsNode.data = "https://news.ycombinator.com/item?id=" + post.id;
    detailsNode.className = "detail";

    return detailsNode;
};

var renderTime = function(post){
  var timeNode = document.createElement("span");
  timeNode.className = "detail";

  var timeText = document.createTextNode(' | ' + post.time_ago);
  timeNode.appendChild(timeText);

  return timeNode;
};

function renderPosts(posts)
{
  clearPosts();

  $.each(posts, function(index, post){

    var node = document.createElement("li");
    node.appendChild(renderTitle(index, post));

    if(post.type == 'link'){
      node.appendChild(renderDomainLink(post));
      node.appendChild(document.createElement("br"));
    }

    node.appendChild(document.createElement("br"));

    node.appendChild(renderDetails(post));

    node.appendChild(renderTime(post));

    node.appendChild(document.createElement("br"));

    appendPostToList(node);
  });
}

function fetchdata(){
  toggleLoadingAnimation();
  req =  new XMLHttpRequest();
  req.open("GET", 'http://node-hnapi.herokuapp.com/news', true);
  req.send();
  req.onload = function(){
    self.port.emit("resizePanel");
    posts = JSON.parse(req.responseText);
    toggleLoadingAnimation();
    renderPosts(posts);
  };
  req.onerror = function(){
    toggleLoadingAnimation();
  }
}

// toggles between the loading gif,reload icon.
function toggleLoadingAnimation(){
  src = $('.loading').attr('src');
  if(src=="img/refresh-white.png") $(".loading").attr("src", "img/ajax-loader.gif");
  else $(".loading").attr("src", "img/refresh-white.png");
}

$(document).ready(function(){

  fetchdata();
  setInterval(fetchdata, 300000);

  //sends "link to be opened" to main.js
  $("body").on('click', "li > h3", function(){
    self.port.emit("postClicked", this.data);
    return false;
  });

  $("body").on('click', "h5", function(){
    self.port.emit("postClicked", this.data);
    return false;
  });

  $("body").on('click', "a", function(){
    self.port.emit("postClicked", $(this).attr('data'));
    return false;
  });

  $("body").on('click', ".gh-btn", function(){
    self.port.emit("postClicked", "https://github.com/nishanthvijayan/HackerNews-Feed");
  });

  $("body").on('click', ".loading", fetchdata);

  $("body").on('click', ".up-btn", function(){
    window.scrollTo(0, 0);
  });

  addEventListener('scroll', function(){
    if($(".up-btn").css("display")=="none") $(".up-btn").show();
  });
});
