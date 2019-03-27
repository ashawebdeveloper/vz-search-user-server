var express = require('express');
var app = express();
var Q = require('q');
var https = require('https');
var cors = require('cors');

app.use(cors());


app.get('/', function(req, res){
    res.send("Hello world!");
});

app.get('/searchUser/:userId', function(req, res){

    getUsers(req.params.userId)
        .then(function(data){

            res.send(data);
        })
        .catch(function(error){
            res.send(null, "Error getting User data");
        })
});

function getUsers(userId){
    var deferred = Q.defer();

    if(userId){
        debugger;
        var urlData = {
            host: 'jsonplaceholder.typicode.com',
            port: 443,
            path: '/posts?userId='+userId,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        var request = https.request(urlData, function(res){

            var rawData = "";

            res.on('error', function (error) {
                logger.info('Error fetching User details: ' + error.message);
                deferred.reject(error);
            });


            if(res.statusCode == 200){

                res.on('data', function(data){
                    rawData += data;
                });

                res.on("end", function(){
                    deferred.resolve(JSON.parse(rawData));
                });
            }
        });
        request.end();
    }
    return deferred.promise;
}

app.listen(3000);