import React, { useContext, useState } from 'react'
import { Button, TextField, FormControlLabel, Checkbox, Snackbar,
    Link, Paper, Box, Grid, Typography, Switch} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { UserContext } from '../context/UserContext'
import { firebaseLogin } from '../api/Firebase'

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                www.kindleDisabilityServices.com
      </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    )
}

export default function Signin({ history }) {

    const [email, setEmail] = useState('aamnafea@hotmail.com')
    const [password, setPassword] = useState('Banana101')
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')

    const { addUser, addPassword} = useContext(UserContext)
    const theme = useTheme()

    const useStyles = makeStyles(() => ({
        root: {
            overflow: 'hidden',
            flexGrow: 1
        },
        image: {
            backgroundImage: `url(${process.env.PUBLIC_URL}/disability2.jpeg)`,
            backgroundRepeat: 'no-repeat',
            backgroundColor:
                theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        },
        paper: {
            margin: theme.spacing(6, 4),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        logo: {
            width: theme.spacing(20),
            height: theme.spacing(20),
        },
        label: {
            width: '100%',
            marginTop: theme.spacing(3),
        },
        form: {
            width: '100%', // Fix IE 11 issue.
            marginTop: theme.spacing(1),
        },
        submit: {
            margin: theme.spacing(3, 0, 2),
        },
        link: {
            alignItems: 'center'
        }
    }))
    const classes = useStyles()

    const login = () => {
        firebaseLogin(email, password)
            .then((user) => {
                addUser(user)
                addPassword(password)
                history.push('/dashboard')
            })
            .catch((error) => {
                setErrorMessage(error)
                setOpen(true)
            })
    }

    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <Grid container component="main" className={classes.root}>
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <img src={`./logo.png`} alt={'logo'} className={classes.logo} />
                    <Typography variant="h6" className={classes.label}>
                        Sign in
                    </Typography>
                    <form className={classes.form} onSubmit={e => e.preventDefault() && false}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
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
                            autoComplete="current-password"
                            onChange={e => setPassword(e.target.value)}
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={() => login()}
                        >
                            Sign In
                        </Button>
                        <Grid container className={classes.link}>
                            <Grid item xs>
                                <Link href="#" variant="body2" >
                                    Forgot password?
                                </Link>
                            </Grid>
                        </Grid>
                        <Box mt={3}>
                            <Copyright />
                        </Box>
                    </form>
                    <Snackbar open={open} autoHideDuration={6000} onClose={handleAlertClose}>
                        <Alert onClose={handleAlertClose} severity="error">
                            {errorMessage}
                        </Alert>
                    </Snackbar>
                </div>
            </Grid>
        </Grid>
    )
}