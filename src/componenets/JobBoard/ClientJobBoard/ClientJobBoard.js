import React, { useState } from 'react';
import {
  Paper, Typography, IconButton, Icon, Box,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import OldJobs from './OldJobs'
import PostJob from './PostJob'

export default function ClientJobBoard() {
  const [edit, setEdit] = useState(false)
  const [jobToBeEdited, setJobToBeEdited] = useState(null)
  const theme = useTheme()
  const useStyles = makeStyles(() => ({
    root: {
      width: '100%',
      height: '100%',
      padding: theme.spacing(10),
    },
    paper: {
      width: '40%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing(2),
      [theme.breakpoints.down('sm')]: {
        width: '80%',
      },
    },
  }))
  const classes = useStyles()

  return (
    // <Grid container className={classes.root}>
    //   <Grid item xs={12} md={6}>
    //     <Paper className={classes.paper} elevation={3}>
    //       <PostJob edit={edit} setEdit={setEdit} jobToBeEdited={jobToBeEdited} />
    //     </Paper>
    //   </Grid>
    //   <Grid item xs={12} md={6}>
    //     <OldJobs setEdit={setEdit} setJobToBeEdited={setJobToBeEdited} />
    //   </Grid>
    // </Grid>
    <Box mt={2}>
      <Paper className={classes.paper}>
        <Typography variant="h6" color="primary">Post a job</Typography>
        <IconButton onClick={() => console.log('Modal')}>
          <Icon color="primary" fontSize="large">add_circle</Icon>
        </IconButton>
      </Paper>
    </Box>
  );
}
