const router = require('express').Router();
let Email_link = require('../models/email-link-model')
const jwt = require('jsonwebtoken')

let FamilyId = require('../models/familyId-model')

/* GET users listing. */
router.route('/').get((req, res )=>{
  Email_link.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err ))
})

//add new user
router.route('/generate').post(async (req, res )=>{
    const userEmail = req.body.userEmail;
    let currentId = "";
    const trakGeneId = req.body.trakGeneId?req.body.trakGeneId:"";
    const clientEmail = req.body.clientEmail;
    const clientType = req.body.clientType;
    const baseURL  = req.body.baseURL;

    /*
    console.log('create fid')
    try {
      
      const fid = new FamilyId({
        _id: process.env.Family_ID,
        currentId: 1,
      });
      await fid.save();
    }
    catch(e){}
    */
    
    try{
        const userData = await Email_link.findOne({email:userEmail}, (err, item) =>{
        if (err) throw err;
        })
        
        if(userData != null){
            let existingLink = `https://${baseURL}/form?token=${userData.token}&id=${userData.currentId}`
            res.json({email: userData.email, link: existingLink,exists:true})
        }

        else{
            
            //getExistingfamilyId
            const familyIdData = await FamilyId.findById({_id:process.env.Family_ID}, (err, item) =>{
            if (err) throw err;
            })
            console.log(process.env.Family_ID)
            console.log(familyIdData)
            if(familyIdData != null){
                currentId = familyIdData.currentId;
            }

            // link=jwt.sign
            let token = jwt.sign({email:userEmail,trakGeneId:trakGeneId,userEmail:clientEmail, userType:clientType},process.env.LINK_TOKEN_SECRET,{ expiresIn: "30d" })
            // res.json({token:token})
            // new Email_link({})
            let link = `https://${baseURL}/form?token=${token}&id=${currentId}`
            const email = userEmail;
            const newEmail = new Email_link({
                email,
                token,
                currentId,
                trakGeneId,
                userEmail:clientEmail, 
                userType:clientType
            })
            // await email_link.save()
            await newEmail.save();
            console.log("new user created");

            //updateFamilyId
            const updatedId = {
                currentId: currentId+1,
            }
        

            await FamilyId.findByIdAndUpdate({_id: process.env.Family_ID},updatedId);

            res.json({id:newEmail._id,email: newEmail.email, link: link,currentId:currentId})
            
        }  
    }catch(err){
        console.log(err)
        res.sendStatus(500)

    }
})

module.exports = router;