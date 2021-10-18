import React, {useState, useEffect} from 'react'
import axios from '../axios'
import PersonalInfo from './PersonalInfo'
import ChildrenInfo from './ChildrenInfo'
import Genetics from "./Genetics";
import ConfirmFamilyTable from "./ConfirmFamilyTable"
import Instructions from "./Instructions"
import Confirm from './Confirm'
import Success from './Success'
import Pagination from './Pagination'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import logo from '../assets/images/trakgeneLogo.png'
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';

//import qs to read url
const qs = require('qs');



const UserForm = () => {
    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
        },
        logo:{
            maxWidth:190,
            marginRight:'10px',
            marginLeft:'auto'
        },
        
        menuButton: {
            marginRight: theme.spacing(2),
        },
        }));


    //getting url params
    const token =  qs.parse(window.location.search, { ignoreQueryPrefix: true }).token
    const familyId = qs.parse(window.location.search, { ignoreQueryPrefix: true }).id
    // console.log(familyId)
    


    const classes = useStyles();
    const [step, setStep] = useState(0);
    const [personalDetails, setPersonalDetails] = useState({
        lastName:'',firstName:'',maidenName:'',address_line1:'', address_line2:'',address_city:'',address_post:'',dob:'',gpName:'',gpAddress_line1:'',gpAddress_line2:'',gpAddress_city:'',gpAddress_post:'',mobile:'',discloseIdentity:"",receiveLetter:"",email:"",gender:"",proBandId:"", trakGeneId:"",status:"",})
    const [userEmail, setUserEmail] = useState('')
    const [userType, setUserType] = useState('')
    const [trakGeneId, setTrakGeneId] = useState('')
    
    const [children,setChildren] = useState([])
    const [numberChildren,setNumberChildren] = useState(1)
    const [isJewish,setIsJewish] = useState("")
    const [isWomanCancer,setIsWomanCancer] = useState("")
    const [geneticInfo,setGeneticInfo] = useState({agePeriods:"",ageMenopause:"",isContraseptive:"",contraceptiveAge:"",isHrt:"",HrtLong:"",breastProblem:"",majorIllness:"", riskCancer:"",chancesCancer:"",mainGeneticsQuestions:""})
    const [disableButton,setDisableButton] = useState(true)
    const [formCompletionMessage,setFormCompletionMessage] = useState("Form Completion has been successful")
    const [formSaveMessage,setFormSaveMessage] = useState("Form has been successfully saved!")
    const[isTokenVerified, setIsTokenVerified] = useState(true)
    const [responseId, setResponseId] = useState({})
    const [isDisableForm, setIsDisableForm] = useState(false)
    
    //verify the token and get values
    useEffect(()=>{
        let path = 'users/verifyToken'
        axios.post(path, {token:token})
            .then(res => {
                setPersonalDetails({...personalDetails, email:res.data.email})
                setUserEmail(res.data.userEmail) 
                setUserType(res.data.userType)
                setTrakGeneId(res.data.trakGeneId)
                let path = 'users/getValues'
                //checking if the user already exists in database and getting values if he/she does
                axios.post(path, {email:res.data.email })
                    .then(resInner => {
                        console.log("in success")
                        if(resInner.data.personalData === true){

                        }else{
                            setPersonalDetails({...resInner.data.personalData})
                            setChildren(resInner.data.familyMemberDetails)
                            setGeneticInfo(resInner.data.geneticDetails)
                            setIsWomanCancer(resInner.data.womanCancer)
                            setIsJewish(resInner.data.jewish)
                            setResponseId({...resInner.data.resId})
                        }
                        
                    }).catch(err => { 
                        // alert('An error has occured')
                        console.log(err)
                    })
            }).catch(err => { 
                setIsTokenVerified(false)
                console.log(err)
            })
    },[])

    const defaultState = ()=>{
        setPersonalDetails({
        lastName:'',firstName:'',maidenName:'',address:'',dob:'',gpName:'',gpAddress:'',mobile:'',discloseIdentity:"",receiveLetter:"",email:"", trakGeneId:"",status:""})
        setChildren([])
        setIsWomanCancer("")
        setGeneticInfo({agePeriods:"",ageMenopause:"",isContraseptive:"",contraceptiveAge:"",isHrt:"",HrtLong:"",breastProblem:"",majorIllness:"", riskCancer:"",chancesCancer:"",mainGeneticsQuestions:""})
        setResponseId({})
    }

    //func for generating family id
    const generateId = ()=>{
        return (`g-${familyId}-${numberChildren}`)
    }


    const submitData = () => {
        //defining urls
        // let one = 'http://localhost:5000/users/add';
        let one = '/users/add';
        let allGeneticInfo = {isJewish,isWomanCancer,...geneticInfo}
        setPersonalDetails({...personalDetails, status:"complete"})
        //making request to server
        axios.post(one, {personalDetails:{...personalDetails, status:"complete",userEmail,userType,trakGeneId,familyId}, children, allGeneticInfo, responseId, isDisableForm : true})
        .then(res => {
                console.log("in success")
                nextStep();
        }).catch(err => { 
            // alert('An error has occured')
            console.log(err)
        })
        setIsDisableForm(true)
        
        defaultState()
        
    }

    //save data to database
    const saveData = (childFormValues)=>{
        //defining urls
        // let one = 'http://localhost:5000/users/add';
        let one = '/users/add';
        setPersonalDetails({...personalDetails, status:"inProgress"})
        let allGeneticInfo = {isJewish,isWomanCancer,...geneticInfo}
        // if (!children || children.length)
        const _children = (!childFormValues === true)?[]:[...childFormValues]
        //making request to server
        axios.post(one, {personalDetails:{...personalDetails, status:"inProgress",userEmail,userType,trakGeneId,familyId}, children: _children, allGeneticInfo, responseId,isDisableForm})
        .then(res => {
            console.log("in success")
            setStep(7)
        }).catch(err => { 
            // alert('An error has occured')
            console.log(err)
        })
        
        defaultState();
        
    }

    


    //proceed to next step
    const nextStep = ()=>{
        setStep((current)=>current+1)
    }

    //go back to prev step
    const prevStep = ()=>{
        setStep((current)=>current-1)
    }


    //handle submit/field change
    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        setPersonalDetails({...personalDetails, [name]:value})
        // setGeneticInfo({...geneticInfo, [name]:value})
    }

    //handle genetic change
    const handleGeneticChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        setGeneticInfo({...geneticInfo, [name]:value})
    }

    //handle children number change
    const handleChildren = (e) => {
        const value = e.target.value
        // setNumberChildren(value)
    }

    //function to check empty values
    const checkEmptyVals = (array,obj) =>{
        let val = false
        for (let i = 0; i < array.length; i++) {
            val = val || obj[array[i]] === "" || obj[array[i+1]] === ""
        }
        return val
    }

    //update error state
    const updateError = (keys, obj,stateErr,setState, setIsError)=>{
        let stateVals = {...stateErr}
        keys.forEach((element,index)=>{
            if(obj[element] === ""){
                stateVals = {...stateVals, [element]:true}
            }
                
        })
        setState({...stateVals})
        let errVals = Object.values(stateVals)
        if (errVals.includes(true)){
            setIsError(true)
        }
    }

    

    

    const getChildData = step => {
    switch(step){
        case 0:
            return(
                <Instructions
                    nextStep = {nextStep}
                    handleChange = {handleChange}
                    isTokenVerified = {isTokenVerified}
                />
            )

        case 1:
            return(
                <React.Fragment>
                    <Pagination
                        item_number={0}
                        items = {['Personal Details', 'Family Details', 'Confirm Family Details',
                    'Genetic Details', 'Confirm All Details']}
                    />
                    <PersonalInfo
                        nextStep = {nextStep}
                        prevStep = {prevStep}
                        handleChange = {handleChange}
                        personalDetails = {personalDetails}
                        checkEmptyVals = {checkEmptyVals}
                        updateError = {updateError}
                        saveData = {saveData}
                        setStep = {setStep}
                        numberChildren = {numberChildren}
                        setNumberChildren = {setNumberChildren}
                        generateId = {generateId}
                        setPersonalDetails = {setPersonalDetails}
                    />
                </React.Fragment>
            )

        case 2:
            return(
                <React.Fragment>
                    <Pagination
                        item_number={1}
                        items = {['Personal Details', 'Family Details', 'Confirm Family Details',
                    'Genetic Details', 'Confirm All Details']}
                    />
                    <ChildrenInfo
                    nextStep = {nextStep}
                    prevStep = {prevStep}
                    handleChildren = {handleChildren}
                    children={children}
                    setChildren={setChildren}
                    setStep = {setStep}
                    saveData = {saveData}
                    numberChildren = {numberChildren}
                    setNumberChildren = {setNumberChildren}
                    generateId = {generateId}
                />
                </React.Fragment>
                
            )
            
        case 3:
            return(
                    <React.Fragment>
                    <Pagination
                        item_number={2}
                        items = {['Personal Details', 'Family Details', 'Confirm Family Details',
                    'Genetic Details', 'Confirm All Details']}
                    />
                    <ConfirmFamilyTable
                        nextStep = {nextStep}
                        prevStep = {prevStep}
                        children={children}
                    />
                </React.Fragment>
                
            )     
        
        case 4:
            return(
                <React.Fragment>
                    <Pagination
                        item_number={3}
                        items = {['Personal Details', 'Family Details', 'Confirm Family Details',
                    'Genetic Details', 'Confirm All Details']}
                    />
                    <Genetics
                        nextStep = {nextStep}
                        prevStep = {prevStep}
                        setIsJewish = {setIsJewish}
                        setIsWomanCancer = {setIsWomanCancer}
                        isJewish = {isJewish}
                        isWomanCancer = {isWomanCancer}
                        geneticInfo = {geneticInfo}
                        setGeneticInfo = {setGeneticInfo}
                        handleGeneticChange = {handleGeneticChange}
                        checkEmptyVals = {checkEmptyVals}
                        updateError = {updateError}
                        saveData = {saveData}
                    />
                </React.Fragment>
                
            )
        case 5:
                return(
                    <React.Fragment>
                    <Pagination
                        item_number={4}
                        items = {['Personal Details', 'Family Details', 'Confirm Family Details',
                    'Genetic Details', 'Confirm All Details']}
                    />
                        <Typography variant="h4" gutterBottom>
                        Please confirm the following details
                    </Typography>
                    <PersonalInfo
                        nextStep = {nextStep}
                        prevStep = {prevStep}
                        handleChange = {handleChange}
                        personalDetails = {personalDetails}
                        disableButton={disableButton}
                        numberChildren = {numberChildren}
                        setNumberChildren = {setNumberChildren}
                        generateId = {generateId}

                    />
                        <ChildrenInfo
                        nextStep = {nextStep}
                        prevStep = {prevStep}
                        handleChildren = {handleChildren}
                        // numberChildren = {numberChildren}
                        children={children}
                        setChildren={setChildren}
                        disableButton={disableButton}
                        numberChildren = {numberChildren}
                        setNumberChildren = {setNumberChildren}
                        generateId = {generateId}
                    />
                    <Genetics
                        nextStep = {nextStep}
                        prevStep = {prevStep}
                        setIsJewish = {setIsJewish}
                        setIsWomanCancer = {setIsWomanCancer}
                        isJewish = {isJewish}
                        isWomanCancer = {isWomanCancer}
                        geneticInfo = {geneticInfo}
                        setGeneticInfo = {setGeneticInfo}
                        handleGeneticChange = {handleGeneticChange}
                        disableButton={disableButton}
                    />
                    <Confirm
                        nextStep = {nextStep}
                        submitData={submitData}
                    />
                </React.Fragment>
                
            )
            
            case 6:
                return(
                    <>
                        <Success
                            formCompletionMessage = {formCompletionMessage}
                        />
                    </>
                )
            case 7:
                return(
                    <>
                        <Success
                            formCompletionMessage = {formSaveMessage}
                            setStep={setStep}
                            show = {true}
                        />
                    </>
                )              
        }
    }

    return (
        <div className={classes.root}>
             <div className="appbar">
                <AppBar position="static" style={{backgroundColor:"white",color:"#2ba9bf",padding:"10px"}}>
                    <Toolbar variant="dense">
                        <Box display='flex' flexGrow={1}>
                            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h5" color="inherit" className="heading">
                                Family History Enquiry Form
                            </Typography>
                        </Box>
                            
                        <IconButton edge="end" className={classes.menuButton} color="inherit" aria-label="menu">
                            <img src={logo} alt="logo" className={classes.logo} />
                        </IconButton>
                    </Toolbar>
                </AppBar>
            </div>
        {getChildData(step)}
        </div>
    )
}

export default UserForm
