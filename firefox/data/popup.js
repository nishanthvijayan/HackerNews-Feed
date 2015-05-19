function putdata(res)
{ 
  // removes the present posts
  $("#content > li").remove();
  $("hr").remove();
  
  for (i = 0; i < 20; i++){ 
    post = res.result[0].Posts[i];

    var node = document.createElement("li");
    node.data = post[1];

    var nameText = document.createTextNode((i+1)+".  "+post[0]);
    var nameNode = document.createElement("h3");
    nameNode.appendChild(nameText);
    node.appendChild(nameNode);

    node.appendChild(document.createElement("br"));

    if (post[3]=='1')var scoreText = document.createTextNode('( '+post[3] + ' point )');
    else var scoreText = document.createTextNode('( '+post[3] + ' points )');
    var scoreNode = document.createElement("h5");
    scoreNode.appendChild(scoreText);
    scoreNode.data = "https://news.ycombinator.com/item?id="+post[2];
    node.appendChild(scoreNode);
    
    document.getElementById("content").appendChild(node);
    document.getElementById("content").appendChild(document.createElement("hr"));
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

  // this makes sure that fetchdata() is called only when the icon
  // is reload icon and not when it is the loading gif.
  $("body").on('click',".loading", function(){
    src = $('.loading').attr('src');
    if(src=="refresh-white.png") fetchdata();
  });

  setTimeout(function(){
    $("header > h3").after('<span><iframe src="https://ghbtns.com/github-btn.html?user=nishanthvijayan&repo=hackernews-feed&type=star&count=false" frameborder="0" scrolling="0" width="100px" height="20px"></iframe></span>');
  },1000);

});

