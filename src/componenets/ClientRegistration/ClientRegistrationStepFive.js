import React, { useState, useEffect, useContext} from 'react';
import { Typography, Button, FormControlLabel, Snackbar, Checkbox, Tooltip, Link} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { firebaseGetServiceAgreementUrl, firebaseSetRegistrationComplete } from '../../api/Firebase'
import { UserContext } from '../../context/UserContext'
import Privacy from '../Privacy';

export default function ClientRegistrationStepFive({ activeStep, setActiveStep, history }) {
    const [openError, setOpenError] = useState(false)
    const [openSuccess, setOpenSuccess] = useState(false)
    const [message, setMessage] = useState('')
    const [infoConfirmation, setInfoConfirmation] = useState(false)
    const [serviceAgreement, setServiceAgreement] = useState(false)
    const [serviceAgreementUrl, setServiceAgreementUrl] = useState('')
    const [termsAndPrivacy, setTermsAndPrivacy] = useState(false) 

    useEffect(() => {
        firebaseGetServiceAgreementUrl()
            .then((url) => setServiceAgreementUrl(url))
            .catch((error) => {
                setMessage(error)
                setOpenError(true)
            })
    }, [])

    const { user, addUser} = useContext(UserContext)
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
        padding: {
            paddingTop: theme.spacing(8),
            paddingBottom: theme.spacing(8)
        },
        rounded: {
            width: '100%',
            borderTop: `5px solid`,
            borderColor: theme.palette.divider,
            borderRadius: '5px'
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
        infoConfirmation:{
            marginTop: theme.spacing(10),
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

        const check = checkFields()

        if (check) {
            firebaseSetRegistrationComplete()
                .then((user) => {
                    addUser(user)
                })
                .then(() => history.replace('./dashboard'))
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
        if (infoConfirmation) {
            if (serviceAgreement) {
                if (termsAndPrivacy) {
                    return true
                } else {
                    setMessage('Please agree on "Our Terms of Use and Privacy Policy"')
                    setOpenError(true)
                    return false
                }
            } else {
                setMessage('Please agree on "Our service agreement"')
                setOpenError(true)
                return false
            }
        } else {
            setMessage('Please agree on "Confirming the information you have given us"')
            setOpenError(true)
            return false
        }
    }

    return (
        <div className={classes.root}>
            <div className={classes.infoConfirmation}>
                <Typography variant='h6'>Confirming the information you have given us</Typography>
                <FormControlLabel
                    className= {classes.padding}
                    control={<Checkbox 
                        onChange={(e) => {
                            e.target.checked
                            ? setInfoConfirmation(true)
                            : setInfoConfirmation(false)
                        }} 
                        color='primary' 
                        name='correctInfo' />}
                    label='I certify that, to the best of my knowledge, I have answered questions in this application truthfully and have not omitted any details in answering each question. I understand and acknowledge that if I have knowingly given false answers to any of the questions or omitted any details in answering any question in this application, my working status and insurance coverage through Kindle may be affected.'
                />
            </div>
            <div>
                <Typography variant='h6'>Our service agreement</Typography>
                <Typography variant='subtitle2' className={classes.margin}>
                    Please read carefully our&nbsp; 
                    <Link
                    target = "_blank"
                    href={serviceAgreementUrl}
                    >
                        service agreement
                    </Link>
                </Typography>
                <FormControlLabel
                    className= {classes.padding}
                    control={<Checkbox onChange={(e) => {
                            e.target.checked
                                ? setServiceAgreement(true)
                                : setServiceAgreement(false)
                        }} 
                        color='primary' 
                        name='correctInfo' />}
                    label={`I, ${user.firstName} ${user.lastName}, acknowledge that I accept the terms of this Agreement with Kindle Pty Ltd on the terms and conditions set out above. I also acknowledge and agree that I am entering this Agreement electronically and ticking this box constitutes my signature to enter into this Agreement.`}
                />
            </div>
            <div>
                <Typography variant='h6'>Our Terms of Use and Privacy Policy</Typography>
                    <Typography variant='subtitle2' className={classes.margin}>
                        Please read carefully our&nbsp; 
                        <Link
                        target = "_blank"
                        href={'/terms'}
                        >
                            terms of use
                        </Link>
                        &nbsp;and&nbsp;
                        <Link
                        target = "_blank"
                        href={'/privacy'}
                        >
                            Privacy Policy
                        </Link>
                    </Typography>
                    <FormControlLabel
                    className= {classes.padding}
                    control={<Checkbox onChange={(e) => {
                            e.target.checked
                            ? setTermsAndPrivacy(true)
                            : setTermsAndPrivacy(false)
                        }} 
                        color='primary' 
                        name='correctInfo' />}
                    label={`By ticking this box you confirm that you are over 18 years of age and that you have read and agree with our Terms of Use, and Privacy Policy.`}
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
                    Finish
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