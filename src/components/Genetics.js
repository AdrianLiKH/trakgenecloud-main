import React, {useState} from 'react'
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';

const Genetics = (props) => {


    //states

    const [isError, setIsError ] = useState(false)
    // const [stateErr,setstateErr] =  useState({jewish:false,womanCancer:false,agePeriods:false,isContraseptive:false,isHrt:false,majorIllness:false,breastProblem:false,riskCancer:false,chancesCancer:false})

    const checkEmptyValues = ()=>{
        const currentObj = {...props.geneticInfo, jewish:props.isJewish,womanCancer:props.isWomanCancer }
        const valuesToCheck = ["jewish","womanCancer","majorIllness","riskCancer","chancesCancer"]
        const valuesIfWomanCancer = ["agePeriods","isContraseptive","isHrt","breastProblem"]
        if(props.checkEmptyVals(valuesToCheck,currentObj)){
            setIsError(true)
                window.scrollTo({
                top:0,
                left:0,
                behavior:"smooth",
            })
            return true
        }else if(currentObj["womanCancer"] === "true" && props.checkEmptyVals(valuesIfWomanCancer,currentObj)){
            setIsError(true)
                window.scrollTo({
                top:0,
                left:0,
                behavior:"smooth",
            })
            return true
        }else{
            return false
        }
    }


    //save data to database
    const sendData = (e)=>{
        if(checkEmptyValues()){
            setIsError(true)
        }else{
            props.saveData();
        } 
    }

    //function to move to next step
    const moveNext = (e)=>{
        e.preventDefault();
        if(checkEmptyValues()){
        }else{
            props.nextStep();
        }   
    }
    //function to move to previous step
    // const [isJewish,setIsJewish] = useState("")
    // const [isWomanCancer,setIsWomanCancer] = useState("")
    // const [geneticInfo,setGeneticInfo] = useState({agePeriods:"",ageMenopause:"",isContraseptive:"",contraceptiveAge:"",isHrt:"",HrtLong:"",breastProblem:"",majorIllness:"", riskCancer:"",chancesCancer:"",mainGeneticsQuestions:""})
    const movePrev = (e)=>{
        e.preventDefault();
        
        props.prevStep();
    }

    //variable
    let options = []

    //to display error message in case of empty values
    let errorMessage = []

    //to check whether to disable buttons
    let isDisable = false
    if(props.disableButton)
        isDisable = props.disableButton  

    if(props.isWomanCancer === "true"){
        options.push(
            <>
               
                <Grid container spacing={3}>
                    
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            At what age did your periods start?
                        </Typography>
                    </Grid>
                     
                    <Grid item xs={4}>
                        <TextField
                            error={isError && props.geneticInfo.agePeriods==="" && props.isWomanCancer==="true"}
                            variant="outlined"
                            type = "number"
                            required id="standard-required"
                            fullWidth
                            name = "agePeriods"
                            value = {props.geneticInfo.agePeriods}
                            onChange = {props.handleGeneticChange}
                            className = 'form-input'
                        />
                    </Grid>
                     <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            At what age did you go through menopause?
                        </Typography>
                    </Grid>
                     
                    <Grid item xs={4}>
                         <TextField
                            variant="outlined"
                            type = "number"
                            helperText = "Enter if appropriate"
                            fullWidth
                            name = "ageMenopause"
                            value = {props.geneticInfo.ageMenopause}
                            onChange = {props.handleGeneticChange}
                            className = 'form-input'
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <div className="form-margin">
                            <FormControl component="fieldset" error={isError && props.geneticInfo.isContraseptive==="" && props.isWomanCancer==="true"}>
                                <FormLabel ><Typography variant="h6" gutterBottom>
                                        Do you take contraceptive pills?
                                    </Typography></FormLabel>
                                <RadioGroup aria-label="Contraceptive" name="isContraseptive" value={props.geneticInfo.isContraseptive} onChange={props.handleGeneticChange}>
                                    <FormControlLabel value = {"true"} control={<Radio />} label="Yes" />
                                    <FormControlLabel value={"false"} control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </Grid>
                    
                    <Grid item xs={12}>
                         <Typography variant="h6" gutterBottom>
                            If the answer to the previous question was yes, for how long have you been taking contraceptive pills?
                        </Typography>
                        <TextField
                            error={isError && props.geneticInfo.isContraseptive==="true" && props.isWomanCancer==="true" && props.geneticInfo.contraceptiveAge===""}
                            variant="outlined"
                            helperText = "Enter if appropriate"
                            fullWidth
                            name = "contraceptiveAge"
                            value = {props.geneticInfo.contraceptiveAge}
                            onChange = {props.handleGeneticChange}
                            className = 'form-input'
                        />
                    </Grid>
                    <Grid item xs={12}>
                          <div className="form-margin">
                            <FormControl component="fieldset"  error={isError && props.isWomanCancer==="true" && props.geneticInfo.isHrt===""}>
                                <FormLabel><Typography variant="h6" gutterBottom>
                                        Do you take Hormone Replacement Therapy (HRT)?
                                    </Typography></FormLabel>
                                <RadioGroup aria-label="HRT" name="isHrt" value={props.geneticInfo.isHrt} onChange={props.handleGeneticChange}>
                                    <FormControlLabel value = {"true"} control={<Radio />} label="Yes" />
                                    <FormControlLabel value={"false"} control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </Grid>
                   
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            If the answer to the previous question was yes, for how long have you been taking HRT?
                        </Typography>
                        <TextField
                            error={isError && props.isWomanCancer==="true" && props.geneticInfo.isHrt==="true" && props.geneticInfo.HrtLong === ""}
                            variant="outlined"
                            helperText = "Enter if appropriate"
                            fullWidth
                            name = "HrtLong"
                            value = {props.geneticInfo.HrtLong}
                            onChange = {props.handleGeneticChange}
                            className = 'form-input'
                        />
                    </Grid>
                   
                   <Grid item xs={12}>
                         
                    <Typography variant="h6" gutterBottom>
                        Have you ever had any problems with your breasts?  If so please describe nature, including dates, hospital and names of specialists seen
                        </Typography>
                        <TextField
                            error={isError && props.isWomanCancer==="true" && props.geneticInfo.breastProblem === ""}
                            variant="outlined"
                            helperText = "Enter if appropriate"
                            fullWidth
                            multiline
                            name = "breastProblem"
                            value = {props.geneticInfo.breastProblem}
                            onChange = {props.handleGeneticChange}
                            className = 'form-input'
                        />
                   </Grid>
                   
                </Grid>
            </>
        )
        
        

        if(isError === true){
            errorMessage.push(
                <>
                     <Grid item xs={12}>
                        <Typography variant="h5" gutterBottom>
                            Please fill all the values marked with an asterisk (*)
                        </Typography>
                    </Grid>
                </>
            )
        }
    }

    return (
        <>
            <div className="personal-form">
                    <h1>Genetic Information</h1>
                    <form >
                        <Grid container spacing={3}>
                            {errorMessage[0]}
                            <Grid item xs={12}>
                                <div className="form-margin">
                                    
                                    <FormControl component="fieldset" error={isError &&  props.geneticInfo.isJewish === ""} >
                                        <FormLabel><Typography variant="h6" gutterBottom>
                                        Some types of genetic cancer are slightly more common in Jewish families. Are you Jewish?
                                    </Typography></FormLabel>
                                        <RadioGroup aria-label="Disclosure" name="isJewish" value={props.isJewish} onChange={(e)=>props.setIsJewish(e.target.value)}>
                                            <FormControlLabel value = {"true"} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={"false"} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                 <div className="form-margin">
                                    <FormControl component="fieldset" error={isError &&  props.geneticInfo.isWomanCancer === ""}>
                                        <FormLabel><Typography variant="h6" gutterBottom>
                                        Are you a woman who has a history of breast or ovarian cancer?
                                    </Typography></FormLabel>
                                        <RadioGroup aria-label="Disclosure" name="isWomanCancer" value={props.isWomanCancer} onChange={(e)=>props.setIsWomanCancer(e.target.value)}>
                                            <FormControlLabel value = {"true"} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={"false"} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                            </Grid>
      
                            <div className="ovarianCancer">
                                {options}
                            </div>
                            <Grid item xs={12}>
                                 
                                <Typography variant="h6" gutterBottom>
                                    Have you suffered from any major illnesses, in particular have you had any form of cancer yourself?  Please give details including dates, hospital and names ofspecialists
                                </Typography>
                                    <TextField
                                        error={isError && props.geneticInfo.majorIllness === ""}
                                        variant="outlined"
                                        helperText = "Enter if appropriate"
                                        fullWidth
                                        multiline
                                        name = "majorIllness"
                                        value = {props.geneticInfo.majorIllness}
                                        onChange = {props.handleGeneticChange}
                                        className = 'form-input'
                                    />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h4" gutterBottom>
                                    Think about cancer in your family
                                </Typography>
                            </Grid>
                             <Grid item xs={12}>
                                 <div className="form-margin">
                                    <FormControl component="fieldset" error={isError && props.geneticInfo.riskCancer === ""}>
                                         <FormLabel><Typography variant="h6" gutterBottom>
                                        What do you think your risk of developing this cancer is compared with someone in the general population?
                                    </Typography></FormLabel>
                                        <RadioGroup 
                                            aria-label="Chances" 
                                            name="riskCancer" 
                                            value={props.geneticInfo.riskCancer} 
                                            onChange={props.handleGeneticChange}
                                        >
                                            <FormControlLabel value = {"muchLess"} control={<Radio />} label="Much Less" />
                                            <FormControlLabel value={"slightlyLess"} control={<Radio />} label="Slightly Less" />
                                            <FormControlLabel value = {"sameAs"} control={<Radio />} label="Same As" />
                                            <FormControlLabel value={"slightlyHigher"} control={<Radio />} label="Slightly Higher" />
                                            <FormControlLabel value={"muchHigher"} control={<Radio />} label="Much Higher" />
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <div className="form-margin">
                                    <FormControl 
                                        component="fieldset" 
                                        error={isError && props.geneticInfo.chancesCancer === ""}
                                    >
                                        <FormLabel><Typography variant="h6" gutterBottom>
                                        What do you think your chances are of developing this cancer in your lifetime? 
                                    </Typography></FormLabel>
                                        <RadioGroup aria-label="Chances" name="chancesCancer" value={props.geneticInfo.chancesCancer} onChange={props.handleGeneticChange}>
                                            <FormControlLabel value = {"0"} control={<Radio />} label="0 %" />
                                            <FormControlLabel value={"25"} control={<Radio />} label="25 %" />
                                            <FormControlLabel value = {"50"} control={<Radio />} label="50 %" />
                                            <FormControlLabel value={"75"} control={<Radio />} label="75 %" />
                                            <FormControlLabel value={"100"} control={<Radio />} label="100 %" />
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                            </Grid>
                                
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    What are your main questions that you would like to discuss with the genetics service?
                                </Typography>
                                    <TextField
                                        error={isError && props.geneticInfo.mainGeneticsQuestions === ""}
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        name = "mainGeneticsQuestions"
                                        value = {props.geneticInfo.mainGeneticsQuestions}
                                        onChange = {props.handleGeneticChange}
                                        className = 'form-input'
                                    />
                            </Grid>
                               
                            <Grid item xs={4}>
                                 <Button
                                    label = "Continue"
                                    color = 'primary'
                                    variant = 'outlined'
                                    className = "btn"
                                    onClick = {moveNext}
                                    disabled = {isDisable}
                                    fullWidth
                                
                                >Continue</Button>
                            </Grid>
                             <Grid item xs={4}>
                                  <Button
                                    label = "Back"
                                    color = 'primary'
                                    variant = 'outlined'
                                    className = "btn"
                                    onClick = {movePrev}
                                    // disabled = {isDisable}
                                    fullWidth
                                
                                >Previous </Button>
                            </Grid>
                            <Grid item xs={4}>
                                <Button
                                    label = "Save"
                                    color = 'primary'
                                    variant = 'outlined'
                                    className = "btn"
                                    disabled = {isDisable}
                                    onClick = {sendData}
                                    fullWidth
                                
                                >Save</Button>
                            </Grid>
    
                        </Grid>    
                    </form>
                </div>
        </>
    )
}

export default Genetics
