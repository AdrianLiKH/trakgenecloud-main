import React, {useEffect} from 'react'
import { Button } from '@material-ui/core';

const Confirm = (props) => {

    //function to move to next step
    const moveNext = (e)=>{
        e.preventDefault();
        props.submitData()
    }

    const scrollToTop = ()=>{
        window.scrollTo({
            top:0,
            left:0,
            behavior:"smooth",
        })
    }
    useEffect(() => {
        scrollToTop()
        
    }, [])

    return (
        <div className="submit">
            <form>
                <Button
                    label = "Submit"
                    color = 'primary'
                    variant = 'outlined'
                    className = "btn"
                    onClick = {moveNext}
                >Submit</Button>
            </form>
            
        </div>
    )
}

export default Confirm