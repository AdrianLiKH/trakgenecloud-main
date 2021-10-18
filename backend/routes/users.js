const router = require('express').Router();
let User = require('../models/user-model')
let Family = require('../models/family-model')
let Genetics = require('../models/genetic-model')
let SMTP = require('../models/smtp-model');

const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");

let FamilyId = require('../models/familyId-model')

const CryptoJS = require("crypto-js");

// router.use("/", (req, res, next) => {
// verify token
// if true
// req.userData.email = email
// next()
// })

/* GET users listing. */
router.route('/').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err))
})


router.route('/addfid').get(async (req, res) => {
  console.log('addfid')
  try {
    
    const fid = new FamilyId({
      _id: process.env.Family_ID,
      currentId: 1,
    });
    await fid.save();
  }
  catch(e){}
})

//add new user
router.route('/add').post(async (req, res) => {
  try {

    const personalDetails = req.body.personalDetails;
    const children = req.body.children;
    const allGeneticInfo = req.body.allGeneticInfo;
    const resId = (Object.keys(req.body.responseId).length === 0) ? { "family_id": [] } : req.body.responseId;
    let familyNumber = 2
    let user_id = !resId['user_id'] === true ? "" : resId['user_id']

    // personal Details
    let email = personalDetails.email;
    let firstName = personalDetails.firstName;
    let lastName = personalDetails.lastName;
    let maidenName = personalDetails.maidenName;
    let gender = personalDetails.gender;
    // let address = personalDetails.address;
    let address_line1 = personalDetails.address_line1;
    let address_line2 = personalDetails.address_line2;
    let address_city = personalDetails.address_city;
    let address_post = personalDetails.address_post;
    let dob = new Date(personalDetails.dob)
    let gpName = personalDetails.gpName;
    let familyId = `g-${personalDetails.familyId}`;
    let proBandId = personalDetails.proBandId;
    // let gpAddress = personalDetails.gpAddress;
    let gpAddress_line1 = personalDetails.gpAddress_line1;
    let gpAddress_line2 = personalDetails.gpAddress_line2;
    let gpAddress_city = personalDetails.gpAddress_city;
    let gpAddress_post = personalDetails.gpAddress_post;
    let mobile = Number(personalDetails.mobile);
    let discloseIdentity = personalDetails.discloseIdentity === "true" ? true : false;
    let receiveLetter = personalDetails.receiveLetter === "false" ? false : true;
    let disableForm = req.body.isDisableForm;
    let trakGeneId = personalDetails.trakGeneId;
    let status = personalDetails.status;
    let userEmail = personalDetails.userEmail;
    let userType = personalDetails.userType;

    let cipherFirstName = CryptoJS.AES.encrypt(firstName, process.env.USER_SECRET).toString();
    let cipherLastName = CryptoJS.AES.encrypt(lastName, process.env.USER_SECRET).toString();
    // let cipherAddress = CryptoJS.AES.encrypt(address, process.env.USER_SECRET).toString();

    const newUser = new User({
      firstName: cipherFirstName,
      lastName: cipherLastName,
      maidenName,
      gender,
      address_line1,
      address_line2,
      address_city,
      address_post,
      // address:cipherAddress,
      dob,
      gpName,
      // gpAddress,
      mobile,
      gpAddress_line1,
      gpAddress_line2,
      gpAddress_city,
      gpAddress_post,
      discloseIdentity,
      receiveLetter,
      email,
      disableForm,
      familyId,
      proBandId,
      trakGeneId,
      status,
      userEmail,
      userType
    })

    const updateUser = {
      firstName: cipherFirstName,
      lastName: cipherLastName,
      maidenName,
      gender,
      address_line1,
      address_line2,
      address_city,
      address_post,
      // address:cipherAddress,
      dob,
      gpName,
      // gpAddress,
      gpAddress_line1,
      gpAddress_line2,
      gpAddress_city,
      gpAddress_post,
      mobile,
      discloseIdentity,
      receiveLetter,
      email,
      disableForm,
      familyId,
      proBandId,
      status,
    }
    if (!resId["user_id"] === true) {
      await newUser.save();
      console.log("New user was created");
      user_id = newUser._id;
    } else {
      await User.findByIdAndUpdate({ _id: resId["user_id"] }, updateUser);
      console.log("New user was updated");
    }


    // families

    //declaring variables
    let relationship, motherName, fatherName, alive, dod, cancerPlace, cancerAge, cancerTreated, familyMemberId
    let newFamilyMember = []
    await children.map(async (member, index) => {
      relationship = children[index].relationship;
      firstName = children[index].firstName;
      maidenName = children[index].maidenName;
      lastName = children[index].lastName;
      gender = children[index].gender;
      motherName = children[index].motherName;
      fatherName = children[index].fatherName;
      dob = new Date(children[index].dob)
      alive = children[index].alive;
      dod = children[index].alive == "false" ? new Date(children[index].dod) : "";
      // cancerPlace = children[index].cancerPlace;
      // cancerAge = Number(children[index].cancerAge);
      // cancerTreated = children[index].cancerTreated;
      familyMemberId = `${familyId}-${familyNumber}`
      familyNumber++;

      const familyMember = new Family({
        firstName,
        maidenName,
        lastName,
        gender,
        relationship,
        motherName,
        fatherName,
        dob,
        alive,
        dod,
        // cancerPlace,
        // cancerAge,
        // cancerTreated,
        user_id,
        familyId,
        familyMemberId,
        trakGeneId,
        userEmail,
        userType
      })

      const updateFamilyMember = {
        firstName,
        maidenName,
        lastName,
        gender,
        relationship,
        motherName,
        fatherName,
        dob,
        alive,
        dod,
        // cancerPlace,
        // cancerAge,
        // cancerTreated,
        familyId,
        familyMemberId,
        trakGeneId,
        userEmail,
        userType
      }

      if (resId["family_id"][index] === undefined) {
        await familyMember.save();
        console.log("New family member created");
      }
      else if (!resId["family_id"][index] === false) {
        await Family.findByIdAndUpdate({ _id: resId["family_id"][index] }, updateFamilyMember);
        console.log("New family member was updated");
      }
      else {
        console.log("Nothing done related to family")
      }

    });


    //genetic info
    const isJewish = allGeneticInfo.isJewish == "yes" ? true : false;
    const isWomanCancer = allGeneticInfo.isWomanCancer == "yes" ? true : false;
    const agePeriods = allGeneticInfo.isWomanCancer == "yes" ? Number(allGeneticInfo.agePeriods) : "";
    const ageMenopause = allGeneticInfo.isWomanCancer == "yes" ? Number(allGeneticInfo.ageMenopause) : "";
    const isContraseptive = allGeneticInfo.isWomanCancer == "yes" ? allGeneticInfo.isContraseptive : "";
    const contraceptiveAge = allGeneticInfo.isWomanCancer == "yes" ? Number(allGeneticInfo.contraceptiveAge) : "";
    const isHrt = allGeneticInfo.isWomanCancer == "yes" ? allGeneticInfo.isHrt : "";
    const HrtLong = allGeneticInfo.isWomanCancer == "yes" ? Number(allGeneticInfo.HrtLong) : "";
    const breastProblem = allGeneticInfo.isWomanCancer == "yes" ? allGeneticInfo.breastProblem : "";
    const majorIllness = allGeneticInfo.majorIllness;
    const riskCancer = allGeneticInfo.riskCancer;
    const chancesCancer = allGeneticInfo.chancesCancer;
    const mainGeneticsQuestions = allGeneticInfo.mainGeneticsQuestions;

    const newGeneticInfo = new Genetics({
      isJewish,
      isWomanCancer,
      agePeriods,
      ageMenopause,
      isContraseptive,
      contraceptiveAge,
      isHrt,
      HrtLong,
      breastProblem,
      majorIllness,
      riskCancer,
      chancesCancer,
      mainGeneticsQuestions,
      user_id,
      userEmail,
      userType
    })


    const updateNewGeneticInfo = {
      isJewish,
      isWomanCancer,
      agePeriods,
      ageMenopause,
      isContraseptive,
      contraceptiveAge,
      isHrt,
      HrtLong,
      breastProblem,
      majorIllness,
      riskCancer,
      chancesCancer,
      mainGeneticsQuestions,
      user_id,
      userEmail,
      userType
    }


    if (!resId["genetic_id"] === true) {
      await newGeneticInfo.save();
      console.log('Genetic information created')
    } else {
      console.log("---" + updateNewGeneticInfo.mainGeneticsQuestions + "   " + updateNewGeneticInfo.majorIllness)
      await Genetics.findByIdAndUpdate({ _id: resId["genetic_id"] }, updateNewGeneticInfo);
      console.log("Genetic information was updated");
    }
    res.sendStatus(200)
  }
  catch (err) {
    console.log(err)
    res.sendStatus(500)
  }

})

//get user values existing in database
router.route('/getValues').post(async (req, res) => {
  try {
    const email = req.body.email;
    let resId = { user_id: "", family_id: null, genetic_id: "" }

    const userData = await User.findOne({ email: email }, (err, item) => {
      if (err) throw err;
    })
    if (userData) {
      //getting personal data of user
      //address:userData.address,gpAddress:userData.gpAddress
      resId = { ...resId, user_id: userData._id }
      let personalData = { lastName: userData.lastName, firstName: userData.firstName, maidenName: userData.maidenName, gender: userData.gender, address_line1: userData.address_line1, address_line2: userData.address_line2, address_post: userData.address_post, address_city: userData.address_city, dob: userData.dob, gpName: userData.gpName, gpAddress_line1: userData.gpAddress_line1, gpAddress_line2: userData.gpAddress_line2, gpAddress_city: userData.gpAddress_city, gpAddress_post: userData.gpAddress_post, mobile: userData.mobile, discloseIdentity: userData.discloseIdentity, receiveLetter: userData.receiveLetter, email: userData.email }
      const familyData = await Family.find({ user_id: userData._id }, (err, item) => {
        if (err) throw err;
      })
      if (familyData) {
        let id_family = []
        await familyData.map(async (member, index) => {
          id_family[index] = member.user_id
        });
        resId = { ...resId, family_id: id_family }
      }

      const familyMemberDetails = []

      await familyData.map(async (member, index) => {

        familyMemberDetails.push({ relationship: familyData[index].relationship, firstName: familyData[index].firstName, maidenName: familyData[index].maidenName, lastName: familyData[index].lastName, motherName: familyData[index].motherName, fatherName: familyData[index].fatherName, dob: familyData[index].dob, alive: familyData[index].alive, dod: familyData[index].dod, cancerPlace: familyData[index].cancerPlace, cancerAge: familyData[index].cancerAge, cancerTreated: familyData[index].cancerTreated })
      });

      const geneticData = await Genetics.findOne({ user_id: userData._id }, (err, item) => {
        if (err) throw err;
      })

      if (geneticData)
        resId = { ...resId, genetic_id: geneticData._id }

      const geneticDetails = { agePeriods: geneticData.agePeriods, ageMenopause: geneticData.ageMenopause, isContraseptive: geneticData.isContraseptive, contraceptiveAge: geneticData.contraceptiveAge, isHrt: geneticData.isHrt, HrtLong: geneticData.HrtLong, breastProblem: geneticData.breastProblem, majorIllness: geneticData.majorIllness, riskCancer: geneticData.riskCancer, chancesCancer: geneticData.chancesCancer, mainGeneticsQuestions: geneticData.mainGeneticsQuestions };
      const jewish = geneticData.isJewish;
      const womanCancer = geneticData.isWomanCancer;

      let cipherFirstName = CryptoJS.AES.decrypt(personalData.firstName, process.env.USER_SECRET);
      personalData.firstName = cipherFirstName.toString(CryptoJS.enc.Utf8);
      let cipherLastName = CryptoJS.AES.decrypt(personalData.lastName, process.env.USER_SECRET);
      personalData.lastName = cipherLastName.toString(CryptoJS.enc.Utf8);
      // let cipherAddress =CryptoJS.AES.decrypt(personalData.address, process.env.USER_SECRET);  
      // personalData.address = cipherAddress.toString(CryptoJS.enc.Utf8);

      res.json({ personalData, familyMemberDetails, geneticDetails, jewish, womanCancer, resId })
    }

    // res.sendStatus(200)
  }
  catch (err) {
    console.log(err)
    res.sendStatus(500)
  }

})

//get user values existing in database
router.route('/verifyToken').post(async (req, res) => {
  try {
    let token = req.body.token;
    const key = process.env.LINK_TOKEN_SECRET;
    const tokenVals = jwt.verify(token, key);
    const userEmail = tokenVals.email
    const trakGeneId = tokenVals.trakGeneId

    //client

    const clientEmail = tokenVals.userEmail;
    const clientType = tokenVals.userType;



    const userData = await User.findOne({ email: userEmail }, (err, item) => {
      if (err) throw err;
    })

    // if(!userData.disableForm == true){

    // }else if(userData.disableForm == "true"){
    //   token = "invalid"
    // }
    if (userData) {
      if (userData.disableForm == "true") {
        token = "invalid"
      }
    }

    // verify a token symmetric
    // try {
      // var decoded = jwt.verify(token, key);
      res.json({ email: userEmail, trakGeneId: trakGeneId, userEmail: clientEmail, userType: clientType })

    // } catch (err) {
    //   console.log(err)
    //   res.sendStatus(403);
    // }

    // res.sendStatus(200)
  }
  catch (err) {
    console.log(err)
    res.sendStatus(500)
  }

})

//Send Email
router.route('/sendmail').post(async (req, res) => {
  const userMail = req.body.userEmail;
  const userLink = req.body.userLink;
  try {

    const smtpData = await SMTP.findOne({}, (err, item) => {
      if (err) throw err;
    })

    if (smtpData) {
      let transporter = nodemailer.createTransport({
        host: smtpData.host,
        port: smtpData.port,
        secure: smtpData.secure === 'true', // true for 465, false for other ports
        auth: {
          user: smtpData.user, // generated ethereal user
          pass: smtpData.password, // generated ethereal password
        },
      });
      let message = `
          <p>Hello,</p>
          <br/>
          <p>You or your Dr or your Healthcare Provider have requested the collection of your family history. TrakGene is a secure web application that allows you to complete an electronic family history questionnaire. </p><br/>
          <p>Instructions</p>
          <ul>
            <li>Please use the secure link below to access and complete your family history questionnaire.</li>
            <li>Respond to / complete as much information as you can on the questionnaire.</li>
            <li>Click save at the end of each page to save your progress. You can use the link below to return to the questionnaire at any time and continue from where you left off.</li>
            <li>Submit the completed questionnaire within 30 days of this e-mail.</li>
          </ul><br/><br/>

          <p>Access your family history questionnaire using the following secure link: </p><br/>
          <a href=${userLink}> ${userLink}</a></br></br>

          <p>This secure link can be shared with other family members who may also be able to add information to it. Anyone you share the link with will be able to see all the information that has already been entered.</p><br/>

          <p>If you have any questions then you should contact your Dr or Healthcare Provider.</p><br/>

          <p><i>The e-mail was sent from the TrakGene Family History Questionnaire Application.</i></p><br/>
          </br></br></br></br>
          <p>Regards,</p>
          <p>Trakgene<p/>
        `;
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: smtpData.user, // sender address
        to: userMail, // list of receivers
        subject: "TrakGene Family History Enquiry Form", // Subject line
        text: "Hello world?", // plain text body
        html: message, // html body
      });

      res.sendStatus(200)
    }

  }
  catch (err) {
    console.log(err)
    res.sendStatus(500)
  }

  //get user values existing in database
  router.route('/getUsers').get(async (req, res) => {
    let userId = []
    try {
      const userData = await User.find({ disableForm: "true" }, (err, item) => {
        if (err) throw err;
      })

      if (userData) {
        userData.map((item, i) => {
          userId.push(item._id)
        })
      }

      res.sendStatus(200)
    }
    catch (err) {
      console.log(err)
      res.sendStatus(500)
    }

  })

})



module.exports = router;
