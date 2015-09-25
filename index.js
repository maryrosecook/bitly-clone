var express = require('express');
var bodyParser = require("body-parser");

var app = express();

var shortenedUrls = {};

app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!'});
});

app.post('/', function (req, res) {
  var urlToShorten = req.body.url.trim();
  if (urlToShorten === "") {
    res.render('index', { flash: { message: "You did not specify a URL to shorten" }});
  } else {
    var shortUrlAndHash = shorten(req, urlToShorten);
    shortenedUrls[shortUrlAndHash.hash] = urlToShorten;
    res.render('index', { shortenedUrl: shortUrlAndHash.url  });
  }
});

app.get('/:hash', function (req, res) {
  var originalUrl = shortenedUrls[req.params.hash];
  if (originalUrl !== undefined) {
    res.redirect(originalUrl);
  } else {
    res.render('404', { status: 404, url: req.url });
  }
});

function shorten(req, urlToShorten) {
  var hashStr = hash(urlToShorten);
  return {
    url: req.protocol + '://' + req.get('host') + "/" + hashStr,
    hash: hashStr
  }
};

function hash(string) {
  var hashInt = 0;
  for (var i = 0; i < string.length; i++) {
    hashInt = hashInt * 31 + string.charCodeAt(i);
    hashInt = hashInt | 0;
  }

  return Math.abs(hashInt).toString(16);
};

var server = app.listen(4000, function () {
  console.log('Example app listening at http://localhost:%s', server.address().port);
});
