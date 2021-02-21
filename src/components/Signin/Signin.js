import React, { useContext, useState } from 'react'
import {
  Button, TextField, FormControlLabel, Checkbox,
  Link, Paper, Box, Grid, Typography,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { UserContext } from '../../context/UserContext'
import { useAlert } from '../../context/AlertContext'
import { firebaseLogin } from '../../api/Firebase'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        www.kindleDisabilityServices.com
      </Link>
      {' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

function Signin({ history }) {
  const [email, setEmail] = useState('afox@hotmail.com')
  //  const [email, setEmail] = useState('aamnafea@hotmail.com')
  const [password, setPassword] = useState('Banana101')
  const [disable, setDisable] = useState(false)

  const { showErrorAlert } = useAlert()
  const { addUser } = useContext(UserContext)
  const theme = useTheme()

  const useStyles = makeStyles(() => ({
    root: {
      overflow: 'hidden',
      flexGrow: 1,
    },
    image: {
      backgroundImage: `url(${process.env.PUBLIC_URL}/images/disability6.jpeg)`,
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
      width: '100%',
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    link: {
      alignItems: 'center',
    },
  }))
  const classes = useStyles()

  const login = () => {
    setDisable(true)

    firebaseLogin(email, password)
      .then((user) => {
        addUser(user)
        history.push('/dashboard')
      })
      .catch((error) => {
        setDisable(false)
        addUser(null)

        if (error.message) {
          showErrorAlert(error.message)
        } else {
          showErrorAlert('Login failed. Please checek your username and password')
        }
      })
  }

  return (
    <Grid container component="main" className={classes.root}>
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <img src={`${process.env.PUBLIC_URL}/images/logo.png`} alt="logo" className={classes.logo} />
          <Typography variant="h6" className={classes.label}>
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={(e) => e.preventDefault() && false}>
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
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={classes.submit}
              onClick={() => login()}
              disabled={disable}
            >
              Sign In
            </Button>
            <Grid container className={classes.link}>
              <Grid item xs>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
            <Box mt={3}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  )
}

Signin.propTypes = {
  history: PropTypes.object.isRequired,
}

export default Signin
