import React, {useState,useEffect} from 'react'
import axios from '../axios'

import {CONSTANTS} from './Constants'

//material
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import { Alert} from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import { useHistory} from 'react-router-dom'
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

//import qs to read url
const qs = require('qs');

const PatientRecord = (props) => {

    //state
    const [userData, setUserData] = useState({address:"",disableForm:"",discloseIdentity:"",dob:"",firstName:"",email:"",gender:"",gpAddress:"",gpName:"",lastName:"",mobile:"",receiveLetter:"",maidenName:"",dod:""})
    const [familyData, setFamilyData] = useState([])
    const [geneticData, setGeneticData] = useState({isJewish: "", isWomanCancer:"", riskCancer:"",chancesCancer:""})
    const [serverReturn, setServerReturn] = useState()
    const [alert, setAlert] = useState({severity:'',message:''})

    const [resId, setResId] = useState()
    const [changedId, setChangedId] = useState()
    const [isError, setIsError] = useState(false)

    const [changedUserData, setChangedUserData] = useState({isUserDateConfirmed:""})
    const [changedFamilyData, setChangedFamilyData] = useState([])
    const [changedGeneticData, setChangedGeneticData] = useState({})


    const [isEdit, setIsEdit] = useState(false)
    const [editColor, setEditColor] = useState("primary")


    //variables
    const userEmail = qs.parse(window.location.search, { ignoreQueryPrefix: true }).email
    const history = useHistory();


    //functions

    const goBack = (e)=>{
        history.push(`/admin/users`)
    }
    
    //set changed family
    const newFamilyData = (original, changed)=>{
        changed.map((item, index)=>{
            original[index] = {...original[index], ...item}
        })
        return original
    }
    useEffect(()=>{

        let path = '/admin/userData/getDetails'
        let pathChanged = '/admin/usersChanged/getDetails'
        //Getting user values from email
        console.log(userEmail, props.userEmail)
        axios.post(path, {email:userEmail,userEmail:props.userEmail })
            .then(res => {
                console.log("in success")
                console.log(res.data.userData)
                setUserData(res.data.userData)
                // setFamilyData(res.data.familyData)
                setGeneticData(res.data.geneticData)
                setResId(res.data.userData._id)
                axios.post(pathChanged, {user_id:res.data.userData._id,userEmail:props.userEmail })
                    .then(resInner => {
                        console.log("in res Inener")
                        if(resInner.data.exists === false){

                        }else{
                            setUserData({...res.data.userData,...resInner.data.userDataChanged})
                            setChangedUserData(resInner.data.userDataChanged)
                            setChangedId(resInner.data.userDataChanged._id)
                            setChangedFamilyData([...resInner.data.familyDataChanged])
                            setGeneticData({...res.data.geneticData,...resInner.data.geneticDataChanged})
                            // let newFamilyData = newFamilyData(res.data.familyData,resInner.data.familyDataChanged)
                            let newFamilyData =  res.data.familyData
                            
                            resInner.data.familyDataChanged.map((item, index)=>{
                                newFamilyData[index] = {...newFamilyData[index], ...item}
                            })
                            setFamilyData(newFamilyData)

                        }
                        
                    }).catch(err => { 
                        // alert('An error has occured')
                        console.log(err)
                    })
            }).catch(err => { 
                // alert('An error has occured')
                console.log(err)
            })
    
    },[])

    //make required changes to changed data
    // const addRequiredData = ()=>{
    //     setChangedUserData({...changedUserData, proBandId:userData.proBandId, email:userData.email, familyId:userData.familyId})
    // }



    //submit changed data into database
    const submitChanged = ()=>{
        setIsError(false)
        let isUserComplete = userData.firstName === "" || userData.lastName === "" || userData.dob === "" || !changedUserData.isUserDateConfirmed === true || userData.address === "" ||userData.mobile === "" 
        let isFamilyComplete = false

        changedFamilyData.map((item,index)=>{
            isFamilyComplete = isFamilyComplete || item.firstName === "" ||item.lastName === "" ||item.dob === "" 
        })

        let changedGeneticComplete = geneticData.mainGeneticsQuestions === ""

        if(isUserComplete || isFamilyComplete ||changedGeneticComplete){
            setIsError(true)
        }else{
            // addRequiredData()
            let path = '/admin/usersChanged/addChanged'
            axios.post(path, {changedUserData:{...changedUserData, proBandId:userData.proBandId, email:userData.email, familyId:userData.familyId, oldUser_id:userData._id},changedFamilyData:[...changedFamilyData],changedGeneticData:{...changedGeneticData, user_id:userData._id}, resId:resId, changedId:changedId,userEmail:props.userEmail,userType:props.userType })
                .then(res => {
                    console.log("in success")
                    setServerReturn(true)
                    setAlert({severity:"success", message:"The details were saved!"})
                }).catch(err => { 
                    console.log(err)
                    setServerReturn(true)
                    setAlert({severity:"error", message:"Error while saving values, please check the entered values"})
                })
        }
        
    }

    //edit Icon
    let handleLabelColor = (e) =>{
        editColor === "primary"? setEditColor("secondary"): setEditColor("primary")

        if(editColor === "primary"){
            setEditColor("secondary")
            setIsEdit(true)
        }else{
            setEditColor("primary")
            setIsEdit(false)
        }
    }

    //updating user info
    const handleUserChange = (e)=>{
        const name = e.target.name
        const value = e.target.value
        setChangedUserData({...changedUserData, [name]:value})
        setUserData({...userData, [name]:value})
    }

    //handleGeneticChange
    const handleGeneticChange = (e)=>{
        const name = e.target.name
        const value = e.target.value
        setChangedGeneticData({...changedGeneticData, [name]:value})
        setGeneticData({...geneticData, [name]:value})
    }

    
    //handleFamilyChange
    const handleFamilyChange = (e,index)=>{
        let familyMemberData =  [...familyData]
        let changedFamilyMemberData = [...changedFamilyData]
        const name = e.target.name
        const value = e.target.value
        familyMemberData[index] = {...familyMemberData[index], [name]:value}
        changedFamilyMemberData[index] = {...changedFamilyMemberData[index], [name]:value}
        setFamilyData([...familyMemberData])
        setChangedFamilyData([...changedFamilyMemberData])
        
    }

    // //close the alert
    // const closeAlert = ()=>{
    //     setServerReturn(false)
    // }

   
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setServerReturn(false);
  };

    

    //adding form elements for family members
    let familyDetails = []
    let options = []
    familyData.map((item, index)=>{
        changedFamilyData[index] = {...changedFamilyData[index], familyId:familyData[index].familyId, familyMemberId:familyData[index].familyMemberId, user_id:userData._id}
        familyDetails.push(
            <React.Fragment key={index}>
                <Grid item xs={12} >
                    <Typography variant="h5" gutterBottom>
                    {CONSTANTS.relations[item.relationship]}
                    </Typography>
                </Grid>
                <Grid item xs={4} >
                    <TextField
                        error = {isError === true && item.firstName === ""}
                        label="First Name" 
                        variant="outlined"
                        required id="standard-required"
                        helperText = {(isError === true && item.firstName === "")?"This value can't be empty":""}
                        fullWidth
                        name = "firstName"
                        value = {item.firstName}
                        onChange = {(e)=>handleFamilyChange(e, index)}
                        // className = 'form-input'
                        disabled = {!isEdit}
                    />
                </Grid>
                <Grid item xs={4} >
                    <TextField
                        label="Maiden Name" 
                        variant="outlined"
                        fullWidth
                        name = "maidenName"
                        value = {item.maidenName}
                         onChange = {(e)=>handleFamilyChange(e, index)}
                        // className = 'form-input'
                        disabled = {!isEdit}
                    />
                </Grid>
                <Grid item xs={4} >
                    <TextField
                        error = {isError === true && item.lastName === ""}
                        helperText = {(isError === true && item.lastName === "")?"This value can't be empty":""}
                        label="Last Name" 
                        variant="outlined"
                        required id="standard-required"
                        fullWidth
                        name = "lastName"
                        value = {item.lastName}
                         onChange = {(e)=>handleFamilyChange(e, index)}
                        // className = 'form-input'
                        disabled = {!isEdit}
                    />
                </Grid>
                <Grid item xs={4}>
                   <TextField
                        label="Mother's Name" 
                        variant="outlined"
                        fullWidth
                        name = "motherName"
                        value = {item.motherName}
                         onChange = {(e)=>handleFamilyChange(e, index)}
                        // className = 'form-input'
                        disabled = {!isEdit}
                    />
                </Grid>
                <Grid item xs={4}>
                   <TextField
                        label="Father's Name" 
                        variant="outlined"
                        fullWidth
                        name = "fatherName"
                        value = {item.fatherName}
                         onChange = {(e)=>handleFamilyChange(e, index)}
                        // className = 'form-input'
                        disabled = {!isEdit}
                    />
                </Grid>
                <Grid item xs={4}>
                   <TextField
                        error = {isError === true && item.dob === ""}
                        label="Date of Birth" 
                        variant="outlined"
                        helperText = {(isError === true && item.dob === "")?"This value can't be empty":""}
                        fullWidth
                        type="date"
                        name = "dob"
                        value = {!item.dob === true?null:item.dob.split("T")[0]}
                         onChange = {(e)=>handleFamilyChange(e, index)}
                        // className = 'form-input'
                        disabled = {!isEdit}
                    />
                </Grid>
                
                <Grid item xs={4}>
                   <TextField
                        // error = {true}
                        label="Date of Death" 
                        variant="outlined"
                        fullWidth
                        type="date"
                        name = "dod"
                        value = {!item.dod === true?"":item.dod.split("T")[0]}
                         onChange = {(e)=>handleFamilyChange(e, index)}
                        // className = 'form-input'
                        disabled = {!isEdit}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        helperText="If suffered/suffering from cancer"
                        label="Place where cancer occured" 
                        variant="outlined"
                        fullWidth
                        name = "cancerPlace"
                        value = {item.cancerPlace}
                         onChange = {(e)=>handleFamilyChange(e, index)}
                        // className = 'form-input'
                        disabled = {!isEdit}
                    />
                </Grid>
                <Grid item xs={4}>
                      <TextField
                        helperText="If suffered/suffering from cancer"
                        label="Age when cancer occured" 
                        variant="outlined"
                        fullWidth
                        type = "number"
                        name = "cancerAge"
                        value = {item.cancerAge}
                         onChange = {(e)=>handleFamilyChange(e, index)}
                        // className = 'form-input'
                        disabled = {!isEdit}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        helperText="If suffered/suffering from cancer"
                        label="Hospital where cancer was treated and name of specialist" 
                        variant="outlined"
                        fullWidth
                        multiline
                        name = "cancerTreated"
                        value = {item.cancerTreated}
                         onChange = {(e)=>handleFamilyChange(e, index)}
                        // className = 'form-input'
                        disabled = {!isEdit}
                    />
                </Grid>
                
                <Grid item xs={12}>
                    <FormControl component="fieldset" error = {isError === true && item.isfamilyMemberDateConfirmed === ""} >
                        <FormLabel ><Typography variant="h6" gutterBottom>
                                Have you confirmed the DOB and/or DOD of the family member?
                            </Typography></FormLabel>
                        <RadioGroup aria-label="familyDateConfirmed" name="isfamilyMemberDateConfirmed" value={!changedFamilyData[index] === true?"":changedFamilyData[index].isfamilyMemberDateConfirmed} onChange = {(e)=>handleFamilyChange(e, index)}>
                            <FormControlLabel value = {"true"} control={<Radio />} label="Yes" />
                            <FormControlLabel value={"false"} control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                </Grid>

            </React.Fragment>
        )
    })

    if(!geneticData === true){

    }else{
        if(geneticData.isWomanCancer === "true"){
            options.push(
                <React.Fragment key={"genetic-cancer"}>
        
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Age when periods started.
                        </Typography>
                    </Grid>
                        
                    <Grid item xs={4}>
                        <TextField
                            
                            variant="outlined"
                            type = "number"
                            id="standard-required"
                            fullWidth
                            name = "agePeriods"
                            value = {geneticData.agePeriods}
                            // onChange = {props.handleChange}
                            // className = 'form-input'
                            disabled = {!isEdit}
                        />
                    </Grid>
                        <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            At what age did Proband go through menopause?
                        </Typography>
                    </Grid>
                        
                    <Grid item xs={4}>
                            <TextField
                            variant="outlined"
                            type = "number"
                            helperText = "Age entered by proband"
                            fullWidth
                            name = "ageMenopause"
                            value = {geneticData.ageMenopause}
                            // onChange = {props.handleChange}
                            // className = 'form-input'
                            disabled = {!isEdit}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl component="fieldset"  disabled = {!isEdit}>
                            <FormLabel ><Typography variant="h6" gutterBottom>
                                    Does Proband take contraceptive pills?
                                </Typography></FormLabel>
                            <RadioGroup aria-label="Contraceptive" name="isContraseptive" value={geneticData.isContraseptive} >
                                <FormControlLabel value = {"true"} control={<Radio />} label="Yes" />
                                <FormControlLabel value={"false"} control={<Radio />} label="No" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                            How long has Proband been taking contraceptive pills?
                        </Typography>
                        <TextField
                            
                            variant="outlined"
                            helperText = "Enter if appropriate"
                            fullWidth
                            name = "contraceptiveAge"
                            value = {geneticData.contraceptiveAge}
                            // onChange = {props.handleChange}
                            // className = 'form-input'
                            disabled = {!isEdit}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl component="fieldset"   disabled = {!isEdit}>
                            <FormLabel><Typography variant="h6" gutterBottom>
                                    Does Proband take Hormone Replacement Therapy (HRT)?
                                </Typography></FormLabel>
                            <RadioGroup aria-label="HRT" name="isHrt" value={geneticData.isHrt} >
                                <FormControlLabel value = {"true"} control={<Radio />} label="Yes" />
                                <FormControlLabel value={"false"} control={<Radio />} label="No" />
                            </RadioGroup>
                        </FormControl>

                    </Grid>
                    
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            How long has Proband been taking HRT?
                        </Typography>
                        <TextField
                            
                            variant="outlined"
                            helperText = "Enter if appropriate"
                            fullWidth
                            name = "HrtLong"
                            value = {geneticData.HrtLong}
                            // onChange = {props.handleChange}
                            // className = 'form-input'
                            disabled = {!isEdit}
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
                            
                    <Typography variant="h6" gutterBottom>
                        Description of Proband's breast problems.
                        </Typography>
                        <TextField
                            
                            variant="outlined"
                            helperText = "Enter if appropriate"
                            fullWidth
                            multiline
                            name = "breastProblem"
                            value = {geneticData.breastProblem}
                            // onChange = {props.handleChange}
                            // className = 'form-input'
                            disabled = {!isEdit}
                        />
                    </Grid>
                </React.Fragment>
            )
        }  
    }
          
    return (
        <div className="epr-form">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {
                        (serverReturn === true)? <Snackbar open={serverReturn} autoHideDuration={6000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity={alert.severity}>
                            {alert.message}
                            </Alert>
                        </Snackbar>:""
                    }
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h3" gutterBottom>
                        User Information
                    </Typography>
                </Grid>
                <Grid item xs={12} className="flex-icon">
                    <Typography variant="h4" gutterBottom>
                        Personal Information
                    </Typography>
                    <IconButton aria-label="edit"  color={editColor} onClick={(e)=>handleLabelColor()}>
                        <EditIcon />
                    </IconButton>
                </Grid>
                <Grid item xs={4} >
                    <TextField
                        error = {isError === true && userData.firstName === ""}
                        helperText = {(isError === true && userData.firstName === "")?"This value can't be empty":""}
                        label="First Name" 
                        variant="outlined"
                        required id="standard-required"
                        fullWidth
                        name = "firstName"
                        value = {userData.firstName}
                        onChange = {handleUserChange}
                        // className = 'form-input'
                        disabled = {!isEdit}
                    />
                </Grid>
                <Grid item xs={4} >
                    <TextField
                        label="Maiden Name" 
                        variant="outlined"
                        fullWidth
                        name = "maidenName"
                        value = {userData.maidenName}
                        onChange = {handleUserChange}
                        // className = 'form-input'
                        disabled = {!isEdit}
                    />
                </Grid>
                <Grid item xs={4} >
                    <TextField
                        error = {isError === true && userData.lastName === ""}
                        helperText = {(isError === true && userData.lastName === "")?"This value can't be empty":""}
                        label="Last Name" 
                        variant="outlined"
                        required id="standard-required"
                        fullWidth
                        name = "lastName"
                        value = {userData.lastName}
                        onChange = {handleUserChange}
                        // className = 'form-input'
                        disabled = {!isEdit}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        error = {isError === true && userData.address === ""}
                        helperText = {(isError === true && userData.address === "")?"This value can't be empty":""}
                        label="Address" 
                        variant="outlined"
                        required id="standard-required"
                        fullWidth
                        name = "address"
                        value = {userData.address}
                        onChange = {handleUserChange}
                        // className = 'form-input'
                        disabled = {!isEdit}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        error = {isError === true && userData.dob === ""}
                        helperText = {(isError === true && userData.dob === "")?"This value can't be empty":""}
                        variant="outlined"
                        required id="standard-required"
                        fullWidth
                        name = "dob"
                        type = "date"
                        value = {userData.dob.split("T")[0]}
                        // value = "1970-01-01"
                        onChange = {handleUserChange}
                        // className = 'form-input'
                        disabled = {!isEdit}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        error = {isError === true && userData.mobile === ""}
                        helperText = {(isError === true && userData.mobile === "")?"This value can't be empty":""}
                        label="Mobile" 
                        variant="outlined"
                        required id="standard-required"
                        fullWidth
                        type = "number"
                        name = "mobile"
                        value = {userData.mobile}
                        onChange = {handleUserChange}
                        // className = 'form-input'
                        disabled = {!isEdit}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label="Email" 
                        variant="outlined"
                        required id="standard-required"
                        fullWidth
                        type = "email"
                        name = "email"
                        value = {userData.email}
                        onChange = {handleUserChange}
                        // className = 'form-input'
                        disabled = {true}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        error = {isError === true && userData.gpName === ""}
                        helperText = {(isError === true && userData.gpName === "")?"This value can't be empty":""}
                        label="GP Name" 
                        variant="outlined"
                        required id="standard-required"
                        fullWidth
                        name = "gpName"
                        value = {userData.gpName}
                        onChange = {handleUserChange}
                        // className = 'form-input'
                        disabled = {!isEdit}
                    />
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        error = {isError === true && userData.gpAddress === ""}
                        helperText = {(isError === true && userData.gpAddress === "")?"This value can't be empty":""}
                        label="GP Address" 
                        variant="outlined"
                        required id="standard-required"
                        fullWidth
                        name = "gpAddress"
                        value = {userData.gpAddress}
                        onChange = {handleUserChange}
                        // className = 'form-input'
                        disabled = {!isEdit}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label="Disclose Identity" 
                        variant="outlined"
                        required id="standard-required"
                        fullWidth
                        name = "discloseIdentity"
                        value = {userData.discloseIdentity=== "true"? "Yes":"No"}
                        onChange = {handleUserChange}
                        // className = 'form-input'
                        disabled = {true}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label="Receive Letter" 
                        variant="outlined"
                        required id="standard-required"
                        fullWidth
                        name = "receiveLetter"
                        value = {userData.receiveLetter=== "true"? "Yes":"No"}
                        onChange = {handleUserChange}
                        // className = 'form-input'
                        disabled = {true}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        // error = {true}
                        label="Form completed" 
                        variant="outlined"
                        required id="standard-required"
                        fullWidth
                        name = "disableForm"
                        value = {userData.disableForm=== "true"? "Yes":"No"}
                        onChange = {handleUserChange}
                        // className = 'form-input'
                        disabled = {true}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControl component="fieldset"  onChange = {handleUserChange}  error = {isError === true && userData.isUserDateConfirmed === ""}>
                        <FormLabel ><Typography variant="h6" gutterBottom>
                                Have you confirmed the DOB of the Proband?
                            </Typography></FormLabel>
                        <RadioGroup aria-label="Contraceptive" name="isUserDateConfirmed" value={changedUserData.isUserDateConfirmed} >
                            <FormControlLabel value = {"true"} control={<Radio />} label="Yes" />
                            <FormControlLabel value={"false"} control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                </Grid>
            </Grid>
            {!familyData===true?
            <Grid container spacing={3}>
                <Typography variant="h4" gutterBottom>
                    Family Members
                </Typography>
                {familyDetails}
            </Grid>:""}
            {!geneticData===true?
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h4" gutterBottom>
                        Proband Genetic Information
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <FormControl component="fieldset"  disabled = {!isEdit}>
                        <FormLabel>
                            <Typography variant="h6" gutterBottom>
                            Is Proband Jewish?
                            </Typography>
                        </FormLabel>
                        <RadioGroup aria-label="Disclosure" name="isJewish" value={!geneticData === true?"":geneticData.isJewish} onChange={handleGeneticChange}>
                            <FormControlLabel value = {"true"} control={<Radio />} label="Yes" />
                            <FormControlLabel value={"false"} control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl component="fieldset"  disabled = {!isEdit} onChange={handleGeneticChange}>
                        <FormLabel><Typography variant="h6" gutterBottom>
                        Is Proband a woman who has a history of breast or ovarian cancer?
                    </Typography></FormLabel>
                        <RadioGroup aria-label="Disclosure" name="isWomanCancer" value={!geneticData === true?"":geneticData.isWomanCancer} >
                            <FormControlLabel value = {"true"} control={<Radio />} label="Yes" />
                            <FormControlLabel value={"false"} control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                {options}
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                        Description of any major illnesses, paticularly any form of cancer suffered by Proband including dates, hospital and names of specialists
                    </Typography>
                        <TextField
                            
                            variant="outlined"
                            fullWidth
                            multiline
                            name = "majorIllness"
                            value = {!geneticData === true?"":geneticData.majorIllness}
                            onChange={handleGeneticChange}
                            // className = 'form-input'
                        />
                </Grid>
                <Grid item xs={12}>
                    <FormControl component="fieldset"  disabled = {!isEdit}>
                        <FormLabel>
                            <Typography variant="h6" gutterBottom>
                            What does Proband think his/her risk of developing this cancer is compared with someone in the general population.
                            </Typography>
                        </FormLabel>
                        <RadioGroup 
                            aria-label="Chances" 
                            name="riskCancer" 
                            value={!geneticData === true?"":geneticData.riskCancer} 
                            onChange={handleGeneticChange}
                        >
                            <FormControlLabel value = {"muchLess"} control={<Radio />} label="Much Less" />
                            <FormControlLabel value={"slightlyLess"} control={<Radio />} label="Slightly Less" />
                            <FormControlLabel value = {"sameAs"} control={<Radio />} label="Same As" />
                            <FormControlLabel value={"slightlyHigher"} control={<Radio />} label="Slightly Higher" />
                            <FormControlLabel value={"muchHigher"} control={<Radio />} label="Much Higher" />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl 
                        component="fieldset" 
                        
                        disabled = {!isEdit}
                    >
                        <FormLabel>
                            <Typography variant="h6" gutterBottom>
                            What do you think your chances are of developing this cancer in your lifetime? 
                            </Typography>
                        </FormLabel>
                        <RadioGroup aria-label="Chances" name="chancesCancer" value={!geneticData === true?"":geneticData.chancesCancer} onChange={handleGeneticChange}>
                            <FormControlLabel value = {"0"} control={<Radio />} label="0 %" />
                            <FormControlLabel value={"25"} control={<Radio />} label="25 %" />
                            <FormControlLabel value = {"50"} control={<Radio />} label="50 %" />
                            <FormControlLabel value={"75"} control={<Radio />} label="75 %" />
                            <FormControlLabel value={"100"} control={<Radio />} label="100 %" />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                 <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                        Main questions that the proband would like to discuss with the genetic service.
                    </Typography>
                    <TextField
                        
                        variant="outlined"
                        fullWidth
                        multiline
                        name = "mainGeneticsQuestions"
                        value = {!geneticData === true?"":geneticData.mainGeneticsQuestions}
                        onChange={handleGeneticChange}
                        // className = 'form-input'
                        disabled = {!isEdit}
                    />
                </Grid>
                <Grid item xs={4} >
                    <Button
                        label = "Back"
                        color = 'primary'
                        variant = 'outlined'
                        className = "btn"
                        onClick = {goBack}
                        fullWidth
                        startIcon = {<KeyboardBackspaceIcon/>}
                    
                    >Go Back</Button>
                </Grid>
                <Grid item xs={4}>
                        <Button
                        label = "Save"
                        color = 'primary'
                        variant = 'outlined'
                        className = "btn"
                        disabled = {!isEdit}
                        onClick = {submitChanged}
                        fullWidth
                    
                    >Save</Button>
                </Grid>
            </Grid>:""}
        </div>
    )
}

export default PatientRecord
