import React, { Component } from 'react';
import { Button, TextField, FormControlLabel, Checkbox,
    Link, Paper, Box, Grid, Typography, Switch} from '@material-ui/core'
import Appbar from './Appbar'
import { makeStyles, useTheme } from '@material-ui/core/styles'

export default function Home({ history }){

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