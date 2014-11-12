var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');
var client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'myk'});

var redis  = require("redis");
var redisClient = redis.createClient(6379, '127.0.0.1');

redisClient.on("ready", function () {
    // if you need auth, do it here
    console.log("Redis Client ready...");
    redisClient.keys("*", function (err, keys) {
        keys.forEach(function (key, pos) {
            redisClient.type(key, function (err, keytype) {
                console.log(key + " is " + keytype);
            });
        });
    });}); 


var sha1  = require("sha1");


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET Hello World page. */
router.get('/hello', function(req, res) {
    res.render('helloworld', { title: 'Hello, World!' })
});

/* GET Userlist page. */
router.get('/cassandra', function(req, res) {
    var query = 'SELECT * FROM users';
    var key = sha1(query);
    redisClient.select(0);
    redisClient.get(key, function(err, cachedValue) {
        if (cachedValue) {
            redisClient.expire(key, 10);
            renderResults(JSON.parse(cachedValue));
        }
        else {
            client.execute(query, [], function(err, result) {
                var user1 = redisClient.hgetall('user:1', function(err, user) {
                    if (user) {
                        var newUser = {"username": user.name, "email": user.email};
                        result.rows.push(newUser);
                    }
                    redisClient.set(key, JSON.stringify(result));
                    redisClient.expire(key, 10);
                    renderResults(result);
                });
            });
        }
    })

    function renderResults(result) {
        res.render('userlist', {
            "userlist": result.rows
        });
        console.log(result);
    }
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});

/* GET New User page. */
router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'Add New User' });
});

/* POST to Add User Service */
router.post('/adduser', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;

    // Set our collection
    var collection = db.get('usercollection');

    // Submit to the DB
    collection.insert({
        "username" : userName,
        "email" : userEmail
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("userlist");
            // And forward to success page
            res.redirect("userlist");
        }
    });
});

module.exports = router;

// var should = require("should");
// var monk = require("monk");
 
// describe("connection and initalization is easy", function () {
//     it("is easy to connect", function (done) {
//         var db = monk('localhost/testingMonk');
//         should.exists(db);
//         done();
//     });
 
//     it("is easy to get hold of a collection", function (done) {
//         var db = monk('localhost/testingMonk');
//         var collection = db.get("orders");
//         should.exists(collection);
//         done();
//     });
// });

