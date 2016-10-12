var express = require('express'),
    fs = require('mz/fs'),
    app = express(),
    bodyParser = require('body-parser');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use( bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.get('/getdata', function(req, res) {
    var resObj = {};
    fs.readdir('images/gallery')
        .then(function (dirs) {
            dirs.forEach(function (dir) {
                resObj[dir] = [];
            });
            var promiseArr = dirs.map(function (dir) {
                return fs.readdir('images/gallery/' + dir + '/thumbs');
            });
            return Promise.all( promiseArr );
        })
        .then(function (files) {
            var i = 0;
            for (var key in resObj) {
                resObj[key] = files[i];
                i++;
            }
            res.send(resObj);
        })
        .catch(function (error) {
            console.log(error);
        });
});

app.use(express.static(__dirname + '/'));

app.listen(process.env.PORT || 8080);