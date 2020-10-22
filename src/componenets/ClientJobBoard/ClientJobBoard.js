import React, {useState, useEffect, useContext} from 'react';
import { Paper, Grid } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { UserContext } from '../../context/UserContext'
import OldJobs from './OldJobs'
import PostJob from './PostJob'

export default function ClientJobBoard(){
    
    const [edit, setEdit] = useState(false)
    const [jobToBeEdited, setJobToBeEdited] = useState(null)

    useEffect(() => {

    }, [])

    const theme = useTheme()

    const { jobs, addJobs} = useContext(UserContext)

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

    return (
        <Grid container className={classes.root}>
            <Grid item xs={12} md={6}>
                <Paper className={classes.paper} elevation={3}>
                    <PostJob edit={edit} setEdit={setEdit} jobToBeEdited={jobToBeEdited}/>
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <OldJobs setEdit={setEdit} setJobToBeEdited={setJobToBeEdited}/>
            </Grid>
        </Grid>
    );
}