var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var servicesUrl = require('./servicesUrl');


app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// 解决跨域问题，*代表所有的都不限制
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('X-Powered-By', ' 3.2.1');
    // res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

// 静态资源文件直接输出
app.use('/', express.static(path.join(__dirname, '../build')));

// 简单测试接口helloworld
app.get('/helloworld', function (req, res) {
    res.send(req.url);
});

var getReponseFun = function (req, res) {
    console.log(req.path);
    path = __dirname + '/mockdata' + req.path.replace(/\//g, '.').replace('.', '/') + '.json';
    fs.readFile(path, function (error, data) {
        if (!error) {
            res.send(JSON.parse(data));
        } else {
            if (error.errno === -2) {
                console.log('can not find file');
                if (Object.keys(req.params).length) {
                    console.log(req.params);
                    for (var key in req.params) {
                        path = path.replace(new RegExp('.' + req.params[key]), '.1');
                    }
                }

                readFile(path, function (data) {
                    res.send(JSON.parse(data));
                }, function (error) {
                    res.send(JSON.stringify(error));
                });
            } else {
                console.log(error);
                res.send(JSON.stringify(error));
            }
        }
    });
};

var readFile = function (path, callback, errorCallback) {
    console.log(path);
    fs.readFile(
        path,
        function (error, data) {
            if (!error) {
                callback && callback(data);
            } else {
                errorCallback && errorCallback(error);
            }
        }
    );
};

// console.log(servicesUrl);
var traveralObj = function (obj, callback) {
    for (var key in obj) {
        if (typeof obj[key] === 'string') {
            app.get(obj[key], getReponseFun);
            callback && callback(obj[key]);
        } else {
            if (obj[key].url && obj[key].method) {
                console.log(obj[key].method + ':' + obj[key].url);
                app[obj[key].method.toLowerCase()](obj[key].url, getReponseFun);
                callback && callback(obj[key]);
            } else {
                traveralObj(obj[key], callback);
            }
        }
    }
};

traveralObj(servicesUrl);
var server = app.listen(3012, function() {
// var server = app.listen(8092, function () {
    console.log('Listening on port %d', server.address().port);
});