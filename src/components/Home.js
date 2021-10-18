import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import { useHistory} from 'react-router-dom';
import AssignmentIcon from '@material-ui/icons/Assignment';
import SearchIcon from '@material-ui/icons/Search';
import SettingsIcon from '@material-ui/icons/Settings';

const Home = (props) => {

    const history = useHistory();
    const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            minWidth: 300,
            width: '88%',
            maxWidth:"1380px",
            margin:'200px auto',

        },
        //removing property from image 
        // '& $imageTitle': {
        //         border: '4px solid currentColor',
        //     },
        image: {
            position: 'relative',
            marginRight: '30px',
            height: 300,
            [theme.breakpoints.down('xs')]: {
            width: '100% !important', // Overrides inline-style
            height: 200,
            marginBottom:"20px"
            },
            [theme.breakpoints.between('sm','md')]: {
            width: '50% !important', // Overrides inline-style
            height: 250,
            marginBottom:"20px"
            },
            '&:hover, &$focusVisible': {
            zIndex: 1,
            '& $imageBackdrop': {
                opacity: 0.15,
            },
            '& $imageMarked': {
                opacity: 0,
            },
            
            },
        },
        focusVisible: {},
        imageButton: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.palette.common.white,
        },
        imageSrc: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
        },
        imageBackdrop: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: theme.palette.common.black,
            opacity: 0,
            transition: theme.transitions.create('opacity'),
        },
        imageTitle: {
            position: 'relative',
            padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${theme.spacing(1) + 6}px`,
            fontSize: '26px',
        },
        imageIcon: {
            fontSize: '55px',
        },
        //removing 2 properties for underline  bottom: -2, and backgroundColor: theme.palette.common.white,
        imageMarked: {
            height: 3,
            width: 18,
            
            position: 'absolute',
            
            left: 'calc(50% - 9px)',
            transition: theme.transitions.create('opacity'),
        },
    }));

   
    const classes = useStyles();
    const images = [
        {
            color: "#369fb5",
            title: 'Questionnaire',
            width: '30%',
            onClick: (e)=>{
                history.push(`/admin/generateLink`)
            }
        },
        {
            color: "#f7dd31",
            title: 'Find Person',
            width: '30%',
            onClick: (e)=>{
                history.push(`/admin/users`)
            }
        },
        (props.userType === 'admin')?
        {
            color: "#9b9b9b",
            title: 'Settings',
            width: '30%',
            onClick: (e)=>{
                history.push(`/admin/settings`)
            }
        }:''
    ];
    return (
        <div className={classes.root}>
        {images.map((image,index) => (
            <ButtonBase
            focusRipple
            onClick = {e=>image.onClick()}
            key={image.title}
            className={classes.image}
            focusVisibleClassName={classes.focusVisible}
            style={{
                width: image.width,
                backgroundColor: image.color,
            }}
            >
            <span
                className={classes.imageSrc}
            />
            <span className={classes.imageBackdrop} />
            <span className={classes.imageButton}>
                {index === 0?<AssignmentIcon className={classes.imageIcon}/>:'' }
                {index === 1?<SearchIcon className={classes.imageIcon}/>:'' }
                {(props.userType === 'admin' && index === 2)?<SettingsIcon className={classes.imageIcon}/> :''}
                <Typography
                component="span"
                variant="subtitle1"
                color="inherit"
                className={classes.imageTitle}
                >
                {image.title}
                <span className={classes.imageMarked} />
                </Typography>
                
                
            </span>
            </ButtonBase>
        ))}
        </div>
    );
}

export default Home
