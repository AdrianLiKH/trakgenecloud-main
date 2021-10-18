import React, {useState} from 'react'
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import axios from '../axios'
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import { Alert } from '@material-ui/lab';



const GenerateLink = (props) => {
    const isSafari = window.navigator.userAgent.indexOf('Safari') != -1
    console.log(isSafari)

    //states
    const [userEmail,setUserEmail] = useState("")
    const [trakGeneId, setTrakGeneId] = useState("")
    const [userLink,setUserLink] = useState("")
    const [existingUser, setExistingUser] =useState(false)
    const [mailError, setMailError] = useState(false);
    // const[existingUserError,setExistingUserError] = useState("")
    const [isCopied, setIsCopied] = useState(false)

    const [alertInfo, setAlertInfo] = useState({severity:"", message:""})

    //clientInfo
    const clientEmail = props.userEmail;
    const clientType = props.userType;
    // const [clientEmail,setClientEmail] = useState(props.userEmail)
    // const [clientType,setClientType] = useState(props.userType)
    
    //func to generate link and add user to database
    const generateLink = ()=>{
        //defining urls
        let one = '/email/generate';
        setUserLink("")
        setExistingUser(false)
        let baseURL = window.location.host;
        axios.post(one, {userEmail, trakGeneId,clientEmail,clientType,baseURL})
        .then(res => {
            if(res.data.exists){
                setExistingUser(res.data.exists)
                // setExistingUserError("This user already exists")
            }
                
            setUserLink(res.data.link)
            setIsCopied(true)
            navigator.clipboard.writeText(res.data.link)
            document.execCommand("copy");
            setAlertInfo({severity:"success", message:"The link has been copied to clipboard"})
        }).catch(err => { 
            // alert('An error has occured')
            setIsCopied(true)
            setAlertInfo({severity:"error", message:"Please ensure that the email entered has correct format"})
            console.log(err)
        })
               
    }
    
    //send Email
    const sendEmail = ()=>{
        setIsCopied(false)
        setMailError(false)
        if(!userEmail === true || !userLink === true){
            setMailError(true)
            setAlertInfo({severity:"error", message:"Please Enter email and generate link"})
            
        }else{
            //defining urls
            let one = '/users/sendmail';
            axios.post(one, {userEmail,userLink})
            .then(res => {
                setIsCopied(true)
                setAlertInfo({severity:"success", message:"Email sent"})
            }).catch(err => { 
                setIsCopied(true)
                setAlertInfo({severity:"error", message:"Email could not be sent at this moment"})
                console.log(err)
            })
        }
        
        
    }


    //variables
    let options = []

    if(existingUser === true){
        options.push(
            <>
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                        This user already exists
                    </Typography>
                </Grid>
            </>
        )
    }


    //functions
    const copyText = (e)=>{
        navigator.clipboard.writeText(userLink)
        document.execCommand("copy");
    }

     //handle submit/field change
    const handleChange = (e) => {
        // const name = e.target.name
        const value = e.target.value
        setUserEmail(value)
    }

    //handle close of snackbar
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        setIsCopied(false);
    };



    return (
        <div className="personal-form">
            {
                (isCopied === true || mailError === true)? <Snackbar open={isCopied} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={alertInfo.severity}>
                    {alertInfo.message}
                    </Alert>
                </Snackbar>:""
            }
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h3" gutterBottom className="userInstructions">
                        Generate and Send Family History Questionnaire Link
                    </Typography>
                </Grid>
                <Grid item xs={12} md={8}>
                    <TextField
                        type="email"
                        label="Email" 
                        variant="outlined"
                        required id="standard-required"
                        fullWidth
                        name = "email"
                        value = {userEmail}
                        onChange = {handleChange}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        label="TrakGene ID" 
                        variant="outlined"
                        fullWidth
                        name = "trakgeneId"
                        value = {trakGeneId}
                        onChange = {e=>{setTrakGeneId(e.target.value)}}
                    />
                </Grid>
                <Grid item md={4} xs={6}> 
                    <Button
                        label = "Generate"
                        color = 'primary'
                        variant = 'outlined'
                        className = "btn"
                        onClick = {generateLink}
                        // disabled = {isDisable}
                        fullWidth
                    
                    >Generate Link</Button>
                </Grid>
                <Grid item md={4} xs={6}>
                    <Button
                        label = "Send mail"
                        color = 'primary'
                        variant = 'outlined'
                        className = "btn"
                        onClick = {(e)=>sendEmail()}
                        // disabled = {isDisable}
                        fullWidth
                    
                    >Send Email</Button>
                </Grid>
                {options[0]}
                 <Grid item xs={12}>
                    <TextField
                        label="Generated Link" 
                        variant="outlined"
                        required id="standard-required"
                        fullWidth
                        name = "userLink"
                        value = {userLink}
                        // onChange = {}
                        disabled = {true}
                    />
                </Grid>
                 <Grid item xs={4}>
                    <Button
                        label = "Generate"
                        color = 'primary'
                        variant = 'outlined'
                        className = "btn"
                        onClick = {copyText}
                        // disabled = {isDisable}
                        fullWidth
                        startIcon={<FileCopyIcon />}                    
                    >Copy</Button>
                </Grid>
            </Grid>
        </div>
    )
}

export default GenerateLink
