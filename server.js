//this is only an example, handling everything is yours responsibilty !

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//var cors = require('cors');
//app.use(cors());
var DButilsAzure = require('./DBUtils');
//var mysql = require("jade");
var mysql=require('mysql');
//var TYPES = require('tedious').TYPES;


//-------------------------------------------------------------------------------------------------------------------
app.get('/select1', function (req,res) {
    //it is just a simple example without handling the answer
    DButilsAzure.Select('Select * from Users').then( function (result) {
        res.send(result);
    }).catch(function (err) {
        res.send(err);
    });
});
//-------------------------------------------------------------------------------------------------------------------
app.post('/login', function (req,res) {
    var username = req.body.username;
    var password = req.body.password;
    DButilsAzure.Select("SELECT * FROM Users WHERE username = '" + username  + "' AND pword = '" + password + "'").then( function (result) {
        var q = "update Users set lastLogInDate = (GETDATE()) WHERE username = '" + username  + "'";
        DButilsAzure.Insert(q).then( function (asd) {
            if(result.length!=1){
                res.send(false);
            }else {
                res.send(JSON.stringify({ans:true,lastLogInDate:result[0].lastLogInDate}));
            }
        }).catch(function (err) {
            res.send(err);
        });
    }).catch(function (err) {
        res.send(err);
    });
});
//-------------------------------------------------------------------------------------------------------------------
app.get('/createNewProduct', function (req,res) {
    DButilsAzure.Insert("INSERT INTO Products ([productName], [productSupplierId], [productPrice], [productCategoryId]) " +
        "VALUES ('"+req.query.productName+"', " +
        "'"+req.query.productSupplierId+"'," +
        "'"+req.query.productPrice+"', " +
        "'"+req.query.productCategoryId+"')").then( function (result) {
        if(result){
            var p = {answer:result,productName:req.query.productName,productSupplierId:req.query.productSupplierId,productPrice:req.query.productPrice,productCategoryId:req.query.productCategoryId};
            res.send(JSON.stringify(p));
        }
    }).catch(function (err) {
        res.send(err);
    });
});
//-------------------------------------------------------------------------------------------------------------------
app.delete('/deleteProduct', function (req,res) {
    DButilsAzure.Select("select * from Products where productId = '"+req.query.productId+"'").then( function (ans) {
        if(ans.length==1){
            DButilsAzure.Delete("delete from Products where productId='"+req.query.productId+"'").then( function (result) {
                if(result){
                    res.send("200:Product deleted successfully")
                }else{
                    res.send("500: error during deletion");
                }
            }).catch(function (err) {
                res.send(err);
            });
        }
        else{
            res.send("404:no such product");
        }
    }).catch(function (err) {
        res.send(err);
    });

});
//-------------------------------------------------------------------------------------------------------------------
app.delete('/deleteUser', function (req,res) {
    DButilsAzure.Select("select * from Users where id = '"+req.query.userId+"'").then( function (ans) {
        if(ans.length==1){
            DButilsAzure.Delete("delete from Users where id='"+req.query.userId+"'").then( function (result) {
                if(result){
                    res.send("200:User "+ ans[0].username+"deleted successfully")
                }else{
                    res.send("500: error during deletion");
                }
            }).catch(function (err) {
                res.send(err);
            });
        }
        else{
            res.send("404:no such Users");
        }
    }).catch(function (err) {
        res.send(err);
    });

});
//-------------------------------------------------------------------------------------------------------------------
app.get('/productDetailsByID', function (req,res) {
    var q = "select * from Products where productId = '"+req.query.productId+"'";
    if(req.query.sort==("price")){
        q+=" order by productPrice"
    }
    if(req.query.sort==("name")){
        q+=" order by productName"
    }
    DButilsAzure.Select(q).then( function (ans) {
        DButilsAzure.Select("select * from Suppliers where supplierId = '"+ans[0].productSupplierId+"'").then( function (sup) {
            DButilsAzure.Select("select * from Categorys where categoryId = '"+ans[0].productCategoryId+"'").then( function (cat) {
                res.send("product Name :"+ans[0].productName+". Supplier :"+sup[0].supplierName+". Category :"+cat[0].categoryName+". Price:"+ans[0].productPrice+".");
            }).catch(function (err) {
                res.send(err);
            });
        }).catch(function (err) {
            res.send(err);
        });
    }).catch(function (err) {
        res.send(err);
    });
});
//-------------------------------------------------------------------------------------------------------------------
app.get('/productSearchByCategory', function (req,res) {
    var q="select * from Products where productCategoryId = '"+req.query.productCategoryId+"'"
    if(req.query.sort==("price")){
        q+=" order by productPrice"
    }
    if(req.query.sort==("name")){
        q+=" order by productName"
    }
    DButilsAzure.Select("select * from Products where productCategoryId = '"+req.query.productCategoryId+"'").then( function (ans) {
        res.send(ans);
    }).catch(function (err) {
        res.send(err);
    });
});
//-------------------------------------------------------------------------------------------------------------------
app.get('/productSearchBySupplierId', function (req,res) {
    var q="select * from Products where productSupplierId = '"+req.query.productSupplierId+"'"
    if(req.query.sort==("price")){
        q+=" order by productPrice"
    }
    if(req.query.sort==("name")){
        q+=" order by productName"
    }
    DButilsAzure.Select(q).then( function (ans) {
        res.send(ans);
    }).catch(function (err) {
        res.send(err);
    });
});
//-------------------------------------------------------------------------------------------------------------------
app.get('/productSearchByName', function (req,res) {
    DButilsAzure.Select("select * from Products where productName = '"+req.query.productName+"'").then( function (ans) {
        res.send(ans);
    }).catch(function (err) {
        res.send(err);
    });
});
//-------------------------------------------------------------------------------------------------------------------
app.get('/createNewSupplier', function (req,res) {
    DButilsAzure.Insert("INSERT INTO Suppliers ([supplierName]) VALUES ('"+req.query.supplierName+"')").then( function (result) {
        if(result){
            var p = {answer:result,supplierName:req.query.supplierName};
            res.send(JSON.stringify(p));
        }
        else{
            res.send("Failed to Create new Supplier");
        }
    }).catch(function (err) {
        res.send(err);
    });
});
//-------------------------------------------------------------------------------------------------------------------
app.delete('/deleteSupplier', function (req,res) {
    DButilsAzure.Select("select * from Suppliers where supplierId = '"+req.query.supplierId+"'").then( function (ans) {
        if(ans.length==1){
            DButilsAzure.Delete("delete from Suppliers where supplierId ='"+req.query.supplierId+"'").then( function (result) {
                if(result){
                    res.send("200: Supplier deleted successfully")
                }
            }).catch(function (err) {
                res.send("500: error during deletion"+err);
            });
        }
        else{
            res.send("404:no such Supplier");
        }
    }).catch(function (err) {
        res.send(err);
    });

});
//-------------------------------------------------------------------------------------------------------------------
app.post('/newPurchase', function (req,res) {
    var quary = "INSERT INTO Purchases ([userId],[amountOfMony],[creditCardCode],[purchaseDate]) " +
        "VALUES ('"+req.body.userId+"', " +
        "'"+req.body.amountOfMony+"'," +
        "'"+req.body.creditCardCode+"', "+
        "'"+req.body.purchaseDate+"')";
    DButilsAzure.Insert(quary).then( function (result) {
                //date format : 2008-11-11
        if(result){
            var p = {answer:result,userId:req.body.userId,amountOfMony:req.body.amountOfMony,creditCardCode:req.body.creditCardCode,purchaseDate:req.body.purchaseDate};
            res.send(JSON.stringify(p));
        }
    }).catch(function (err) {
        res.send(err);
    });
});
//-------------------------------------------------------------------------------------------------------------------
app.get('/getSellsSumByDate', function (req,res) {
    DButilsAzure.Select("select * from Purchases where [purchaseDate]='"+req.query.purchaseDate+"'").then( function (result) {
        if(result.length>0){
            var sum = 0;
            for (var i=0;i<result.length;i++){
                sum+=result[i].amountOfMony;
            }
            res.send(JSON.stringify(sum));
        }
        else{
            res.send("Failed to Create new Supplier");
        }
    }).catch(function (err) {
        res.send(err);
    });
});
//-------------------------------------------------------------------------------------------------------------------
app.post('/addToCart', function (req,res) {
    DButilsAzure.Select("INSERT INTO carts ([userId],[productId],[quantity]) " +
        "VALUES ('"+req.body.userId+"'," +
        "'"+req.body.productId+"'," +
        "'"+req.body.quantity+"')").then( function (result) {
        res.send(JSON.stringify("200: add to cart successfully."));
    }).catch(function (err) {
        res.send("500: error during adding."+err);
    });
});
//-------------------------------------------------------------------------------------------------------------------
app.post('/removeFromCart', function (req,res) {
    DButilsAzure.Select("delete from Carts where productId='"+req.query.productId+"' and userId='"+req.query.userId+"'").then( function (result) {
        res.send(JSON.stringify("200: removed from cart successfully."));
    }).catch(function (err) {
        res.send("500: error during adding."+err);
    });
});
//-------------------------------------------------------------------------------------------------------------------
//TODO repair
app.get('/allItemsInCart', function (req,res) {


        DButilsAzure.Select("select * from carts where [userId]='"+req.query.userId+"'").then( function (cartResult) {
                var jas  = [];
            if(cartResult.length>0){
                //for(var i=0;i<cartResult.length;i++){
                var mycounter=0;
                cartResult.forEach(function(i){
                    var q = "select * from Products where [productId]='"+i.productId+"'";
                    DButilsAzure.Select(q).then( function (result) {
                        if(result.length>0)
                        //res.send(result)
                            jas.push(result);
                        mycounter++;
                        if(mycounter==cartResult.length){
                            res.send(jas);
                        }
                    }).catch(function (err) {
                        res.send(err);
                    });
                });
            }
            else{
                res.send("this User has no products in his cart")
            }
        }).catch(function (err) {
            res.send(err);
        });
});
//-------------------------------------------------------------------------------------------------------------------
app.post('/updateUserDetails', function (req,res) {
    var query="UPDATE Users " +
        "SET [firstname] = '"+req.body.firstname+"', [lastname] = '"+req.body.lastname+"', [username] = '"+req.body.username+"', [pword] = '"+req.body.pword+"', [email] = '"+req.body.email+"'" +
        "WHERE [id] = '"+req.body.id+"'";
    DButilsAzure.Select(query).then( function (result) {
        res.send(JSON.stringify("200: User  details updated successfully."));
    }).catch(function (err) {
        res.send("500: error during updating details."+err);
    });
});
//-------------------------------------------------------------------------------------------------------------------
var now = new Date();
var dateNow=now.getFullYear()+"/"+(now.getMonth()+1)+"/"+now.getDate();
app.post('/createNewUser', function (req,res) {
    var query="INSERT INTO Users (username,firstname, lastname, pword, email,lastLogInDate) " +
        "VALUES ('"+req.body.username+"','"+req.body.firstname+"','"+req.body.lastname+"','"+req.body.pword+"','"+req.body.email+"',TO_DATE('"+dateNow+"', 'DD/MM/YYYY'))";
    DButilsAzure.Select(query).then( function (result) {
        res.send(JSON.stringify("200: user Created successfully."));
    }).catch(function (err) {
        res.send("500: error during creating user."+err);
    });
});
//-------------------------------------------------------------------------------------------------------------------
app.get('/makeUserAdmin', function (req,res) {
    var query="UPDATE Users " +
        "SET [managerlvl] = '1'" +
        "WHERE [id] = '"+req.query.id+"'";
    DButilsAzure.Select(query).then( function (result) {
        res.send(JSON.stringify("200: user now is admin successfully."));
    }).catch(function (err) {
        res.send("500: error during updating user details."+err);
    });
});
//-------------------------------------------------------------------------------------------------------------------
app.get('/searchProduct', function (req,res) {
    var query="select * from Products where [productId]='"+req.query.productId+"'";
    DButilsAzure.Select(query).then( function (result) {

        res.send(JSON.stringify({name:result[0].productName,price:result[0].productPrice}));
    }).catch(function (err) {
        res.send("500: error during updating user details."+err);
    });
});
//-------------------------------------------------------------------------------------------------------------------
app.get('/recoverPassWord', function (req,res) {
    var query="select * from Users where [id]='"+req.query.id+"'";
    DButilsAzure.Select(query).then( function (result) {
        if(result.length>0){
            res.send(JSON.stringify("mail has been sent to "+result[0].username));
        }else {
            res.send(JSON.stringify("no such user"));
        }
    }).catch(function (err) {
        res.send("500: error during updating user details."+err);
    });
});
//-------------------------------------------------------------------------------------------------------------------
var port = 4000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});
//-------------------------------------------------------------------------------------------------------------------


