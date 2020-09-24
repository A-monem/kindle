import React, { Component } from 'react';
import { Button, TextField, FormControlLabel, Checkbox, Container,
    Link, Paper, Box, Grid, Typography, Switch} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'

export default function Signup({ history }){
    const theme = useTheme()
    const useStyles = makeStyles(() => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1
        },
        margin:{
            margin: theme.spacing(1)
        }
    }))

    const classes = useStyles()

    return (
        <div className={classes.root}>
            <Paper>
                <div>
                    <Typography>Worker</Typography>
                </div>
               
            </Paper>
        </div>
    );
}