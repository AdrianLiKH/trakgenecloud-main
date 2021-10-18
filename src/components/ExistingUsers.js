import React, {useState} from 'react'

//material ui
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import axios from '../axios'
import { Alert} from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const ExistingUsers = () => {

    //state
    const [existingUsers, setExistingUsers] = useState([])
    //submit message
    const [serverReturn, setServerReturn] = useState()
    const [alert, setAlert] = useState({severity:'',message:''})

    let array1 = []


    const handleChange = (e,index)=>{
        const name = e.target.name
        const value = e.target.value
        let tempVal = [...existingUsers]
        tempVal[index] = {...existingUsers[index], [name]:value}
        setExistingUsers(tempVal)

    }

    //errorMessage
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        setServerReturn(false);
    };

    const changeUserInfo = (e, index)=>{
        if(!existingUsers[index].password === true || !existingUsers[index].confirmPassword === true){
            setServerReturn(true)
            setAlert({severity:"error", message:"Please fill the required fields before submitting"})
        }else{
            if(existingUsers[index].password !== existingUsers[index].confirmPassword){
                setServerReturn(true)
                setAlert({severity:"error", message:"Passwords do not match"})
            }else{
                let path = '/updateUser'
                axios.post(path, {...existingUsers[index]})
                    .then(res => {
                        console.log("in success")
                        setServerReturn(true)
                        setAlert({severity:"success", message:"The details were saved!"})
                        
                    }).catch(err => { 
                        console.log(err)
                        setServerReturn(true)
                        setAlert({severity:"error", message:"Error: Reused Password"})
                    })
            }
        }
    }


     existingUsers.map((item,index)=>{
        
            array1.push(
                < Grid container spacing={3} key={index} className='user-card'>
                    <Grid item xs={12}>
                        <Typography variant='h5'>
                            {existingUsers[index].email}
                        </Typography>
                    </Grid>
                     <Grid item xs={12}>
                        <FormControl component="fieldset">
                        <FormLabel className="form-label">Type of User</FormLabel>
                            <RadioGroup aria-label="userType" name="userType" value={existingUsers[index].userType} onChange={(e)=>handleChange(e,index)}>
                                <FormControlLabel value="super" control={<Radio />} label="Genetics Service" />
                                <FormControlLabel value="admin" control={<Radio />} label="System Admin" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item md={4} xs={6}>
                        <TextField
                            // error = {isError === true && smtpSettings.host ===""}
                            label="Set New Password" 
                            variant="outlined"
                            type='password'
                            required id="standard-required"
                            fullWidth
                            name = "password"
                            value = {!existingUsers[index].password === true?"":existingUsers[index].password}
                            onChange = {(e)=>handleChange(e,index)}
                            className = 'form-input'
                        />
                    </Grid>
                     <Grid item md={4} xs={6}>
                        <TextField
                            // error = {isError === true && smtpSettings.host ===""}
                            label="Confirm Password" 
                            variant="outlined"
                            type='password'
                            required id="standard-required"
                            fullWidth
                            name = "confirmPassword"
                            value = {!existingUsers[index].confirmPassword === true?"":existingUsers[index].confirmPassword}
                            onChange = {(e)=>handleChange(e,index)}
                            className = 'form-input'
                        />
                    </Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={3}>
                        <Button
                        label = "Save"
                        color = 'primary'
                        variant = 'outlined'
                        className = "btn"
                        onClick = {(e)=>changeUserInfo(e,index)}
                        fullWidth
                    
                        >Save</Button>
                </Grid>
                </Grid>
            )
        
    })

    useState(async()=>{
        let path = '/getExistingUsers';
        await axios.get(path, {})
                .then(res => {
                    console.log("in success")
                    setExistingUsers(res.data.clients);
                }).catch(err => { 
                    console.log(err)

                })
    },[])



    return (
        <div className="epr-form">
             {
                    (serverReturn === true)? <Snackbar open={serverReturn} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity={alert.severity}>
                        {alert.message}
                        </Alert>
                    </Snackbar>:""
                }
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h4" gutterBottom className = 'form-heading' style={{textAlign:'center'}}>
                        Existing Users
                    </Typography>
                     
                </Grid>
                
            </Grid>        
            {array1}
            

        </div>
    )
}

export default ExistingUsers
