import React, { useState, useEffect } from 'react';
import { Typography, Button, TextField, Snackbar } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { firebaseAddRefereeInfo } from '../../api/Firebase'

export default function ClientRegistrationStepThree({ activeStep, setActiveStep }) {
    const [openError, setOpenError] = useState(false)
    const [openSuccess, setOpenSuccess] = useState(false)
    const [message, setMessage] = useState('')
    const [refereeFirstName, setRefereeFirstName] = useState('')
    const [refereeLastName, setRefereeLastName] = useState('')
    const [refereeEmail, setRefereeEmail] = useState('')
    const [refereePhoneNumber, setRefereePhoneNumber] = useState('')
    const [refereeRelationship, setRefereeRelationship] = useState('')

    useEffect(() => {

    }, [])

    const theme = useTheme()

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
        backButton: {
            marginRight: theme.spacing(1),
        },
        buttons: {
            width: '100%', 
            marginTop: theme.spacing(4), 
            display: 'flex', 
            justifyContent: 'center'
        },
        refereeInfo:{
            marginTop: theme.spacing(2),
            width: '50%'
        }
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
        
        const check = checkFields()
        const refereeInfo = {
            refereeFirstName,
            refereeLastName,
            refereeEmail,
            refereePhoneNumber,
            refereeRelationship
        }

        if (true){
            firebaseAddRefereeInfo(refereeInfo)
                .then(() => setActiveStep((prevActiveStep) => prevActiveStep + 1))
                .catch((error) => {
                    setMessage(error)
                    setOpenError(true)
                })
        } 
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const checkFields = () => {
        if (refereeFirstName) {
            if (refereeLastName) {
                if (refereeEmail) {
                    if (refereePhoneNumber) {
                        if (refereeRelationship) {
                            return true
                        } else {
                            setMessage('Please make sure you have entered your relationship with your referee')
                            setOpenError(true)
                            return false
                        }
                    } else {
                        setMessage('Please make sure you have entered a referee phone number')
                        setOpenError(true)
                        return false
                    }
                } else {
                    setMessage('Please make sure you have entered a referee email address')
                    setOpenError(true)
                    return false
                }
            } else {
                setMessage('Please make sure you have entered a referee last name')
                setOpenError(true)
                return false
            }
        } else {
            setMessage('Please make sure you have entered a referee first name')
            setOpenError(true)
            return false
        }
    }   

    return (
        <div className={classes.root}>
            <div>
                <Typography variant='subtitle2'>Get verified by providing contact details for a character referee. This might be a person in your support network (such as a support coordinator) who you would be comfortable for us to contact as your account is created. We will contact this person if we need to confirm information.</Typography>
            </div>
            <div className={classes.refereeInfo}>
                <TextField
                    size='small'
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="refereeFirstName"
                    label="First Name"
                    name="refereeFirstName"
                    onChange={e => setRefereeFirstName(e.target.value)}
                />
                <TextField
                    size='small'
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="refereeLastName"
                    label="Last Name"
                    name="refereeLastName"
                    onChange={e => setRefereeLastName(e.target.value)}
                />
                <TextField
                    size='small'
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="refereeEmail"
                    label="Email Address"
                    name="refereeEmail"
                    onChange={e => setRefereeEmail(e.target.value)}
                />
               <TextField
                    size='small'
                    variant='outlined'
                    margin='normal'
                    required
                    fullWidth
                    id='refereePhoneNumber'
                    label='Phone Number'
                    name='refereePhoneNumber'
                    type='tel'
                    placeholder='0444888999'
                    onChange={e => setRefereePhoneNumber(e.target.value)}
                />
                 <TextField
                    size='small'
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="refereeRelationship"
                    label="Relationship"
                    name="refereeRelationship"
                    onChange={e => setRefereeRelationship(e.target.value)}
                />
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