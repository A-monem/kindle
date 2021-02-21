import React, { useState, useEffect } from 'react';
import {
  Typography, Paper, TextField, IconButton,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Redirect } from 'react-router-dom'
import EmailIcon from '@material-ui/icons/Email'
import SendIcon from '@material-ui/icons/Send'
import moment from 'moment'
import Registration from '../Registration'
import { firebaseReplyMessage } from '../../api/Firebase'
import { useUser } from '../../context/UserContext'
import { keyIdGenerator } from '../../api/RandomId'
import { strings } from '../../constants'
import { useAlert } from '../../context/AlertContext'
import InboxDrawer from './InboxDrawer'

export default function Messages({ history }) {
  const [allMessages, setAllMessages] = useState([])
  const [index, setIndex] = useState(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [openDrawer, setOpenDrawer] = useState(false)

  const {
    user, messages, removeMessageBadge, setRemoveMessageBadge,
  } = useUser()
  const { showErrorAlert } = useAlert()
  const theme = useTheme()

  useEffect(() => {
    setAllMessages(messages)
    setRemoveMessageBadge(true)
  }, [messages, removeMessageBadge])

  const useStyles = makeStyles(() => ({
    root: {
      width: '100%',
    },
    margin: {
      margin: theme.spacing(1),
    },
    grid: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    paper1: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      overflowY: 'auto',
    },
    paper2: {
      padding: theme.spacing(2),
      width: '80%',
      overflow: 'auto',
      height: '60vh',
      [theme.breakpoints.down('sm')]: {
        width: '90%',
      },
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
      [theme.breakpoints.down('sm')]: {
        width: '90%',
      },
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

  const toggleDrawer = (open) => {
    setOpenDrawer(open)
  };

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
            if (error.message) {
              showErrorAlert(error.message)
            } else {
              showErrorAlert('Failed to send message. Please contact Kindle support')
            }
          })
      } catch (error) {
        if (error.message) {
          showErrorAlert(error.message)
        } else {
          showErrorAlert('Failed to send message. Please contact Kindle support')
        }
      }
    }
  }

  if (!user) {
    return <Redirect to={strings.signin_url} />
  }

  if (!user.complete) {
    return <Registration history={history} />
  }

  return (
    <>
      <IconButton onClick={() => setOpenDrawer(true)}>
        <EmailIcon color="secondary" style={{ fontSize: 50, marginTop: theme.spacing(2) }} />
      </IconButton>
      <Paper className={classes.paper2} elevation={3}>
        {allMessages[index]
          ? (
            <>
              {allMessages[index].messages.map((item) => (
                <div key={keyIdGenerator()} className={item.sender === user.type ? classes.me : classes.otherUser}>
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
      <InboxDrawer
        openDrawer={openDrawer}
        toggleDrawer={toggleDrawer}
        allMessages={allMessages}
        user={user}
        setIndex={setIndex}
      />
    </>
  );
}
