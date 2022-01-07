//jshint esversion:6

require('dotenv').config()  // for env variable to keep some secret stuff
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');
const  ejs =require("ejs");


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// mongoose.connect("mongodb+srv://Hari2000:Hari2000@cluster0.7meav.mongodb.net/todolistDb",{useNewUrlParser:true}); 
mongoose.connect("mongodb://localhost:27017/keyDb");   //{useNewUrlParser:true}

var credentialSchema = new mongoose.Schema({
   username:{
         type:String,
         required:true
     },
     password:{
         type:String,
         required:true
     }
});

//console.log(process.env.SECRET); // proveide secret key that store inside in env variable

credentialSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields: ["password"] });
 

let Credential =new mongoose.model("Credential",credentialSchema);

app.get("/",function(req,res){
    res.render("home");
})
app.get("/login",function(req,res){
    res.render("login");
})

app.get("/register",function(req,res){
    res.render("register");
})

app.post("/login",function(req,res){
    const username=req.body.username;
    const  password =req.body.password;
    
    Credential.findOne({username:username},function(error,result){
        if(result){
            if(result.password==password){
              console.log("successfuully login");
              res.render("secrets");   
            }
          
        }else{
            console.log("please sign up to put secret here");
        }
    });
});

app.post("/register",function(req,res){
    
    let name=req.body.username;
    let pass =req.body.password;
    console.log(name +" and "+pass);
    
    let newUser =new Credential({
       username:name,
        password:pass
    });
    newUser.save();
    res.render("submit");
    
});

//app.post("/submit",function(req,res){
//    
//    let hiddensecret =req.body.secret;
//    let name=req.body.username;
//    let pass =req.body.password;
//    
//    Credential.updateOne({username:name,password:pass},{secret:hiddensecret},function(error){
//        if(!error){
//            console.log("succesfully updated with secret in registered credential");
//        }
//    })
// //   res.render("submit");   
//});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
