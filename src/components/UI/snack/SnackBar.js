import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const SnackBar = props => {
  const classes = useStyles();
  // const [open, setOpen] = React.useState(props.open);

//   const handleClick = () => {
//     setOpen(true);
//   };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    //setOpen(false);
    props.setOpen(false)
  };

  return (
    <div className={classes.root}>
      <Snackbar open={props.open} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}>
        <Alert onClose={handleClose} severity={props.severity}>
          {props.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default SnackBar