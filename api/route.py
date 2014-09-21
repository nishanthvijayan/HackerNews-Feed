import os
from flask import Flask, jsonify
import mechanize
from bs4 import BeautifulSoup

app = Flask(__name__)


def getData():
    
    posts= []
    
    browser = mechanize.Browser()
    browser.set_handle_robots(False)
    cookies = mechanize.CookieJar()
    browser.addheaders = [('User-agent', 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:25.0) Gecko/20100101 Firefox/25.0')]

    page = browser.open("https://news.ycombinator.com/")
    soup = BeautifulSoup(page,"html.parser")

    rows = soup.select("td > a")



    for row in rows:
        if(row.string!=None and ("http" in row["href"])):
            posts.append([  str(row.string.encode('ascii','ignore'))    , str(row["href"].encode('ascii','ignore'))    ])

    return posts




@app.route('/')
@app.route('/data.json')
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