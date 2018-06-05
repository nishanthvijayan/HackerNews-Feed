const $ = require('jquery');

const clearPosts = function () {
  $('#content > li').remove();
  $('#content > hr').remove();
};


const appendPostToList = function (post) {
  document.getElementById('content').appendChild(post);
  document.getElementById('content').appendChild(document.createElement('hr'));
};


const renderTitle = function (index, post) {
  const titleNode = document.createElement('h3');
  titleNode.data = (post.url.substring(0, 4) == 'item') ? `https://news.ycombinator.com/${post.url}` : post.url;

  const titleText = document.createTextNode(`${index + 1}.  ${post.title}`);
  titleNode.appendChild(titleText);

  return titleNode;
};


const renderDomainLink = function (post) {
  const domainLinkNode = document.createElement('span');
  domainLinkNode.className = 'detail';

  const domainLinkText = document.createTextNode(`(${post.domain})`);
  domainLinkNode.appendChild(domainLinkText);

  return domainLinkNode;
};


const renderDetails = function (post) {
  const detailsNode = document.createElement('h5');

  const score = (post.points != null) ? `${post.points}▲ ` : '';
  const comments = (post.comments_count == '1') ? ` • ${post.comments_count} comment ` : ` • ${post.comments_count} comments `;
  const detailsText = document.createTextNode(`${score} ${comments}`);

  detailsNode.appendChild(detailsText);
  detailsNode.data = `https://news.ycombinator.com/item?id=${post.id}`;
  detailsNode.className = 'detail';

  return detailsNode;
};


const renderTime = function (post) {
  const timeNode = document.createElement('span');
  timeNode.className = 'detail';

  const timeText = document.createTextNode(` | ${post.time_ago}`);
  timeNode.appendChild(timeText);

  return timeNode;
};


function renderPosts(posts) {
  clearPosts();

  $.each(posts, (index, post) => {
    const node = document.createElement('li');
    node.appendChild(renderTitle(index, post));

    if (post.type == 'link') {
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


function fetchdata() {
  imgToggle();
  const req = new XMLHttpRequest();
  req.open('GET', 'http://node-hnapi.herokuapp.com/news', true);
  req.send();
  req.onload = function () {
    imgToggle();

    const res = JSON.parse(req.responseText);
    renderPosts(res);

    const now = (new Date()).getTime() / 1000;
    localStorage.cache = req.responseText;
    localStorage.time = now;
  };
  req.onerror = function () {
    imgToggle();
  };
}

// toggles between the loading gif,reload icon.
function imgToggle() {
  const src = $('.loading').attr('src');
  if (src == 'img/refresh-white.png') $('.loading').attr('src', 'img/ajax-loader.gif');
  else $('.loading').attr('src', 'img/refresh-white.png');
}

$(document).ready(() => {
  const now = (new Date()).getTime() / 1000;
  if (!localStorage.cache || now - parseInt(localStorage.time) > 5 * 60) {
    // cache is old or not set
    fetchdata();
  } else {
    // cache is fresh
    renderPosts(JSON.parse(localStorage.cache));
    if (localStorage.scrollPosition) {
      window.scroll(0, localStorage.scrollPosition);
    }
  }

  addEventListener('scroll', () => {
    localStorage.scrollPosition = window.scrollY;
    
    if (window.scrollY !== 0) {
      $('.up-btn').show();
    } else {
      $('.up-btn').hide();
    }
  });

  $('body').on('click', 'li > h3', function () {
    chrome.tabs.create({ url: this.data });
    return false;
  });

  $('body').on('mousedown', 'li > h3', function (e) {
    if (e.which == 2) {
      chrome.tabs.create({ url: this.data });
    }
    return false;
  });

  $('body').on('click', 'h5', function () {
    chrome.tabs.create({ url: this.data });
    return false;
  });

  $('body').on('mousedown', 'h5', function (e) {
    if (e.which == 2) {
      chrome.tabs.create({ url: this.data });
    }
    return false;
  });

  $('body').on('click', 'header > h2', () => {
    chrome.tabs.create({ url: 'https://news.ycombinator.com/' });
    return false;
  });

  $('body').on('mousedown', 'header > h2', (e) => {
    if (e.which == 2) {
      chrome.tabs.create({ url: 'https://news.ycombinator.com/' });
    }
    return false;
  });

  $('body').on('click', '.gh-btn', () => {
    chrome.tabs.create({ url: 'https://github.com/nishanthvijayan/HackerNews-Feed' });
    return false;
  });

  $('body').on('mousedown', '.gh-btn', (e) => {
    if (e.which == 2) {
      chrome.tabs.create({ url: 'https://github.com/nishanthvijayan/HackerNews-Feed' });
    }
    return false;
  });

  $('body').on('click', '.up-btn', () => {
    window.scroll(0, 0);
  });


  // this makes sure that fetchdata() is called only when the icon
  // is reload icon and not when it is the loading gif.
  $('body').on('click', '.loading', () => {
    const src = $('.loading').attr('src');
    if (src == 'img/refresh-white.png') fetchdata();
  });
});

