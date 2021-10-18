const router = require('express').Router();
let Family = require('../models/family-model')

/* GET users listing. */
router.route('/').get((req, res) => {
  Family.find()
    .then(familyMembers => res.json(familyMembers))
    .catch(err => res.status(400).json('Error: ' + err))
})

//add new user
router.route('/add').post((req, res) => {

  const relationship = req.body.relationship;
  const firstName = req.body.firstName;
  const maidenName = req.body.maidenName;
  const lastName = req.body.lastName;
  const motherName = req.body.motherName;
  const fatherName = req.body.fatherName;
  const dob = req.body.dob;
  const alive = req.body.alive === "yes" ? true : false;
  const dod = req.body.alive === "no" ? req.body.dod : null;
  // const cancerPlace = req.body.cancerPlace;
  // const cancerAge = Number(req.body.cancerAge);
  // const cancerTreated = req.body.cancerTreated;

  const newFamilyMember = new Family({
    firstName,
    maidenName,
    lastName,
    relationship,
    motherName,
    fatherName,
    dob,
    alive,
    dod,
    // cancerPlace,
    // cancerAge,
    // cancerTreated
  })

  newFamilyMember.save()
    .then(() => res.json('Family member added!'))
    .catch(err => res.status(400).json('Error: ' + err))

})

module.exports = router;
