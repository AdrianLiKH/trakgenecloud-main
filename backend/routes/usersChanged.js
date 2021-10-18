const router = require('express').Router();
let UserChanged = require('../models/user-model-changed')
let FamilyChanged = require('../models/family-model-changed')
let GeneticsChanged = require('../models/genetic-model-changed')




//get user values existing in database
router.route('/addChanged').post(async (req, res )=>{
    const changedUserData = req.body.changedUserData;
    const changedFamilyData = req.body.changedFamilyData;
    const changedGeneticData = req.body.changedGeneticData;
    const resId = req.body.resId;
    const changedId = req.body.changedId;
    const userEmail = req.body.userEmail;
    const userType = req.body.userType;
    
    try{
        const newUser = new UserChanged({...changedUserData,userEmail,userType})

        const updateUser = {...changedUserData,userEmail,userType}


        if(!changedId === true){
            await newUser.save();
            console.log("New changed user was created");
            user_id = newUser._id;
            }else{
            await UserChanged.findOneAndUpdate({oldUser_id: changedUserData["oldUser_id"]},updateUser);
            console.log("New changed user was updated");
            user_id = newUser._id;
        }
        
        //declaring variables for family members
        let relationship,motherName,fatherName,alive,dod,cancerPlace,cancerAge,cancerTreated,familyMemberId,isfamilyMemberDateConfirmed


    await changedFamilyData.map(async (member,index) => {
      const familyMember = new FamilyChanged({

        ...changedFamilyData[index],userEmail,userType
      })

      const updateFamilyMember = {

        ...changedFamilyData[index],userEmail,userType
      }


      if(!changedId === true){
        await familyMember.save();
        console.log("New family member created");
        }else {
        await FamilyChanged.findOneAndUpdate({familyMemberId: familyMemberId},updateFamilyMember);
        console.log("New family member was updated");
      }
      
    });

    
    
    const newGeneticInfo = new GeneticsChanged({...changedGeneticData,userEmail,userType
    })

    const updateNewGeneticInfo = {...changedGeneticData,userEmail,userType}

    

     if(!changedId === true){
      console.log(newGeneticInfo)
      await newGeneticInfo.save();
      console.log('Genetic information created')
    }else{
      await GeneticsChanged.findOneAndUpdate({user_id: user_id},updateNewGeneticInfo);
      console.log("Genetic information was updated");
    }
        res.sendStatus(200)
    }
    catch(err) {
        console.log(err)
        res.sendStatus(500)
    }
})

//get family data from database
router.route('/getDetails').post(async (req, res )=>{
  const _id = req.body.user_id;
  const userEmail = req.body.userEmail;
  try{
    //getting user data
    const userDataChanged = await UserChanged.findOne({userEmail:userEmail}, (err, item) =>{
      if (err) throw err;
    })

    if(userDataChanged){
      //getting family data
      familyDataChanged = await FamilyChanged.find({userEmail:userEmail}, (err, item) =>{
        if (err) throw err;
      })
      
      geneticDataChanged = await GeneticsChanged.findOne({userEmail:userEmail}, (err, item) =>{
        if (err) throw err;
      })
      res.json({userDataChanged,familyDataChanged,geneticDataChanged}) 
    }else{
        res.json({exists:false})
    }
    
    
  }
  catch(err) {
    console.log(err)
    res.sendStatus(500)
  }
    
})

//get user values existing in database
router.route('/addChangedIndividual').post(async (req, res )=>{
    const changedUserData = req.body.changedUserData
    const changedFamilyData = req.body.changedFamilyData
    const typeUser = req.body.typeUser
    const userType = req.body.userType;
    const userEmail = req.body.userEmail;
    
    try{
        if(typeUser === 0){
          const newUser = new UserChanged({...changedUserData,userType,userEmail})

          const updateUser = {...changedUserData, userType, userEmail}

          if(!changedUserData._id === true){
            await newUser.save();
            console.log("New changed user was created");
            user_id = newUser._id;
            }else{
            await UserChanged.findOneAndUpdate({oldUser_id: changedUserData.oldUser_id},updateUser);
            console.log("New changed user was updated");
            user_id = newUser._id;
          }
        }else{
          const newFamilyMember = new FamilyChanged({...changedFamilyData, userType, userEmail})
          const familyMember = {...changedFamilyData, userType, userEmail}

          if(!changedFamilyData._id === true){
            await newFamilyMember.save();
            console.log("New family member created");
            }else {
            await FamilyChanged.findOneAndUpdate({familyMemberId: changedFamilyData.familyMemberId},familyMember);
            console.log("New family member was updated");
          }
        }
        
        res.sendStatus(200)
    }
    catch(err) {
        console.log(err)
        res.sendStatus(500)
    }
})




    

module.exports = router;
