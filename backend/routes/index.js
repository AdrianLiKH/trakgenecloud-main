const express = require('express');
const router = express.Router();

const Admin = require('../models/adminLogin-model');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const FamilyId = require("../models/familyId-model")
const ClientModel = require('../models/client-model')
const mongoose = require('mongoose') 



//old code for reference
// router.post('/login', async (req, res )=>{
//     const email =  req.body.adminDetails.adminEmail;
//     const password =  req.body.adminDetails.adminPassword;
//     try{
//         //
//         // const admin = await Admin.findOne({email: email}).lean();
//         const admin = await Admin.findOne({email:email}, (err, item) =>{
//         if (err) throw err;
//         console.log(item);
//         })
//         // console.log("Admin>>>>");
//         console.log(admin)
//         if (admin) {
//             console.log("Admin>>>>");
//             bcrypt.compare(password, admin.hashedPassword, function(err, result) {
//                 if (result) res.json({success:true});
//                 else res.sendStatus(401);
//             });
//         }
//         else res.sendStatus(401);
//     }
//     catch(err) {
//         console.log("*************************************************************")
//         console.log(err)
//         res.sendStatus(500)
//     }
    
// })

router.post('/login', async (req, res ) => {
  const {email, password} = req.body;
  try {
    const admin = await ClientModel.findOne({email:email});
    if (admin) {
      bcrypt.compare(password, admin.hashedPassword, function(err, result) {
        if (result) {
          const token = jwt.sign({
            email,
            userType:admin.userType
          }, "test", { expiresIn: "1d" });

          res.cookie('user-token', token, { signed: true, httpOnly: true, secure: true, sameSite: true, path:'/', maxAge:24 * 60 * 60 * 1000 });
          const mongoExists = !admin.mongoDbType === true ? false : admin.mongoDbType;
          res.json({success:true, userType: admin.userType, mongoExists, email});
        }
        else {
          res.status(401).send();
          console.log(`Invalid password for email: ${email}`);    
        }
      });
    }
    else {
      res.status(401).send();
      console.log(`No user found for email: ${email}`);
    }
  }
  catch(err) {
    console.error(err);
    res.status(500).send();
  }
})

router.get('/loginverify', async (req, res )=>{
  try {
    const savedToken =  req.signedCookies['user-token'];
    if (savedToken) {
      const decoded = jwt.verify(savedToken, process.env.LOGIN_SECRET);
      res.json({
        email: decoded.email,
        userType: decoded.userType
      });
    }
    else throw 'invalid token';
  }
  catch(err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post('/signup', async function(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  try {
    bcrypt.genSalt(11, async function(err, salt) {
        bcrypt.hash(password, salt, async function(err, hash) {
            // Store hash in your password DB.
            const admin = new Admin({
              email: email,
              hashedPassword: hash
            });
            await admin.save();
            res.send("Admin saved!");
        });
      });
  }
  catch(err) {
    console.log(err);
    res.sendStatus(500);
  }
  
})

router.post('/initializeFamilyId', async function(req, res) {
  const id = req.body.id;
  try {
      // Creation of initial family Id
      const familyId = new FamilyId({
        currentId: id,
      });
      await familyId.save();
      res.send("FamilyId Initialized!");

  }
  catch(err) {
    console.log(err);
    res.sendStatus(500);
  }
  
})

router.post('/createUser', async function(req, res) {
  try {
    const email = req.body.userData.email;
    const password = req.body.userData.password;
    const userType = req.body.userData.userType;
    const client = await ClientModel.findOne({email:email}, (err, item) =>{
      if (err) throw err;
    })
        
    if (client) {
      res.json({exists:true})
    } else{
      bcrypt.genSalt(11, async function(err, salt) {
        bcrypt.hash(password, salt, async function(err, hash) {
            // Store hash in your password DB.
            const clientModel = new ClientModel({
              email: email,
              hashedPassword: hash,
              userType: userType
            });
            await clientModel.save();
            res.json({exists:false});
        });
      });
    }        
  }
  catch(err) {
    console.log(err);
    res.sendStatus(500);
  }
  
})

router.get('/getExistingUsers', async function(req, res) {
  
  try {
        const clients = await ClientModel.find({}, (err, item) =>{
            if (err) throw err;
            })
        
        if(clients){
          res.json({exists:true, clients:[...clients]})
        }else{
          res.json({exists:false})
        }
  }
  catch(err) {
    console.log(err);
    res.sendStatus(500);
  }
  
})

router.post('/updateUser', async function(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const userType = req.body.userType;

  try {
        const client = await ClientModel.findOne({email:email}, (err, item) =>{
            if (err) throw err;
        })
        
        if(client){
          bcrypt.genSalt(11, async function(err, salt) {
            bcrypt.hash(password, salt, async function(err, hash) {
              const checkPwd = await bcrypt.compare(password, client.hashedPassword);
              if(checkPwd)
              {
                console.log("Reused Password");
                res.sendStatus(401);
              }
              else{
                // Store hash in your password DB.
                const clientModel =  {
                  email: email,
                  hashedPassword: hash,
                  userType: userType
                };
                await ClientModel.findOneAndUpdate({_id:client._id},clientModel, {useFindAndModify:false});
                res.json({exists:false});
              }
            });
          });
        }else{
          
        }        
  }
  catch(err) {
    console.log(err);
    res.sendStatus(500);
  }
  
})

router.post('/updateClient', async (req, res )=>{
    const email =  req.body.adminEmail;
    const userName =  req.body.userName;
    const mongoDbType =  req.body.mongoDbType;
    const mongoPassword =  req.body.mongoPassword;
    const clusterName =  req.body.clusterName;
    const databaseName =  req.body.databaseName;
    const port =  req.body.port; 
    try{
        const uri = `mongodb+srv://${userName}:${mongoPassword}@cluster0.lcpab.mongodb.net/${databaseName}?retryWrites=true&w=majority`
        const conn = await mongoose.createConnection(uri,{useNewUrlParser:true,useCreateIndex:true, useUnifiedTopology: true})
        .then(async (res)=>{
          const Test = res.model('Check', require('../models/test-model'));

        
          const data = new Test({
            isJewish: 'no',
            isWomanCancer: 'yes'
          });

          await data.save();
        });
    }
    catch(err) {
        console.log(err)
        res.sendStatus(500)
    }
    
})

router.get('/signout', async (req, res )=>{
   console.log('works')
 
    try{
     res.cookie('user-token', 'a', { signed: true, httpOnly: true, secure: true, sameSite: true, path:'/', maxAge:10 });
     res.send()
    }
    catch(err) {
        console.log(err)
        res.sendStatus(500)
    }
    
})



module.exports = router;
