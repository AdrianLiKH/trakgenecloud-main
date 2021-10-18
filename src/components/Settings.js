import React, {useState} from 'react'

//material ui
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

//import file
import SMTP from './SMTP'
import ExistingUsers from './ExistingUsers'

const Settings = (props) => {

    //variables
    const[hideSMTP, setHideSMTP] = useState(true)
    const [hideUsers, setHideUsers] = useState(true)    

    return (
        <div className="epr-form">
            <Grid container spacing={3}>   
                <Grid item xs={12} >
                    <Typography variant="h3" gutterBottom className="settings">
                        Settings
                    </Typography>
                </Grid> 
                <Grid item md={4}></Grid>
                <Grid item md={2} xs={6}>
                    <Button
                        label = "SMTP settings"
                        color = 'primary'
                        variant = 'outlined'
                        className = "btn"
                        onClick = {e=>setHideSMTP((value)=>{
                                    if(hideUsers === false){
                                        setHideUsers(true)
                                        return (!value)
                                    }else{
                                        return (!value)
                                    }
                                })}
                        fullWidth
                    
                    >Change SMTP settings</Button>
                </Grid>
                <Grid item  md={2} xs={6}>
                    <Button
                        label = "View Existing Users"
                        color = 'primary'
                        variant = 'outlined'
                        className = "btn"
                        onClick = {e=>setHideUsers((value)=>{
                            if(hideSMTP === false){
                                setHideSMTP(true)
                                return (!value)
                            }else{
                                return (!value)
                            }
                        })}
                        fullWidth
                    
                    >See Existing Users</Button>
                </Grid>
                
            </Grid> 
            {hideSMTP === false?<SMTP/>:""}
            {hideUsers === false?<ExistingUsers/>:""}   
        </div>
    )
}

export default Settings
