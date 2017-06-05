var express = require('express');
var router = express.Router();
var db = require('DBUtils');


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');

});
router.post('/login', function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    db.search("SELECT * FROM Users WHERE username = '" + username  + "' AND pword = " + password + "",function (jsonObj) {
        console.log(jsonObj);
    });
    // res.send("check this user name");
});
module.exports = router;
