import React, {useState} from 'react'
import { useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import axios from 'src/axios'
import {UserContext} from 'src/store/ContextStore'
import { APICONSTANTS, CONSTANTS } from 'src/components/Constants'
import logo from 'src/assets/images/trakgeneLogo.png'


const Adminlogin = () => {
    const history = useHistory()
    const {setUser} = React.useContext(UserContext)

    const [failedAttemp, setFailedAttemp] = React.useState(false)
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")

    //func to verify email and pass
    const login = (e)=>{
        e.preventDefault()
        e.stopPropagation()

        axios.post(APICONSTANTS.login, {email, password})
        .then(res => {
            history.push(CONSTANTS.adminPath)
            setUser({...res.data})
        }).catch(err => { 
            setFailedAttemp(true)
            setPassword("")
        })
    }
    return (
        <div className="container">
            <div className="personal-form">
                <form noValidate onSubmit={login}>
                    <Grid container spacing={3}>
                        
                        <Grid item xs={12}>
                            <img src={logo} alt="Trakgene Logo"/>
                        </Grid>
                        <Grid item xs={12} className='login-fields'>
                            <TextField
                                type="email"
                                label="Email" 
                                variant="outlined"
                                required 
                                name = "adminEmail"
                                className='login-field'
                                value = {email}
                                onChange={e => setEmail(e.target.value)}
                                autoFocus
                                autoComplete="email"
                                error={failedAttemp}
                                helperText={failedAttemp ? "Invalid email or password" : ""}
                            />
                        </Grid>
                        
                        <Grid item xs={12}  className='login-fields'>
                            <TextField
                                label="Enter Password" 
                                type="password"
                                variant="outlined"
                                required 
                                name = "adminPassword"
                                className='login-field'
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                error={failedAttemp}
                                helperText={failedAttemp ? "Invalid email or password" : ""}
                            />
                        </Grid>
                        <Grid item xs={4}></Grid>
                        <Grid item xs={4}>
                            <Button
                                className="btn"
                                type="submit"
                                label = "Login"
                                color = 'primary'
                                variant = 'outlined'
                                fullWidth
                                disabled={!email || !password}
                            
                            >Login</Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </div>
    )
}

export default Adminlogin

