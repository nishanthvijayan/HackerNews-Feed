
var res;
var req;






$(document).ready(function(){

req =  new XMLHttpRequest();
req.open("GET",'http://hackernewslatestapi.herokuapp.com/',true);
req.send();
req.onload = function(){
  res = JSON.parse(req.responseText);
  console.log(res);
};


});