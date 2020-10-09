import React, { useState, useEffect, useContext} from 'react';
import { Typography, Button, RadioGroup, Radio, FormControlLabel, 
    FormGroup, TextField, MenuItem, Snackbar, Checkbox, Tooltip, Grid,} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { firebaseAddUserInfo } from '../../api/Firebase'
import { UserContext } from '../../context/UserContext'

export default function WorkerRegistrationStepSix({ activeStep, setActiveStep }) {
    const [openError, setOpenError] = useState(false)
    const [openSuccess, setOpenSuccess] = useState(false)
    const [message, setMessage] = useState('')
 

    useEffect(() => {
        document.getElementById('kindleApp').scrollIntoView();

        // if (user.work){
        //     console.log(user.work)
        // } else {
        //     console.log('no work')
        // }

    }, [])

    const theme = useTheme()
    const { user, addUser} = useContext(UserContext)

    const useStyles = makeStyles(() => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            flexGrow: 1,
            width: '100%',
            marginTop: theme.spacing(2)
        },
        margin: {
            marginTop: theme.spacing(2)
        },
        padding: {
            padding: theme.spacing(2)
        },
        backButton: {
            marginRight: theme.spacing(1),
        },
        buttons: {
            width: '100%', 
            marginTop: theme.spacing(4), 
            display: 'flex', 
            justifyContent: 'center'
        },
    }))

    const classes = useStyles()

    const handleErrorClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenError(false);
        setMessage('')
    }

    const handleSuccessClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSuccess(false);
        setMessage('')
    }

    const handleNext = () => {
        // const check = checkFields()
        // const work = {
        //     supportTime, 
        //     supportType,
        //     transport: renderTransport,
        //     drivingLicence,
        //     drivingClientCar,
        //     drivingOwnCar,
        //     plateNumber,
        //     genderPreference, 
        //     agePreference, 
        //     workType,
        //     workAvailability,
        //     travelType,
        //     visa,
        //     permissionToCheckVisa,
        //     paidWorkExperience,
        //     unpaidWorkExperience,
        //     unpaidWorkExperienceType
        // }

        // if (check){
        //     firebaseAddUserInfo('work', work)
        //         .then((user) => {
        //             addUser(user)
        //             setActiveStep((prevActiveStep) => prevActiveStep + 1)
        //         })
        //         .catch((error) => {
        //             setMessage(error)
        //             setOpenError(true)
        //         })
        // }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    // const checkFields = () => {
   
    // }


    return (
        <div className={classes.root}>
            <div className={classes.time}>

            </div>
             
            <div className={classes.buttons}>
                <Button
                    variant='contained'
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.backButton}
                >
                    Back
                </Button>
                <Button variant='contained' color='primary' onClick={handleNext}>
                    Next
                </Button>
            </div>
            <>
                <Snackbar open={openError} autoHideDuration={6000} onClose={handleErrorClose}>
                        <Alert onClose={handleErrorClose} severity='error'>
                            {message}
                        </Alert>
                    </Snackbar>
                <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleSuccessClose}>
                    <Alert onClose={handleSuccessClose} severity='success'>
                        {message}
                    </Alert>
                </Snackbar>
            </>
        </div>
    );
}