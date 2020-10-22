import React, { useState, useEffect, useContext} from 'react';
import { Typography, Button, TextField, MenuItem, Snackbar} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { firebaseAddUserInfo } from '../../api/Firebase'
import { UserContext } from '../../context/UserContext'

export default function WorkerRegistrationStepFour({ activeStep, setActiveStep }) {
    const [openError, setOpenError] = useState(false)
    const [openSuccess, setOpenSuccess] = useState(false)
    const [message, setMessage] = useState('')
    const [refereeOneFirstName, setRefereeOneFirstName] = useState('')
    const [refereeOneLastName, setRefereeOneLastName] = useState('')
    const [refereeOneEmail, setRefereeOneEmail] = useState('')
    const [refereeOnePhoneNumber, setRefereeOnePhoneNumber] = useState('')
    const [refereeOneRelationship, setRefereeOneRelationship] = useState('')
    const refereeOneRelationshipOptions = ['Manager', 'Client', 'Teacher', 'Colleague', 'Employee']
    const [refereeOneRelationshipLength, setRefereeOneRelationshipLength] = useState('')
    const refereeRelationshipLengthOptions = ['less than 6 months', '6 to 12 months', 'more than 12 months']
    const [refereeTwoFirstName, setRefereeTwoFirstName] = useState('')
    const [refereeTwoLastName, setRefereeTwoLastName] = useState('')
    const [refereeTwoEmail, setRefereeTwoEmail] = useState('')
    const [refereeTwoPhoneNumber, setRefereeTwoPhoneNumber] = useState('')
    const [refereeTwoRelationship, setRefereeTwoRelationship] = useState('')
    const refereeTwoRelationshipOptions = ['Manager', 'Client', 'Teacher', 'Colleague', 'Employee', 'Friend', 'Other']
    const [refereeTwoRelationshipDescription, setRefereeTwoRelationshipDescription] = useState('')
    const [refereeTwoRelationshipLength, setRefereeTwoRelationshipLength] = useState('')

    useEffect(() => {
        document.getElementById('kindleApp').scrollIntoView();

        if (user.referee){
            setRefereeOneFirstName(user.referee.one.firstName)
            setRefereeOneLastName(user.referee.one.lastName)
            setRefereeOneEmail(user.referee.one.email)
            setRefereeOnePhoneNumber(user.referee.one.number)
            setRefereeOneRelationship(user.referee.one.relationship)
            setRefereeOneRelationshipLength(user.referee.one.relationshipLength)
            setRefereeTwoFirstName(user.referee.two.firstName)
            setRefereeTwoLastName(user.referee.two.lastName)
            setRefereeTwoEmail(user.referee.two.email)
            setRefereeTwoPhoneNumber(user.referee.two.number)
            setRefereeTwoRelationship(user.referee.two.relationship)
            setRefereeTwoRelationshipDescription(user.referee.two.relationshipDescription)
            setRefereeTwoRelationshipLength(user.referee.two.relationshipLength)
        } 

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
        refereeOneInfo: {
            marginTop: theme.spacing(2),
            width: '50%'
        }, 
        refereeTwoInfo: {
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

    const handleNext = (e) => {
        e.preventDefault()
        //const check = checkFields()
        const referees = {
            one: {
                firstName: refereeOneFirstName,
                lastName: refereeOneLastName,
                email: refereeOneEmail,
                number: refereeOnePhoneNumber,
                relationship: refereeOneRelationship,
                relationshipLength: refereeOneRelationshipLength
            },
            two: {
                firstName: refereeTwoFirstName,
                lastName: refereeTwoLastName,
                email: refereeTwoEmail,
                number: refereeTwoPhoneNumber,
                relationship: refereeTwoRelationship,
                relationshipDescription: refereeTwoRelationshipDescription,
                relationshipLength: refereeTwoRelationshipLength
            },
        }


        if (true) {
            firebaseAddUserInfo('referee', referees)
                .then((user) => {
                    addUser(user)
                    setActiveStep((prevActiveStep) => prevActiveStep + 1)
                })
                .catch((error) => {
                    setMessage(error)
                    setOpenError(true)
                })
        }
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <div className={classes.root}>
            <div>
                <Typography variant='caption'>We will contact two referees and send them a quick survey to learn more about you. This should include at least one professional reference from within the last two years.</Typography>
            </div>
            <form onSubmit={e => handleNext(e)}>
                <div className={classes.refereeOneInfo}>
                <Typography variant='h6' color={"primary"}>Referee 1</Typography>
                    <TextField
                        size='small'
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="refereeFirstName"
                        label="First Name"
                        name="refereeFirstName"
                        value={refereeOneFirstName}
                        onChange={e => setRefereeOneFirstName(e.target.value)}
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
                        value={refereeOneLastName}
                        onChange={e => setRefereeOneLastName(e.target.value)}
                    />
                    <TextField
                        size='small'
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        type="email"
                        id="refereeEmail"
                        label="Email Address"
                        name="refereeEmail"
                        value={refereeOneEmail}
                        onChange={e => setRefereeOneEmail(e.target.value)}
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
                        value={refereeOnePhoneNumber}
                        onChange={e => setRefereeOnePhoneNumber(e.target.value)}
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
                        select
                        value={refereeOneRelationship}
                        onChange={e => setRefereeOneRelationship(e.target.value)}
                    >
                        {refereeOneRelationshipOptions.map((option, i) => (
                            <MenuItem key={i} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        size='small'
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="refereeRelationshipLenght"
                        label="Lenght of relationship"
                        name="refereeRelationshipLength"
                        select
                        value={refereeOneRelationshipLength}
                        onChange={e => setRefereeOneRelationshipLength(e.target.value)}
                    >
                        {refereeRelationshipLengthOptions.map((option, i) => (
                            <MenuItem key={i} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                </div> 
                <div className={classes.refereeTwoInfo}>
                <Typography variant='h6' color={"primary"}>Referee 2</Typography>
                    <TextField
                        size='small'
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="refereeFirstName"
                        label="First Name"
                        name="refereeFirstName"
                        value={refereeTwoFirstName}
                        onChange={e => setRefereeTwoFirstName(e.target.value)}
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
                        value={refereeTwoLastName}
                        onChange={e => setRefereeTwoLastName(e.target.value)}
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
                        value={refereeTwoEmail}
                        onChange={e => setRefereeTwoEmail(e.target.value)}
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
                        value={refereeTwoPhoneNumber}
                        onChange={e => setRefereeTwoPhoneNumber(e.target.value)}
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
                        select
                        value={refereeTwoRelationship}
                        onChange={e => setRefereeTwoRelationship(e.target.value)}
                    >
                        {refereeTwoRelationshipOptions.map((option, i) => (
                            <MenuItem key={i} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                    {refereeTwoRelationship === 'Other'
                    ? 
                    <div style={{paddingTop: theme.spacing(2), paddingLeft: theme.spacing(2)}}> 
                        <TextField
                            variant='outlined'
                            margin='normal'
                            required
                            fullWidth
                            id='refereeTwoRelationshipDescription'
                            label='Relationship description'
                            name='refereeTwoRelationshipDescription'
                            multiline
                            rows={7}
                            value={refereeTwoRelationshipDescription}
                            onChange={e => setRefereeTwoRelationshipDescription(e.target.value)}
                        />
                    </div>
                    : null
                    }
                    <TextField
                        size='small'
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="refereeRelationshipLenght"
                        label="Lenght of relationship"
                        name="refereeRelationshipLength"
                        select
                        value={refereeTwoRelationshipLength}
                        onChange={e => setRefereeTwoRelationshipLength(e.target.value)}
                    >
                        {refereeRelationshipLengthOptions.map((option, i) => (
                            <MenuItem key={i} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
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
                    <Button variant='contained' color='primary'  type="submit">
                        Next
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