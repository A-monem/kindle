import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  Typography, Avatar, ListItemAvatar, ListItemSecondaryAction,
  List, ListItem, Divider, ListItemText, IconButton, Tooltip, Modal, Drawer,
} from '@material-ui/core'
import TouchAppIcon from '@material-ui/icons/TouchApp'
import { keyIdGenerator } from '../../api/RandomId'
import { firebaseGetJob, firebaseSetMessageAsRead } from '../../api/Firebase'
import ApplyJob from './ApplyJob'
import { useAlert } from '../../context/AlertContext'

const anchor = 'left'

export default function InboxDrawer({
  openDrawer, toggleDrawer, allMessages, user, setIndex,
}) {
  const [job, setJob] = useState(null)
  const [openApplyModal, setOpenApplyModal] = useState(false)

  const theme = useTheme()
  const { showErrorAlert } = useAlert()

  const useStyles = makeStyles({
    list: {
      width: 450,
      [theme.breakpoints.down('sm')]: {
        width: 300,
      },
    },
  });

  const classes = useStyles();

  const handleApplyForJob = (id) => {
    try {
      firebaseGetJob(id)
        .then((appliedJob) => {
          setJob(appliedJob)
        })
        .then(() => setOpenApplyModal(true))
        .catch((error) => {
          if (error.message) {
            showErrorAlert(error.message)
          } else {
            showErrorAlert('Failed to apply for this job. Please contact Kindle support')
          }
        })
    } catch (error) {
      if (error.message) {
        showErrorAlert(error.message)
      } else {
        showErrorAlert('Failed to apply for this job. Please contact Kindle support')
      }
    }
  }

  const handleCloseApplyModal = () => {
    setOpenApplyModal(false)
    setJob(null)
  }

  const list = () => (
    <div
      className={classes.list}
      role="presentation"
      // onClick={() => toggleDrawer(false)}
      // onKeyDown={() => toggleDrawer(false)}
    >
      <List>
        {allMessages.map((message, i) => (
          <div key={keyIdGenerator()}>
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
    </div>
  )

  return (
    <div>
      <Drawer anchor={anchor} open={openDrawer} onClose={() => toggleDrawer(false)}>
        {list()}
      </Drawer>
    </div>
  )
}
