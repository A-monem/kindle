import React, { useState, useEffect, useContext} from 'react';
import { Typography, Button, RadioGroup, Radio, FormControlLabel, 
    FormGroup, TextField, MenuItem, Snackbar, Checkbox, Tooltip, Grid, LinearProgress, Link} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import {  MuiPickersUtilsProvider, KeyboardDatePicker, DatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { firebaseAddUserInfo, auth, storage} from '../../api/Firebase'
import { UserContext } from '../../context/UserContext'

export default function WorkerRegistrationStepSix({ activeStep, setActiveStep }) {
    const [openError, setOpenError] = useState(false)
    const [openSuccess, setOpenSuccess] = useState(false)
    const [message, setMessage] = useState('')
    const [progress1, setProgress1] = useState('')
    const [progress2, setProgress2] = useState('')
    const [progress3, setProgress3] = useState('')
    const [progress4, setProgress4] = useState('')
    const [progress5, setProgress5] = useState('')
    const [verified1, setVerified1] = useState(false)
    const [verified2, setVerified2] = useState(false)
    const [verified3, setVerified3] = useState(false)
    const [verified4, setVerified4] = useState(false)
    const [verified5, setVerified5] = useState(false)
    const [firstAid, setFirstAid] = useState('')
    const [licence, setLicence] = useState('')
    const [ndisTraining, setNdisTraining] = useState('')
    const [wwcc, setWwcc] = useState('')
    const [policeCheck, setPoliceCheck] = useState('')

    useEffect(() => {
        document.getElementById('kindleApp').scrollIntoView();
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
            marginTop: theme.spacing(1)
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
        firstAid:{
            marginTop: theme.spacing(2),

            width: '60%',
        },
        uploadButtons: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
        },
        drivingLicence: {
            marginTop: theme.spacing(4),
            width: '60%',
        },
        training: {
            marginTop: theme.spacing(4),
            width: '60%',
        },
        wwcc: {
            marginTop: theme.spacing(4),
            width: '60%',
        }, 
        policeCheck: {
            marginTop: theme.spacing(4),
            width: '60%',
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

        if (verified1 && verified2 && verified3 && verified4 && verified5) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1)
        } else {
            setMessage('Please make sure you have uploaded all required documents')
            setOpenError(true)
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

   

    const handleDocumentUpload = (fileName, document, setProgress, setVerified) => {
        const upload = storage.ref(`user_documents/${auth.currentUser.uid}/${fileName}`).put(document)
        
        upload.on('state_changed',
        (snapshot) => {
            setProgress( Math.floor(snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        },
        (error) => {
            setMessage(error.message)
            setOpenError(true)
        },
        () => {
            setVerified(true)
        })
    }

    return (
        <div className={classes.root}>
             <form className={classes.form} onSubmit={e => handleNext(e)}>
             <div className={classes.firstAid}>
                <Typography variant='h6' color={"primary"}>First aid</Typography>
                <Typography variant='caption' style={{display: 'block'}}>Please upload a copy of your CPR, First Aid, or basic emergency life support certificate.</Typography>
                <Typography variant='caption' style={{display: 'block'}}>Kindle only accepts the following certificates and doesn't accept a receipt for a course.</Typography>
                <ul style={{color: theme.palette.secondary, fontSize: '0.75rem'}}>
                    <li>CPR certificates (HLTAID001 or HLTAID007, valid for 1 year)</li>
                    <li>Basic emergency life support (HLTAID002, valid for 1 year)</li>
                    <li>First Aid certificates (HLTAID003, HLTAID004, HLTAID006, valid for 3 years)</li>
                </ul>
                <div className={classes.uploadButtons}>
                    <TextField
                        size='small'
                        variant='outlined'
                        margin='normal'
                        required
                        fullWidth
                        id='uploadFirstAid'
                        name='uploadFirstAid'
                        type='file'
                        onChange={(e) => {
                            if (e.target.files[0]){
                                setFirstAid(e.target.files[0])
                             }
                        }}
                    />
                    <Button 
                    variant='contained' 
                    color='primary'
                    size='small'
                    style={{marginTop: theme.spacing(1), marginLeft: theme.spacing(2)}}
                    onClick={() => handleDocumentUpload('firstAid', firstAid, setProgress1, setVerified1)} 
                    >
                        Upload
                    </Button>
                </div>
                <LinearProgress value={progress1} variant="determinate" color='primary'/>
            </div>

            <div className={classes.drivingLicence}>
                <Typography variant='h6' color={"primary"}>Driving licence</Typography>
                <div className={classes.uploadButtons}>
                    <TextField
                        size='small'
                        variant='outlined'
                        margin='normal'
                        required
                        fullWidth
                        id='uploadLicence'
                        name='uploadLicence'
                        type='file'
                        onChange={(e) => {
                            if (e.target.files[0]){
                                setLicence(e.target.files[0])
                             }
                        }}
                    />
                    <Button 
                    required
                    variant='contained' 
                    color='primary'
                    size='small'
                    style={{marginTop: theme.spacing(1), marginLeft: theme.spacing(2)}}
                    onClick={() => handleDocumentUpload('drivingLicence', licence, setProgress2, setVerified2)} 
                    >
                        Upload
                    </Button>
                </div>
                <LinearProgress value={progress2} variant="determinate" color='primary'/>
            </div>

            <div className={classes.training}>
                <Typography variant='h6' color={"primary"}>NDIS worker orientation module</Typography>
                <Typography variant='caption' style={{display: 'block'}}>The NDIS Quality and Safeguards Commission has launched an <Link target="_blank" href="https://training.ndiscommission.gov.au/">online training course</Link> to assist workers in the disability sector to better support people with disability.</Typography>
                <Typography variant='caption' style={{display: 'block'}}>We encourage all our registered support workers to create an account, log in to the NDIS Quality and Safeguards Commission website and complete the online training course. This training is a requirement to become a Kindle employee.</Typography>
                <div className={classes.uploadButtons}>
                    <TextField
                        size='small'
                        variant='outlined'
                        margin='normal'
                        required
                        fullWidth
                        id='uploadTraining'
                        name='uploadTraining'
                        type='file'
                        onChange={(e) => {
                            if (e.target.files[0]){
                                setNdisTraining(e.target.files[0])
                             }
                        }}
                    />
                    <Button 
                    variant='contained' 
                    color='primary'
                    size='small'
                    style={{marginTop: theme.spacing(1), marginLeft: theme.spacing(2)}}
                    onClick={() => handleDocumentUpload('ndisTraining', ndisTraining, setProgress3, setVerified3)} 
                    >
                        Upload
                    </Button>
                </div>
                <LinearProgress value={progress3} variant="determinate" color='primary'/>
            </div>

            <div className={classes.wwcc}>
                <Typography variant='h6' color={"primary"}>Working with children check</Typography>
                <Typography variant='caption' style={{display: 'block'}}>Please ensure that the Working With Children check you have uploaded is for employment purposes. Kindle doesn't accept volunteer purpose checks.</Typography>

                <div className={classes.uploadButtons}>
                    <TextField
                        size='small'
                        variant='outlined'
                        margin='normal'
                        required
                        fullWidth
                        id='uploadTraining'
                        name='uploadTraining'
                        type='file'
                        onChange={(e) => {
                            if (e.target.files[0]){
                                setWwcc(e.target.files[0])
                             }
                        }}
                    />
                    <Button 
                        variant='contained' 
                        color='primary'
                        size='small'
                        style={{marginTop: theme.spacing(1), marginLeft: theme.spacing(2)}}
                        onClick={() => handleDocumentUpload('WWCC', wwcc, setProgress4, setVerified4)} 
                    >
                        Upload
                    </Button>
                </div>
                <LinearProgress value={progress4} variant="determinate" color='primary'/>
            </div>
            <div className={classes.policeCheck}>
                <Typography variant='h6' color={"primary"}>National police check</Typography>
                <Typography variant='caption' style={{display: 'block'}}>We cannot accept volunteer purpose police checks.</Typography>
                <Typography variant='caption' style={{display: 'block'}}>This must be issued within the last 12 months, to you, not another organisation.</Typography>
                <div className={classes.uploadButtons}>
                    <TextField
                        size='small'
                        variant='outlined'
                        margin='normal'
                        required
                        fullWidth
                        id='uploadTraining'
                        name='uploadTraining'
                        type='file'
                        onChange={(e) => {
                            if (e.target.files[0]){
                               setPoliceCheck(e.target.files[0])
                             }
                        }}
                    />
                    <Button 
                        variant='contained' 
                        color='primary'
                        size='small'
                        style={{marginTop: theme.spacing(1), marginLeft: theme.spacing(2)}}
                        onClick={() => handleDocumentUpload('policeCheck', policeCheck, setProgress5, setVerified5)} 
                    >
                        Upload
                    </Button>
                </div>
                <LinearProgress value={progress5} variant="determinate" color='primary'/>
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
             </form>
        </div>
    );
}