import React, { useState, useEffect, useContext } from 'react';
import {
    Button, TextField, FormControlLabel, Checkbox, Container,
    Link, Paper, Box, Grid, Typography, Switch
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { UserContext } from '../context/UserContext'
import Registration from './Registration'
import { Redirect } from "react-router-dom"
import PostJob from './ClientJobBoard/PostJob'
import OldJobs from './ClientJobBoard/OldJobs'
import ClientJobBoard from './ClientJobBoard/ClientJobBoard'
import WorkerJobBoard from './WorkerJobBoard/WorkerJobBoard'
import { SentimentSatisfied, SettingsSharp } from '@material-ui/icons';


export default function JobBoard({ history }) {

    const theme = useTheme()
    const { user } = useContext(UserContext)

    const useStyles = makeStyles(() => ({
        root: {
            width: '100%',
            height: '100%',
            padding: theme.spacing(10)
        },
        margin: {
            margin: theme.spacing(1)
        }, 
        paper: {
            padding: theme.spacing(5),
            width: '80%',
            Height: '100%'
        }
    }))

    const classes = useStyles()

    if (!user) {
        return <Redirect to={'/signin'} />
    } else {
        if (!user.complete) {
            return <Registration history={history}/>
        } else if (user.type === 'client') {
            return <ClientJobBoard />
        } else if (user.type === 'worker') {
            return <WorkerJobBoard />
        }
    }
}

