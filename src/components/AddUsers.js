import React, {useState} from 'react'
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import axios from '../axios'
import Snackbar from '@material-ui/core/Snackbar';
import { Alert } from '@material-ui/lab';

const AddUsers = () => {

    //State values
    const [isError, setIsError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [userData, setUserData] = useState({email:"",password:"",confirmPassword:"",userType:"super"});
    const [serverReturn, setServerReturn] = useState()
    const [alert, setAlert] = useState({severity:'',message:''})

    //functions
    const handleChange = (e)=>{
        const name = e.target.name;
        const value = e.target.value;
        setUserData({...userData, [name]:value});
        if(e.target.name === "password"){
            if(value !== userData.confirmPassword){
                setPasswordError(true)
            }
        }
    }

    const matchPasswords = (e)=>{
        const name = e.target.name;
        const value = e.target.value;
        setUserData({...userData, [name]:value}); 
        if(value !== userData.password){
            setPasswordError(true)
        }else{
            setPasswordError(false)
        }
    }

    const createUser = ()=>{
        if(userData.email === "" || userData.password === "" || userData.confirmPassword === "" || userData.userType === "" || passwordError){
            setIsError(true)
        }else{
            let path = '/createUser'
            axios.post(path, {userData})
                .then(res => {
                    console.log("in success")
                    setServerReturn(true)
                    if(res.data.exists === true){
                        setAlert({severity:"error", message:"The user already exists!"})
                    }else{
                        setAlert({severity:"success", message:"The details were saved!"})
                    }
                }).catch(err => { 
                    console.log(err)
                    setServerReturn(true)
                    setAlert({severity:"error", message:"Error while saving values, please check the entered values"})
                })
        }
    }

    //close snackbar
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        setServerReturn(false);
    };

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
                    <Typography variant="h3" gutterBottom>
                            Create New User
                    </Typography>
                </Grid>
                <Grid item xs={8} md={4}>
                    <TextField
                        error = {isError === true && userData.email===""}
                        label="Email" 
                        variant="outlined"
                        required 
                        fullWidth
                        helperText = {(isError === true && userData.email==="")? "Please enter an email address":""}
                        name = "email"
                        type = "email"
                        onChange = {handleChange}
                        value = {userData.email}
                        className = 'form-input'
                    />
                </Grid>
                <Grid item xs={8} md={4}>
                    <TextField
                        error = {isError === true && userData.password===""}
                        label="Password" 
                        variant="outlined"
                        required 
                        fullWidth
                        helperText = {(isError === true && userData.password==="")? "Please enter a password":""}
                        name = "password"
                        type = "password"
                        value = {userData.password}
                        onChange = {handleChange}
                        className = 'form-input'
                    />
                </Grid>
                <Grid item xs={8} md={4}>
                    <TextField
                        error = {passwordError === true && userData.confirmPassword !== userData.password}
                        label="Confirm Password" 
                        variant="outlined"
                        required 
                        fullWidth
                        helperText = {(passwordError === true && userData.confirmPassword !== userData.password)? "Passwords do not match":""}
                        name = "confirmPassword"
                        value = {userData.confirmPassword}
                        type = "password"
                        onChange = {matchPasswords}
                        className = 'form-input'
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControl component="fieldset" error={isError === true && userData.userType===""}>
                    <FormLabel component="legend" className="form-label">Type of User</FormLabel>
                        <RadioGroup aria-label="userType" name="userType" value={userData.userType} onChange={handleChange}>
                            <FormControlLabel value="super" control={<Radio />} label="Genetics Service" />
                            <FormControlLabel value="admin" control={<Radio />} label="System Admin" />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={2} >
                    <Button
                        label = "Create"
                        color = 'primary'
                        variant = 'outlined'
                        onClick = {createUser}
                        fullWidth
                        className="btn"
                        // startIcon = {<KeyboardBackspaceIcon/>}
                    
                    >Create User</Button>
                </Grid>

            </Grid>
        </div>
    )
}

export default AddUsers
