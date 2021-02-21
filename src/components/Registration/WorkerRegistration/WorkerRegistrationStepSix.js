import React, { useState, useEffect } from 'react';
import {
  Typography, Button, TextField, LinearProgress, Link, Box,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { auth, storage } from '../../../api/Firebase'
import { useAlert } from '../../../context/AlertContext'
import NextBackButtons from '../NextBackButtons'
import { strings, arrays } from '../../../constants'
import { keyIdGenerator } from '../../../api/RandomId'

function UploadDocumentTemplate({
  classes, documentName, setVerified,
}) {
  const [progress, setProgress] = useState(0)
  const [document, setDocument] = useState('')

  const { showErrorAlert } = useAlert()

  const handleDocumentUpload = () => {
    try {
      const upload = storage.ref(`user_documents/${auth.currentUser.uid}/${documentName}`).put(document)

      upload.on('state_changed',
        (snapshot) => {
          setProgress(Math.floor(snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        },
        (error) => {
          console.log('error')

          if (error.message) {
            showErrorAlert(error.message)
          } else {
            showErrorAlert('Failed to upload document. Please contact Kindle support')
          }
        },
        () => {
          setVerified(true)
        })
    } catch (error) {
      showErrorAlert('Please select a document first')
    }
  }

  return (
    <div className={classes.fullWidthOnMedium}>
      <div className={classes.uploadButtons}>
        <TextField
          size="small"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="uploadDocument"
          type="file"
          onChange={(e) => {
            console.log(e.target.files[0])

            if (e.target.files[0]) {
              setDocument(e.target.files[0])
            }
          }}
        />
        <Button
          variant="contained"
          size="small"
          className={classes.uploadButton}
          onClick={handleDocumentUpload}
        >
          Upload
        </Button>
      </div>
      <LinearProgress value={progress} variant="determinate" color="primary" />
    </div>
  )
}

export default function WorkerRegistrationStepSix({ activeStep, setActiveStep }) {
  const [verified1, setVerified1] = useState(false)
  const [verified2, setVerified2] = useState(false)
  const [verified3, setVerified3] = useState(false)
  const [verified4, setVerified4] = useState(false)
  const [verified5, setVerified5] = useState(false)

  const theme = useTheme()
  const { showErrorAlert } = useAlert()

  useEffect(() => {
    document.getElementById('kindleApp').scrollIntoView();
  }, [])

  const useStyles = makeStyles(() => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      flexGrow: 1,
      width: '100%',
      marginTop: theme.spacing(3),
      [theme.breakpoints.down('lg')]: {
        marginTop: theme.spacing(0),
      },
    },
    fullWidthOnMedium: {
      width: '60%',
      [theme.breakpoints.down('md')]: {
        width: '100%',
      },
    },
    uploadButton: {
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(2),
    },
    backButton: {
      marginRight: theme.spacing(1),
    },
    buttons: {
      width: '100%',
      marginTop: theme.spacing(4),
      display: 'flex',
      justifyContent: 'center',
    },
    uploadButtons: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
  }))

  const classes = useStyles()

  const handleNext = (e) => {
    e.preventDefault()

    if (verified1 && verified2 && verified3 && verified4 && verified5) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
    } else {
      showErrorAlert('Please make sure you have uploaded all required documents')
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className={classes.root}>
      <form onSubmit={(e) => handleNext(e)}>
        <Box mt={2}>
          <Typography variant="subtitle1" color="primary">First aid</Typography>
          <Typography variant="caption" style={{ display: 'block' }}>{strings.CPR}</Typography>
          <ul style={{ color: theme.palette.secondary, fontSize: '0.75rem' }}>
            {arrays.firstaidOptions.map((option) => <li key={keyIdGenerator()}>{option}</li>)}
          </ul>
          <UploadDocumentTemplate
            classes={classes}
            documentName="firstAid"
            setVerified={setVerified1}
          />
        </Box>
        <Box mt={4}>
          <Typography variant="subtitle1" color="primary">Driving licence</Typography>
          <UploadDocumentTemplate
            classes={classes}
            documentName="drivingLicence"
            setVerified={setVerified2}
          />
        </Box>
        <Box mt={4}>
          <Typography variant="subtitle1" color="primary">NDIS worker orientation module</Typography>
          <Typography variant="caption" style={{ display: 'block' }}>
            {strings.ndis_orientation_1}
            {' '}
            <Link target="_blank" href="https://training.ndiscommission.gov.au/">online training course</Link>
            {' '}
            {strings.ndis_orientation_2}
          </Typography>
          <Typography variant="caption" style={{ display: 'block' }}>{strings.ndis_message}</Typography>
          <UploadDocumentTemplate
            classes={classes}
            documentName="ndisTraining"
            setVerified={setVerified3}
          />
        </Box>
        <Box mt={4}>
          <Typography variant="subtitle1" color="primary">Working with children check</Typography>
          <Typography variant="caption" style={{ display: 'block' }}>{strings.working_with_children_message}</Typography>
          <UploadDocumentTemplate
            classes={classes}
            documentName="WWCC"
            setVerified={setVerified4}
          />
        </Box>
        <Box mt={4}>
          <Typography variant="subtitle1" color="primary">National police check</Typography>
          <Typography variant="caption" style={{ display: 'block' }}>{strings.police_check}</Typography>
          <Typography variant="caption" style={{ display: 'block' }}>{strings.police_check_duration}</Typography>
          <UploadDocumentTemplate
            classes={classes}
            documentName="policeCheck"
            setVerified={setVerified5}
          />
        </Box>
        <NextBackButtons classes={classes} handleBack={handleBack} disable={activeStep === 0} />
      </form>
    </div>
  );
}
