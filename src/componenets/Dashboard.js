import React, { useEffect, useContext } from 'react';
import {
    Button, TextField, FormControlLabel, Checkbox, Container,
    Link, Paper, Box, Grid, Typography, Switch
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Redirect } from "react-router-dom"
import { UserContext } from '../context/UserContext'
import Registration from './Registration'


export default function Dashboard({ history }) {
    // useEffect(() => {
    //     if (!user)
    // })

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
        }
    }))

    const classes = useStyles()

    if (!user) {
        // return <Redirect to={'/'} /> temporary
        return <Registration />
    } else {
        if (!user.complete) {
            return <Registration />
        } else {
            return (<Paper>
                <div>
                    <Typography>Dashboard</Typography>
                    <Button onClick={() => history.push('/')}>test</Button>
                </div>
            </Paper>)
        }
    }
}