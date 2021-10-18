import React from 'react'
import Typography from '@material-ui/core/Typography';
import { useHistory} from 'react-router-dom';
import { Button } from '@material-ui/core';

const Success = (props) => {
    const history = useHistory();
    let baseURL = window.location.host;
    return (
        <div className="success-page">
            <Typography variant="h5" gutterBottom>
                {props.formCompletionMessage}
            </Typography>
            {props.show === true? 
            <Button
                label = "Go Back"
                color = 'primary'
                variant = 'outlined'
                className = "btn"
                onClick = {()=>window.location.reload()}
            
            >Return to Form</Button>:''
            }

        </div>

    )
}

export default Success
