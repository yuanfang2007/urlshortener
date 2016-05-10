var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var URL_FILE = path.join(__dirname, 'url.json');

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

var map;
if(!map){
  fs.readFile(URL_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    map = JSON.parse(data);
  });
}

app.get('/api/urlShortenner', function(req, res) {
  var url =  req.url.substr("'/api/urlShortenner".length);
  var hash = url.hashCode();
  console.log(hash);

  var newUrl = {
    hash: hash,
    url: url,
  };

  map.push(newUrl);
  fs.writeFile(URL_FILE, JSON.stringify(map, null, 4), function(err) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
  res.json({url: "/" +hash});
});

app.get('/*', function(req, res) {
  var hash = req.url.substr(1);
  console.log(req.url);
  if (!isNaN(hash)){
    console.log(hash);

    for (var i = 0; i < map.length; i++){
      // look for the entry with a matching `code` value
      if (map[i].hash == hash){
        res.statusCode = 302;
        res.setHeader("Location", "http://"+map[i].url);
        res.end();
        return;
      }
    }
    res.status(404);
    res.type('txt').send('Not found');

  }else{
    res.status(404);
    res.type('txt').send('Error: shortened url should be an integer');
  }

});

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});


String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
