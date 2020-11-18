import React, { useEffect, useContext } from 'react';
import {
    Button, TextField, FormControlLabel, Checkbox, Container,
    Link, Paper, Box, Grid, Typography, Switch
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Redirect } from "react-router-dom"
import { UserContext } from '../context/UserContext'
import Registration from './Registration'
import Timetable from './Timetabale'


export default function Dashboard({ history }) {

    const theme = useTheme()
    const { user } = useContext(UserContext)

    const useStyles = makeStyles(() => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1
        },
        margin: {
            margin: theme.spacing(1)
        }, 
        paper: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            margin: theme.spacing(10),
            padding: theme.spacing(5),
            width: '80%',
            Height: '80%'
        }
    }))

    const classes = useStyles()

    if (!user) {
        return <Redirect to={'/signin'} />
        //return <Registration />
    } else {
        if (!user.complete) {
            return <Registration history={history}/>
        } else {
            return <Paper className={classes.paper} elevation={3}><Timetable/></Paper>
        }
    }
}

