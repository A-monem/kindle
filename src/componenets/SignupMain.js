import React, { useState } from 'react';
import { Button, Typography, Paper, RadioGroup, Radio, FormLabel, TextField, FormControlLabel, Snackbar, 
    Checkbox, Link, Box} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert';
import { firebaseAddUser } from '../api/Firebase'

export default function Signup({ history }) {
    const theme = useTheme()
    const [type, setType] = useState(null)
    const [firstName, setFirstName] = useState(null)
    const [lastName, setLastName] = useState(null)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [agreement, setAgreement] = useState(false)
    const [accountTypeBoxProps, setAccountTypeBoxProps] = useState({})
    const [agreementBoxProps, setAgreementBoxProps] = useState({})
    const [open, setOpen] = useState(false);

    const useStyles = makeStyles(() => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1
        },
        paper: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            margin: theme.spacing(10),
            padding: theme.spacing(10),
            width: '60%'
        },
        logo: {
            width: theme.spacing(30),
            height: theme.spacing(30),
        },
        form: {
            marginTop: theme.spacing(10)
        },
        margin: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2)
        },

    }))

    const classes = useStyles()

 
    const handleFormSubmit = () => {
        
        const status = checkFields()

        if(status) {
            console.log(email)
            firebaseAddUser(type, firstName, lastName, email, password)
                .then(() => console.log('success'))
                .catch(e => console.log('Error', e))
        }
    }
    
    const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
        return;
    }

    setOpen(false);
    };

    const checkFields = () => {
    
        if (type === null){

            setAccountTypeBoxProps({
                borderColor: 'red',
                p: 1,
                border: 1,
            })

            if (agreement === false){
               
                setAgreementBoxProps({
                    borderColor: 'red',
                    p: 1,
                    border: 1,
                })
            }

            setOpen(true);
            return false

        } else if (agreement === false){

            setAgreementBoxProps({
                borderColor: 'red',
                p: 1,
                border: 1,
            })

            setOpen(true);
            return false
        } else {
            return true
        }
    }

    return (
        <div className={classes.root}>
            <Paper className={classes.paper} elevation={3}>
                <img src={require('../images/logo.png')} alt={'logo'} className={classes.logo} />
                <Typography variant="h6" color='primary'>
                    Welcome to Kindle
                </Typography>
                <form onSubmit={e => e.preventDefault() && false} className={classes.form}>
                    <Box borderRadius={3} {...accountTypeBoxProps}>
                        <FormLabel component="legend">Choose an account type</FormLabel>
                        <RadioGroup onChange={(e) => {
                            setAccountTypeBoxProps({})
                            setType(e.target.value)
                        }}>
                            <FormControlLabel value="client" control={<Radio color="primary" />} label="I am looking for support" />
                            <FormControlLabel value="worker" control={<Radio color="primary" />} label="I am a Support Worker" />
                        </RadioGroup>
                    </Box>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        name="firstName"
                        onChange={e => setFirstName(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        onChange={e => setLastName(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        onChange={e => setEmail(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        
                        onChange={e => setPassword(e.target.value)}
                    />
                    <Box borderRadius={3} {...agreementBoxProps}>
                        <FormControlLabel
                            className={classes.margin}
                            control={<Checkbox value={true} color="primary" 
                            onChange={(e) => {
                                setAgreementBoxProps({})
                                setAgreement(e.target.checked)
                                }}
                            />}
                            label="I confirm that I, as the account holder, am over 18 years of age and have read and agree with Kindle’s Terms of Use and Privacy Policy."
                        />
                    </Box>
                    <Typography variant="caption" display="block" gutterBottom>
                        Read Kindle’s&nbsp;
                    <Link href="#" onClick={() => console.log('link')} color="primary">
                        Terms of Use
                    </Link>
                    &nbsp;and&nbsp;
                    <Link href="#" onClick={() => console.log('link')} color="primary">
                        Privacy Policy
                    </Link>
                    .
                    </Typography>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleFormSubmit}
                    >
                        Sign Up
                    </Button>
                </form>
            </Paper>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity="error">
                    Please fill in all fields and make sure to agree on terms of use and privacy policy
                </Alert>
            </Snackbar>
        </div>
    );
}