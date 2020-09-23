import React, { Component } from 'react';
import { Button, TextField, FormControlLabel, Checkbox, Container,
    Link, Paper, Box, Grid, Typography, Switch} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'

export default function Signup({ history }){
    const theme = useTheme()
    const useStyles = makeStyles(() => ({
        root: {
            width: '100%',
            height: '100%',
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
        margin:{
            margin: theme.spacing(1)
        }
    }))

    const classes = useStyles()

    return (
        <div className={classes.root}>
            <Typography>Signup Client</Typography>
        </div>
    );
}