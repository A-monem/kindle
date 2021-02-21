import React, { useState } from 'react';
import {
  Paper, Typography, IconButton, Icon, Modal, Box,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import OldJobs from './OldJobs'
import PostJob from './PostJob'

export default function ClientJobBoard() {
  const [edit, setEdit] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [jobToBeEdited, setJobToBeEdited] = useState(null)
  const theme = useTheme()
  const useStyles = makeStyles(() => ({
    root: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    paper: {
      width: '80%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: theme.spacing(2),
      padding: theme.spacing(2),
      [theme.breakpoints.down('sm')]: {
        width: '90%',
      },
    },
    Box: {
      width: '80%',
      [theme.breakpoints.down('sm')]: {
        width: '90%',
      },
    },
    postJobModal: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
  }))

  const classes = useStyles()

  const handleOpenModal = () => {
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

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
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h6" color="primary">Post a job</Typography>
        <IconButton onClick={handleOpenModal}>
          <Icon color="primary" fontSize="large">add_circle</Icon>
        </IconButton>
      </Paper>
      <Box mt={2} className={classes.Box}>
        <OldJobs setEdit={setEdit} setJobToBeEdited={setJobToBeEdited} />
      </Box>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        className={classes.postJobModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <PostJob edit={edit} setEdit={setEdit} jobToBeEdited={jobToBeEdited} setOpenModal={setOpenModal} />
      </Modal>
    </div>
  );
}
