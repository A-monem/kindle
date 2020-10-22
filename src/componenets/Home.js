import React, { useEffect } from 'react';
import { Button, TextField, FormControlLabel, Checkbox,
    Link, Paper, Box, Grid, Typography, Switch} from '@material-ui/core'
import Appbar from './Appbar'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { auth } from '../api/Firebase'

export default function Home({ history }){

    useEffect(() => {
        // console.log(auth.currentUser)
    }, [])

    const theme = useTheme()

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
            <Typography variant="h6" >
                Home
            </Typography>
        </div>
    );

}