import os
from flask import Flask, jsonify
from hackernews import HackerNews
from flask.ext.cache import Cache   

app = Flask(__name__)

# define the cache config keys, remember that it can be done in a settings file
app.config['CACHE_TYPE'] = 'simple'

# register the cache instance and binds it on to your app 
app.cache = Cache(app)

def getData():
    
    posts= []
    hn = HackerNews()

    for story_id in hn.top_stories(limit=20):
        item  =  hn.get_item(story_id)
        posts.append([  str(item.title.encode('ascii','ignore'))    , str(item.url.encode('ascii','ignore')) , story_id , item.score  ])

    return posts

@app.route('/')
@app.cache.cached(timeout=300) # cache for 5 minutes
def index():
    
    results = getData()
    list = [ {'Posts':  results   } ]
    resp = jsonify(result=list)
    resp.status_code = 200
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)