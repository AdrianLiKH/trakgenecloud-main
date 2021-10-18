const router = require('express').Router();
let Genetics = require('../models/genetic-model')

/* GET users listing. */
router.route('/').get((req, res )=>{
  Genetics.find()
    .then(geneticInfo => res.json(geneticInfo))
    .catch(err => res.status(400).json('Error: ' + err ))
})

//add new user
router.route('/add').post((req, res )=>{
  const isJewish = req.body.isJewish == "yes"? true : false;
  const isWomanCancer = req.body.isWomanCancer == "yes"? true : false;
  const agePeriods = req.body.isWomanCancer == "yes"? Number(req.body.agePeriods) : null;
  const ageMenopause = req.body.isWomanCancer == "yes"?Number(req.body.ageMenopause) : null;
  const isContraseptive = req.body.isWomanCancer == "yes"?req.body.isContraseptive : null;
  const contraceptiveAge = req.body.isWomanCancer == "yes"?Number(req.body.contraceptiveAge) : null; 
  const isHrt = req.body.isWomanCancer == "yes"? req.body.isHrt: null;
  const HrtLong = req.body.isWomanCancer == "yes"? Number(req.body.HrtLong) : null; 
  const breastProblem = req.body.isWomanCancer == "yes"? req.body.breastProblem : null; 
  const majorIllness = req.body.majorIllness;
  const riskCancer = req.body.riskCancer;
  const chancesCancer = req.body.chancesCancer;
  const mainGeneticsQuestions = req.body.mainGeneticsQuestions;

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
    mainGeneticsQuestions
  })

  newGeneticInfo.save()
    .then(() => res.json('Genetic information added!'))
    .catch(err => res.status(400).json('Error: ' + err ))

})

module.exports = router;
