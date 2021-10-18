const router = require('express').Router();
let User = require('../models/user-model')
let Family = require('../models/family-model')
let Genetics = require('../models/genetic-model')
let UserChanged = require('../models/user-model-changed')
let FamilyChanged = require('../models/family-model-changed')
let GeneticsChanged = require('../models/genetic-model-changed')
let SMTP_MODEL = require('../models/smtp-model')
const CryptoJS = require("crypto-js");

// const convert = require('xml-js');
const xml2js = require('xml2js')
const fs = require('fs')
// router.use("/", (req, res, next) => {
// verify token
// if true
// req.userData.email = email
// next()
// })

/* GET users listing. */
// router.route('/').get((req, res )=>{
//   User.find()
//     .then(users => res.json(users))
//     .catch(err => res.status(400).json('Error: ' + err ))
// })


//get user values existing in database
router.route('/getUsers').post(async (req, res) => {
  let userId = []
  const userEmail = req.body.userEmail;
  try {
    //User.find({disableForm:"true"}
    const userData = await User.find({ userEmail: userEmail }, (err, item) => {
      if (err) throw err;
    })
    if (userData) {
      userData.map((item, i) => {
        let cipherFirstName = CryptoJS.AES.decrypt(userData[i].firstName, process.env.USER_SECRET);
        userData[i].firstName = cipherFirstName.toString(CryptoJS.enc.Utf8);
        let cipherLastName = CryptoJS.AES.decrypt(userData[i].lastName, process.env.USER_SECRET);
        userData[i].lastName = cipherLastName.toString(CryptoJS.enc.Utf8);

        // let cipherAddress =CryptoJS.AES.decrypt(userData[i].address, process.env.USER_SECRET);  
        // userData[i].address = cipherAddress.toString(CryptoJS.enc.Utf8);

        userId.push(item._id)
      })
    }

    await Promise.all(userId.map(async (item, index) => {

      let user = await UserChanged.findOne({ oldUser_id: item }, (err, item) => {
        if (err) throw err;
      }).lean();

      if (!user === true) {

      } else {
        let changedUser = { ...user }
        delete changedUser._id
        userData[index] = { ...userData[index]._doc, ...changedUser }
      }
    }))

    res.json([...userData])
  }
  catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

//get family data from database
router.route('/getFamilyData').post(async (req, res) => {
  const userId = req.body.userId
  let familyData = []
  let familyId = []
  try {
    await Promise.all(userId.map(async (item, index) => {
      let familyMemberInfo = await Family.find({ user_id: item }, (err, info) => {
        if (err) throw err;
      }).lean();

      if (familyMemberInfo) {
        familyMemberInfo.map((item) => {
          familyData.push(item)
          familyId.push(item.user_id)
        })
      }
    }))
      .catch(err => {
        console.log(err);
      })


    await Promise.all(familyId.map(async (item, index) => {
      let familyMemberInfo = await FamilyChanged.findOne({ user_id: item }, (err, info) => {
        if (err) throw err;
      }).lean();

      if (familyMemberInfo) {
        let changedFamilyMemberInfo = { ...familyMemberInfo }
        delete changedFamilyMemberInfo._id
        familyData[index] = { ...familyData[index], ...changedFamilyMemberInfo }
      }
    }))
      .catch(err => {
        console.log(err);
      })
    res.json(familyData)

  }
  catch (err) {
    console.log(err)
    res.sendStatus(500)
  }

})

//get family data from database
router.route('/getDetails').post(async (req, res) => {
  const email = req.body.email;
  const userEmail = req.body.userEmail;
  let familyData = ''
  let geneticData = ''
  try {
    //getting user data
    const userData = await User.findOne({ email: email }, (err, item) => {
      if (err) throw err;
    })

    if (userData) {
      //getting family data
      familyData = await Family.find({ user_id: userData._id }, (err, item) => {
        if (err) throw err;
      })

      geneticData = await Genetics.findOne({ user_id: userData._id }, (err, item) => {
        if (err) throw err;
      })
    }

    let cipherFirstName = CryptoJS.AES.decrypt(userData.firstName, process.env.USER_SECRET);
    userData.firstName = cipherFirstName.toString(CryptoJS.enc.Utf8);
    let cipherLastName = CryptoJS.AES.decrypt(userData.lastName, process.env.USER_SECRET);
    userData.lastName = cipherLastName.toString(CryptoJS.enc.Utf8);
    // let cipherAddress =CryptoJS.AES.decrypt(userData.address, process.env.USER_SECRET);  
    // userData.address = cipherAddress.toString(CryptoJS.enc.Utf8);

    res.json({ userData, familyData, geneticData })
  }
  catch (err) {
    console.log(err)
    res.sendStatus(500)
  }

})

//get member data based on familyid or proband id
router.route('/getPersonalDetails').post(async (req, res) => {
  const userType = req.body.userType;
  const id = req.body.id;
  console.log(id)
  const clientType = req.body.clientType;
  const clientEmail = req.body.clientEmail;
  let userData, changedUserData, familyData, changedFamilyData

  try {
    //getting user data
    if (userType === 0) {
      userData = await User.findOne({ proBandId: id }, (err, item) => {
        if (err) throw err;
      })

      changedUserData = await UserChanged.findOne({ proBandId: id }, (err, item) => {
        if (err) throw err;
      })

    } else {
      familyData = await Family.findOne({ familyMemberId: id }, (err, item) => {
        if (err) throw err;
      })

      changedFamilyData = await FamilyChanged.findOne({ familyMemberId: id }, (err, item) => {
        if (err) throw err;
      })
    }
    let cipherFirstName = CryptoJS.AES.decrypt(userData.firstName, process.env.USER_SECRET);
    userData.firstName = cipherFirstName.toString(CryptoJS.enc.Utf8);

    res.json({ userData, changedUserData, familyData, changedFamilyData })
  }
  catch (err) {
    console.log(err)
    res.sendStatus(500)
  }

})


// convert data to XML file and download
router.route('/getXML').post(async (req, res) => {
  const _id = req.body._id;
  const proBandId = req.body.proBandId
  // let userData, changedUserData,familyData,changedFamilyData

  try {
    //getting user data

    let userData = await User.findOne({ _id: _id }, (err, item) => {
      if (err) throw err;
    })
    let cipherFirstName = CryptoJS.AES.decrypt(userData.firstName, process.env.USER_SECRET);
    userData.firstName = cipherFirstName.toString(CryptoJS.enc.Utf8);
    let cipherLastName = CryptoJS.AES.decrypt(userData.lastName, process.env.USER_SECRET);
    userData.lastName = cipherLastName.toString(CryptoJS.enc.Utf8);
    // let cipherAddress =CryptoJS.AES.decrypt(userData.address, process.env.USER_SECRET);  
    // userData.address = cipherAddress.toString(CryptoJS.enc.Utf8);

    let changedUserData = await UserChanged.findOne({ oldUser_id: _id }, (err, item) => {
      if (err) throw err;
    })

    let familyData = await Family.find({ user_id: _id }, (err, item) => {
      if (err) throw err;
    })

    let changedFamilyData = await FamilyChanged.findOne({ user_id: _id }, (err, item) => {
      if (err) throw err;
    })

    let geneticData = await Genetics.findOne({ user_id: _id }, (err, item) => {
      if (err) throw err;
    })

    let changedGeneticData = await GeneticsChanged.findOne({ user_id: _id }, (err, item) => {
      if (err) throw err;
    })

    let updatedUserData, updatedGeneticData
    let updatedFamilyData = []

    if (!changedUserData === true) {
      updatedUserData = { ...userData._doc }
    } else {
      updatedUserData = { ...userData._doc, ...changedUserData._doc }
    }

    if (!changedGeneticData === true) {
      updatedGeneticData = { ...geneticData._doc }
    } else {
      updatedGeneticData = { ...geneticData._doc, ...changedGeneticData._doc }
    }

    if (!changedFamilyData === true) {
      updatedFamilyData = [...familyData]
    } else {
      await Promise.all(familyData.map(async (item, index) => {
        let changedFamilyMemberInfo = await FamilyChanged.findOne({ familyMemberId: familyData[index].familyMemberId }, (err, info) => {
          if (err) throw err;
        }).lean();

        updatedFamilyData[index] = { ...familyData[index]._doc, ...changedFamilyMemberInfo }
      }))
        .catch(err => {
          console.log(err);
        })
    }
    let jsFamilyData = []
    updatedFamilyData.map((item, index) => {
      jsFamilyData[index] = { firstName: updatedFamilyData[index].firstName, maidenName: updatedFamilyData[index].maidenName, lastName: updatedFamilyData[index].lastName, relationship: updatedFamilyData[index].relationship, motherName: updatedFamilyData[index].motherName ?? "", fatherName: updatedFamilyData[index].fatherName ?? "", dob: String(updatedFamilyData[index].dob).split("T")[0], alive: updatedFamilyData[index].alive, dod: updatedFamilyData[index].alive === "true" ? "" : String(updatedFamilyData[index].dod).split("T")[0], cancerPlace: updatedFamilyData[index].cancerPlace, cancerAge: updatedFamilyData[index].cancerAge, cancerTreated: updatedFamilyData[index].cancerTreated ?? "" }

    })

    let jsUserData = { firstName: updatedUserData.firstName, lastName: updatedUserData.lastName, maidenName: updatedUserData.maidenName, gender: updatedUserData.gender, address: updatedUserData.address, dob: String(updatedUserData.dob).split("T")[0], gpName: updatedUserData.gpName, gpAddress: updatedUserData.gpAddress, mobile: updatedUserData.mobile, discloseIdentity: updatedUserData.discloseIdentity, receiveLetter: updatedUserData.receiveLetter, email: updatedUserData.email, disableForm: updatedUserData.disableForm, familyId: updatedUserData.familyId, proBandId: updatedUserData.proBandId, isUserDateConfirmed: updatedUserData.isUserDateConfirmed ?? "" }

    let jsGeneticData = { isJewish: updatedGeneticData.isJewish, isWomanCancer: updatedGeneticData.isWomanCancer, ageMenopause: updatedGeneticData.isWomanCancer === "false" ? null : updatedGeneticData.ageMenopause, isContraseptive: updatedGeneticData.isWomanCancer === "false" ? null : updatedGeneticData.isContraseptive, contraceptiveAge: updatedGeneticData.isWomanCancer === "false" ? null : updatedGeneticData.contraceptiveAge, isHrt: updatedGeneticData.isWomanCancer === "false" ? null : updatedGeneticData.isHrt, HrtLong: updatedGeneticData.isWomanCancer === "false" ? null : updatedGeneticData.HrtLong, breastProblem: updatedGeneticData.breastProblem, majorIllness: updatedGeneticData.majorIllness, riskCancer: updatedGeneticData.riskCancer, chancesCancer: updatedGeneticData.chancesCancer, mainGeneticsQuestions: updatedGeneticData.mainGeneticsQuestions, }
    let jsObjData = { probandData: jsUserData, familyData: jsFamilyData, geneticData: jsGeneticData }
    // let jsObjData = {probandData:{...userData._doc, ...changedUserData._doc}, familyData:{...familyData._doc, ...changedFamilyData._doc}, geneticData:{...geneticData._doc}}
    //var options = {compact: true, ignoreComment: true, spaces: 4};
    const builder = new xml2js.Builder();
    const xmlData = builder.buildObject(jsObjData);
    res.set('Content-Type', 'text/xml');
    res.send(xmlData)


    // res.setHeader('Content-Type', 'application/json')
    // res.json({jsObjData})
  }
  catch (err) {
    console.log(err)
    res.sendStatus(500)
  }

})

router.route('/setSmtp').post(async (req, res) => {
  const { host, user, password, port } = req.body.smtpSettings;
  const secure = port == 465 ? true : false;

  try {
    const smtpData = await SMTP_MODEL.findOne({}, (err, item) => {
      if (err) throw err;
    })


    if (!smtpData === true) {
      const newSmtp = new SMTP_MODEL({
        host,
        user,
        password,
        port,
        secure
      })
      await newSmtp.save();
      console.log("created")
    } else {
      const updateSmtp = {
        host,
        user,
        password,
        port,
        secure
      }
      await SMTP_MODEL.findOneAndUpdate({ _id: smtpData._id }, updateSmtp, { useFindAndModify: false });
      console.log("updated")
    }

    res.sendStatus(200)
  }
  catch (err) {
    console.log(err)
    res.sendStatus(500)
  }

})

router.route('/getSmtp').get(async (req, res) => {

  try {
    const smtpData = await SMTP_MODEL.findOne({}, (err, item) => {
      if (err) throw err;
    })


    if (!smtpData === true) {
      res.json({ exists: true })
    } else {
      res.json({ smtpData, exists: true })
    }

  }
  catch (err) {
    console.log(err)
    res.sendStatus(500)
  }

})

router.route('/deleteFamily').post(async (req, res) => {
  const familyDetails = req.body.deleteMember;
  console.log(familyDetails)
  try {
    if (familyDetails.isProband === false) {
      const result = await Family.deleteOne({ familyMemberId: familyDetails.familyMemberId }, (err, item) => {
        if (err) throw err;
      })

      if (result) {
        console.log('Member Deleted')
        res.sendStatus(200)
      } else {
        console.log('Could not find member')
        console.log(result)
        res.sendStatus(500)
      }
    } else {
      console.log(familyDetails.proBandId)
      const proband = await User.find({ proBandId: familyDetails.proBandId }, (err, item) => {
        if (err) throw err;
      })

      if (proband) {
        const proband_id = proband[0]._id
        const deletedMembers = await Family.deleteMany({ user_id: proband_id }, (err, item) => {
          if (err) throw err;
        })

        const deletedProband = await User.deleteOne({ _id: proband_id }, (err, item) => {
          if (err) throw err;
        })

        res.sendStatus(200)

      } else {
        res.sendStatus(500)
      }
    }

  }
  catch (err) {
    console.log(err)
    res.sendStatus(500)
  }

})



module.exports = router;
