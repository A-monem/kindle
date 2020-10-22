import React, {useState, useEffect, useContext} from 'react';
import { Button, TextField, FormControlLabel, Checkbox, Link, Paper, Box, Grid, Typography, Card, CardActions, CardContent,
    Switch, CircularProgress, Container} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { firestore, auth, firebaseDeleteJob} from '../../api/Firebase'
import { UserContext } from '../../context/UserContext'
import moment from 'moment'

export default function Enquire(){

    useEffect(() => {

    }, [])

    const theme = useTheme()
    //const { jobs, addJobs} = useContext(UserContext)

    const useStyles = makeStyles(() => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
        },
    
    }))

    const classes = useStyles()

    return (
        <div className={classes.root}>
            <Typography>Enquire</Typography>
        </div>
    );
}