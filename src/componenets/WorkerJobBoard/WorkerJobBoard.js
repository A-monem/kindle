import React, {useState, useEffect, useContext} from 'react';
import { Button, TextField, FormControlLabel, Checkbox, Link, Paper, Box, Grid, Typography, Card, CardActions, CardContent,
    Switch, CircularProgress, Container} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { firestore, auth, firebaseDeleteJob} from '../../api/Firebase'
import { UserContext } from '../../context/UserContext'
import moment from 'moment'
import Enquire from './Enquire'
import OpenJobs from './OpenJobs'

export default function WorkerJobBoard(){
    
    const [edit, setEdit] = useState(false)
    const [jobId, setJobId] = useState(null)

    useEffect(() => {

    }, [])

    const theme = useTheme()

    //const { jobs, addJobs} = useContext(UserContext)

    const useStyles = makeStyles(() => ({
        root: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
    }))

    const classes = useStyles()

    return (
       <div className={classes.root}>
            <OpenJobs setEdit={setEdit} setJobId={setJobId}/>
       </div>
    );
}