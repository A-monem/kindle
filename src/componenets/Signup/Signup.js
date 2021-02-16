import React, { useState } from 'react';
import { Typography, Paper, Grid } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import SignupForm from './SignupForm'
import SignupComplete from './SignupComplete'

function Signup() {
  const theme = useTheme()
  const [showForm, setShowForm] = useState(true);

  const useStyles = makeStyles(() => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      display: 'flex',
      height: '100%',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing(2),
    },
    image: {
      backgroundImage: `url(${process.env.PUBLIC_URL}/images/disability8.jpg)`,
      backgroundRepeat: 'no-repeat',
      backgroundColor:
                theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    form: {
      width: '80%',
    },
    margin: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },

  }))

  const classes = useStyles()

  return (
    <Grid container component="main" className={classes.root}>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        {showForm ? (
          <div className={classes.paper}>
            <Typography variant="h6" color="primary">
              Welcome to Kindle
            </Typography>
            <SignupForm classes={classes} setShowForm={setShowForm} />
          </div>
        ) : (
          <SignupComplete classes={classes} />
        )}
      </Grid>
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
    </Grid>
  );
}

export default Signup
