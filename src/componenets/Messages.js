import React, { useState, useEffect, useContext } from 'react';
import {
  Typography, Paper, TextField, Snackbar, Grid, Avatar, ListItemAvatar, ListItemSecondaryAction,
  List, ListItem, Divider, ListItemText, IconButton, Tooltip, Modal,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert';
import { Redirect } from 'react-router-dom'
import EmailIcon from '@material-ui/icons/Email'
import SendIcon from '@material-ui/icons/Send'
import moment from 'moment'
import TouchAppIcon from '@material-ui/icons/TouchApp';
import Registration from './Registration'
import { firebaseReplyMessage, firebaseGetJob, firebaseSetMessageAsRead } from '../api/Firebase'
import { UserContext } from '../context/UserContext'
import ApplyJob from './ApplyJob'
import { strings } from '../constants'

export default function Messages({ history }) {
  const [openError, setOpenError] = useState(false)
  const [openSuccess, setOpenSuccess] = useState(false)
  const [message, setMessage] = useState('')
  const [allMessages, setAllMessages] = useState([])
  const [index, setIndex] = useState(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [job, setJob] = useState(null)
  const [openApplyModal, setOpenApplyModal] = useState(false)

  const theme = useTheme()
  const {
    user, messages, removeMessageBadge, setRemoveMessageBadge,
  } = useContext(UserContext)

  useEffect(() => {
    setAllMessages(messages)
    setRemoveMessageBadge(true)
  }, [messages, removeMessageBadge])

  const useStyles = makeStyles(() => ({
    root: {
      width: '100%',
      height: '100%',
    },
    margin: {
      margin: theme.spacing(1),
    },
    grid: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    paper1: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    paper2: {
      padding: theme.spacing(2),
      width: '80%',
      overflow: 'auto',
      height: '60vh',
    },
    select: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    },
    paper3: {
      width: '80%',
      marginTop: theme.spacing(2),
      padding: theme.spacing(2),
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    avatar: {
      width: theme.spacing(7),
      height: theme.spacing(7),
      marginRight: theme.spacing(2),
    },
    me: {
      textAlign: 'right',
      padding: theme.spacing(2),
    },
    meTypography: {
      background: theme.palette.primary.light,
      padding: theme.spacing(2),
      borderRadius: 20,
      borderBottomRightRadius: 0,
    },
    otherUser: {
      padding: theme.spacing(2),
      textAlign: 'left',
    },
    otherUserTypography: {
      background: theme.palette.secondary.light,
      padding: theme.spacing(2),
      borderRadius: 20,
      borderBottomLeftRadius: 0,
    },
    new: {
      background: '#f0f0f0',
    },
    list: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    modal: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    },
    modalPaper: {
      width: '60%',
      height: '80%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: theme.spacing(2),
    },
    particularDaysSelect: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

  }))

  const classes = useStyles()

  const handleErrorClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenError(false);
    setMessage('')
  }

  const handleSuccessClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSuccess(false);
    setMessage('')
  }

  const handleSendMessage = () => {
    if (replyMessage) {
      const messageObject = {
        body: replyMessage,
        sender: user.type,
        time: Date.now(),
      }

      try {
        firebaseReplyMessage(allMessages[index].docId, messageObject)
          .then(() => setReplyMessage(''))
          .catch((error) => {
            setMessage(strings.message_send_error)
            setOpenError(true)
          })
      } catch (error) {
        setMessage(strings.message_send_error)
        setOpenError(true)
      }
    }
  }

  const handleApplyForJob = (id) => {
    try {
      firebaseGetJob(id)
        .then((job) => {
          setJob(job)
        })
        .then(() => setOpenApplyModal(true))
        .catch((error) => {
          setMessage(strings.message_apply_job)
          setOpenError(true)
        })
    } catch (error) {
      setMessage(strings.message_apply_job)
      setOpenError(true)
    }
  }

  const handleCloseApplyModal = () => {
    setOpenApplyModal(false)
    setJob(null)
  }

  if (!user) {
    return <Redirect to={strings.signin_url} />
  }

  if (!user.complete) {
    return <Registration history={history} />
  }

  return (
    <>
      <Grid container className={classes.root} spacing={0}>
        <Grid item xs={4} className={classes.grid}>
          <Paper className={classes.paper1} elevation={3}>
            <EmailIcon color="secondary" style={{ fontSize: 50, marginTop: theme.spacing(2) }} />
            <List component="nav" dense aria-label="mailbox folders" style={{ width: '100%' }}>
              <Divider style={{ padding: 0, marding: 0 }} />
              {allMessages.map((message, i) => (
                <div key={i}>
                  <ListItem
                    className={(message.messages[message.messages.length - 1].sender !== user.type && message.status === 'new') ? classes.new : null}
                    button
                    onClick={() => {
                      setIndex(i)

                      try {
                        firebaseSetMessageAsRead(message.docId)
                          .catch((error) => {
                            console.log('failed to set message as read', error)
                          })
                      } catch (error) {
                        console.log('failed to set message as read', error)
                      }

                      setTimeout(() => {
                        document.getElementById('messagingPlatform').scrollIntoView('smooth');
                      }, 0)
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={message.otherUser.avatar} className={classes.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" color="primary">{message.title}</Typography>
                                                    }
                      secondary={(
                        <>
                          <Typography variant="caption" style={{ display: 'block' }}>
                            {message.otherUser.firstName}
                            {' '}
                            {message.otherUser.lastName}
                          </Typography>
                          <Typography variant="caption" style={{ display: 'block' }}>{message.jobPostTime}</Typography>
                        </>
                                                      )}
                    />
                    {user.type === 'worker'
                      ? (
                        <ListItemSecondaryAction>
                          <Tooltip title="Apply" aria-label="add">
                            <IconButton edge="end" aria-label="apply" onClick={() => handleApplyForJob(message.jobId)}>
                              <TouchAppIcon color="secondary" />
                            </IconButton>
                          </Tooltip>
                        </ListItemSecondaryAction>
                      )
                      : null}
                  </ListItem>
                  <Divider style={{ padding: 0, marding: 0 }} />
                  <Modal
                    open={openApplyModal}
                    onClose={handleCloseApplyModal}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                  >
                    <div style={{ width: '100%', height: '100%' }}>
                      <ApplyJob job={job} setOpenApplyModal={setOpenApplyModal} />
                    </div>

                  </Modal>
                </div>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={8} className={classes.grid}>
          <Paper className={classes.paper2} elevation={3}>
            {allMessages[index]
              ? (
                <>
                  {allMessages[index].messages.map((item, j) => (
                    <div key={j} className={item.sender === user.type ? classes.me : classes.otherUser}>
                      <Typography variant="caption" className={item.sender === user.type ? classes.meTypography : classes.otherUserTypography}>{item.body}</Typography>
                      <Typography variant="caption" color="textSecondary" style={{ display: 'block', paddingTop: theme.spacing(2) }}>{moment(item.time).format('MMMM Do YYYY, h:mm a')}</Typography>
                    </div>
                  ))}
                </>
              )
              : (
                <div className={classes.select}>
                  <Typography>Select an item to read</Typography>
                </div>
              )}
            <div id="messagingPlatform" />
          </Paper>
          <Paper className={classes.paper3} elevation={3}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Send a message"
              name="message"
              multiline
              rows={2}
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            />
            <IconButton onClick={() => handleSendMessage()}><SendIcon color="secondary" /></IconButton>
          </Paper>
        </Grid>
      </Grid>
      <Snackbar open={openError} autoHideDuration={6000} onClose={handleErrorClose}>
        <Alert onClose={handleErrorClose} severity="error">
          {message}
        </Alert>
      </Snackbar>
      <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleSuccessClose}>
        <Alert onClose={handleSuccessClose} severity="success">
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}
