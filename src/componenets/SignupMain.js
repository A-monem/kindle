import React from 'react';
import { Button, Typography } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'

export default function Signup({ history }) {
    const theme = useTheme()
    const useStyles = makeStyles(() => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
        },
        logo: {
            width: theme.spacing(30),
            height: theme.spacing(30),
            marginTop: theme.spacing(10)
        },
        signupOptionsBox: {
            width: theme.spacing(70),
            height: theme.spacing(40),
            margin: theme.spacing(2)
        },
        signupOptionsPaper: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            margin: theme.spacing(2)
        },
        margin: {
            margin: theme.spacing(1)
        }
    }))

    const classes = useStyles()

    return (
        <div className={classes.root}>
            <img src={`./logo_4.png`} alt={'logo'} className={classes.logo} />
            <Typography variant="h6" color='primary'>
                Welcome to Kindle
            </Typography>
            <div className={classes.signupOptionsPaper}>
                <Button variant="outlined" onClick={() => history.push('/signup/client')} className={classes.margin}>
                    I am looking for support
                </Button>
                <Button variant="outlined" onClick={() => history.push('/signup/worker')} className={classes.margin}>
                    I am a support worker
                </Button>
            </div>
        </div>
    );
}