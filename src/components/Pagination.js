import React from 'react'

const Pagination = (props) => {
    const itemNum = props.item_number;
    
    const listItems = props.items.map((item,index) =>{
        if(index === itemNum)
            return <li className='list-item' style={{borderBottom:'2px solid #2ba9bf'}}>{item}</li>
        else 
            return <li className='list-item' >{item}</li>
    }
        
    );
    return (
        <div className='pagination'>
            <ul className='list-items'>
                {listItems}
            </ul>
        </div>
    )
}

export default Pagination
