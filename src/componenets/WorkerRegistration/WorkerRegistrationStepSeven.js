import React, { useState, useEffect, useContext} from 'react';
import { Typography, Button, FormControlLabel, Snackbar, Checkbox, Link} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { firebaseGetServiceAgreementUrl, firebaseSetRegistrationComplete } from '../../api/Firebase'
import { UserContext } from '../../context/UserContext'
import Privacy from '../Privacy';

export default function WorkerRegistrationStepSeven({ activeStep, setActiveStep, history }) {
    const [openError, setOpenError] = useState(false)
    const [openSuccess, setOpenSuccess] = useState(false)
    const [message, setMessage] = useState('')
    const [transportAgreement, setTransportAgreement] = useState(false)
    const [infoConfirmation, setInfoConfirmation] = useState(false)
    const [serviceAgreement, setServiceAgreement] = useState(false)
    const [serviceAgreementUrl, setServiceAgreementUrl] = useState('')
    const [termsAndPrivacy, setTermsAndPrivacy] = useState(false) 

    useEffect(() => {
        firebaseGetServiceAgreementUrl('Kindle_Worker_Service_Agreement')
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
        transportation:{
            marginTop: theme.spacing(2),
        },
        infoConfirmation: {
            marginTop: theme.spacing(2),
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

    const handleNext = (e) => {
        e.preventDefault()
        // const check = checkFields()

        if (transportAgreement && infoConfirmation && serviceAgreement && termsAndPrivacy ) {
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

    return (
        <div className={classes.root}>
            <form className={classes.form} onSubmit={e => handleNext(e)}>
                <div className={classes.margin}>
                    <Typography variant='h6' color='primary'>Our transportation agreement</Typography>
                    <Typography variant='caption' style={{display: 'block'}}>By providing transport as a support worker with Kindle, you enter into our Transport Agreement for Support Workers.</Typography>
                    <Typography variant='caption' style={{display: 'block', marginTop: theme.spacing(1)}}>In signing this you agree to the following:</Typography>
                    <ol style={{color: theme.palette.secondary, fontSize: '0.75rem'}}>
                        <li>Commit to safe driver behaviour, to protect myself and others. e.g. be alert, observe laws, defensive driving, manage fatigue levels and fitness to drive.</li>
                        <li>Provide a current and valid drivers licence to Kindle when you choose to provide transport. An updated copy must be provided as it approaches expiry.</li>
                        <li>Get in contact with Kindle immediately if you have any licence issues such as cancellation or restrictions.</li>
                        <li>Notify Kindle of any medical condition that may prevent you from safely providing transport.</li>
                        <li>Ensure driver and all passengers wear a seatbelt while in motion.</li>
                        <li>Ensure that you have an appropriate load restraint system and/or cargo barriers in place if you are carrying a heavy load, e.g. a wheelchair or other equipment</li>
                        <li>Agree to complete a Kindle online incident form in the case of any incident or near miss event.</li>
                        <li>You must not:
                            <ol>
                                <li>Consume alcohol or drugs between the time the booking commences and ceases.</li>
                                <li>Drive or attempt to put the vehicle in motion, while there is any concentration of alcohol or drugs present in your blood</li>
                                <li>Exceed the passenger limits of the vehicle.</li>
                                <li>Use a hand held mobile phone or two-way radios while operating the vehicle.</li>
                            </ol>
                        </li>
                        <li>If you drive the vehicle of a person seeking support with Kindle you agree to:
                            <ol>
                                <li>Request to see a copy of the registration certificate of the vehicle prior to driving.</li>
                                <li>Request to see a copy of the Compulsory Third Party (CTP) insurance for the vehicle.</li>
                                <li>Request to see a copy of any other insurance policies.</li>
                                <li>Complete a visual inspection of the vehicle prior to driving to ensure it is safe.</li>
                                <li>Request training from the vehicle's owners, to ensure you understand how to effectively operate the vehicle.</li>
                            </ol>
                        </li>
                        <li>If you use your own vehicle to provide transport with Kindle you agree to:
                            <ol>
                                <li>Maintain the vehicle in a safe, clean and roadworthy condition. Conduct a visual Vehicle Inspection Checklist annually.</li>
                                <li>Ensure the vehicle is maintained and serviced, as outlined in the owner's manual.</li>
                                <li>Register your vehicle with the relevant body and ensure the registration is maintained.</li>
                                <li>Hold Compulsory Third Party (CTP) and check that you are insured to drive for business purposes.</li>
                                <li>Think about your insurance needs and consider obtaining Comprehensive Insurance.</li>
                                <li>Keep accurate records of the trips you have made using your own vehicle.</li>
                                <li>Consider keeping a first aid kit in your vehicle.</li>
                                <li>Provide Kindle with copies of any of these records when requested.</li>
                                <li>Understand that I am fully responsible for my vehicle in the event of any claim that arises as a result of an accident, in conjunction with my insurer.</li>
                            </ol>
                        </li>
                    </ol>
                    <FormControlLabel
                        control={<Checkbox 
                            onChange={(e) => {
                                e.target.checked
                                ? setTransportAgreement(true)
                                : setTransportAgreement(false)
                            }} 
                            color='primary'
                            required/>}
                        label='I agree'
                    />
                </div>
                <div className={classes.infoConfirmation}>
                    <Typography variant='h6' color='primary'>Confirming the information you have given us</Typography>
                    <FormControlLabel
                        className= {classes.padding}
                        control={<Checkbox 
                            onChange={(e) => {
                                e.target.checked
                                ? setInfoConfirmation(true)
                                : setInfoConfirmation(false)
                            }} 
                            color='primary' 
                            name='correctInfo'
                            required/>}
                        label=' I certify that, to the best of my knowledge, I have answered questions in this application truthfully and have not omitted any details in answering each question. I understand and acknowledge that if I have knowingly given false answers to any of the questions or omitted any details in answering any question in this application, my working status and insurance coverage through Kindle may be affected.'
                    />
                </div>
                <div>
                    <Typography variant='h6' color='primary'>Our service agreement</Typography>
                    <Typography variant='caption' className={classes.margin}>
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
                            name='correctInfo' 
                            required/>}
                        label={`I, ${user.firstName} ${user.lastName}, acknowledge that I accept the terms of this Agreement with Kindle Pty Ltd on the terms and conditions set out above. I also acknowledge and agree that I am entering this Agreement electronically and ticking this box constitutes my signature to enter into this Agreement.`}
                    />
                </div>
                <div>
                    <Typography variant='h6' color='primary'>Our Terms of Use and Privacy Policy</Typography>
                        <Typography variant='caption' className={classes.margin}>
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
                            name='correctInfo' 
                            required/>}
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
                    <Button variant='contained' color='primary' type='submit'>
                        Finish
                    </Button>
                </div>
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
            </form>
        </div>
    );
}