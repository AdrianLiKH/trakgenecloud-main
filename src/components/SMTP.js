import React, {useState, useEffect} from 'react'

//material ui
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import axios from '../axios'
import { Alert} from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';


const SMTP = () => {

    //State
    const [smtpSettings, setSmtpSettings] = useState({user:"",host:"",secure:"",port:"",password:""});
    const [isError, setIsError] = useState(false);

    //submit message
    const [serverReturn, setServerReturn] = useState()
    const [alert, setAlert] = useState({severity:'',message:''})


    //functions
    const handleChange = (e)=>{
        const name = e.target.name
        const value = e.target.value
        setSmtpSettings({...smtpSettings,[name]:value})
    }

    //errorMessage
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        setServerReturn(false);
    };

    useEffect(()=>{
        let path = '/admin/userData/getSmtp';
        axios.get(path)
                .then(res => {
                    setSmtpSettings({user:res.data.smtpData.user,host:res.data.smtpData.host,port:res.data.smtpData.port,password:res.data.smtpData.password})
                }).catch(err => { 
                    console.log(err)
            })
    }, [])

    const submitSmtp = ()=>{
        if(smtpSettings.host === "" || smtpSettings.user === "" || smtpSettings.password === "" || smtpSettings.port === "" ){
            setIsError(true);
        }else{
            let path = '/admin/userData/setSmtp'

            axios.post(path, {smtpSettings})
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


    return (
        <div className="epr-form">
            <Grid container spacing={3}>
                {
                    (serverReturn === true)? <Snackbar open={serverReturn} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity={alert.severity}>
                        {alert.message}
                        </Alert>
                    </Snackbar>:""
                }
                <Grid item xs={12}>
                    <Typography variant="h4" gutterBottom className = 'form-heading' style={{textAlign:'center'}}>
                        SMTP Settings
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        error = {isError === true && smtpSettings.host ===""}
                        label="Host" 
                        variant="outlined"
                        required id="standard-required"
                        fullWidth
                        name = "host"
                        value = {smtpSettings.host}
                        onChange = {handleChange}
                        className = 'form-input'
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        error = {isError === true && smtpSettings.port ===""}
                        label="Port" 
                        variant="outlined"
                        required id="standard-required"
                        fullWidth
                        name = "port"
                        type = "number"
                        value = {smtpSettings.port}
                        onChange = {handleChange}
                        className = 'form-input'
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        error = {isError === true && smtpSettings.user ===""}
                        label="User" 
                        variant="outlined"
                        required id="standard-required"
                        fullWidth
                        name = "user"
                        type = "email"
                        value = {smtpSettings.user}
                        onChange = {handleChange}
                        className = 'form-input'
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label="Password" 
                        error = {isError === true && smtpSettings.password ===""}
                        variant="outlined"
                        required id="standard-required"
                        type = "password"
                        fullWidth
                        name = "password"
                        value = {smtpSettings.password}
                        onChange = {handleChange}
                        className = 'form-input'
                    />
                </Grid>
                <Grid item xs={4}></Grid>
                <Grid item xs={4}></Grid>
                <Grid item xs={2}>
                    <Button
                    label = "Save"
                    color = 'primary'
                    variant = 'outlined'
                    className = "btn"
                    onClick = {(e)=>submitSmtp()}
                    fullWidth
                
                    >Save</Button>
                </Grid>
            </Grid>
        </div>
    )
}

export default SMTP
