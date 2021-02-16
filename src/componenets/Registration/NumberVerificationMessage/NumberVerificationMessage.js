import React, { useState } from 'react'
import {
  Modal, Typography, Paper, TextField, Button,
} from '@material-ui/core'
import PropTypes from 'prop-types'
import { firebaseSendVerificationCode } from '../../../api/Firebase'
import { useAlert } from '../../../context/AlertContext'

function NumberVerificationMessage({ classes, mobileNumber, setMobileNumberVerified }) {
  const [openMobileVerificationModal, setOpenMobileVerificationModal] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const { showErrorAlert, showSuccessAlert } = useAlert()

  const handleMobileVerification = () => {
    const appVerifier = window.recaptchaVerifier;
    const regex = /04[\d]{8}/

    if (mobileNumber.match(regex)) {
      const intMobileNumber = `+61${mobileNumber.slice(1, 10)}`

      firebaseSendVerificationCode(intMobileNumber, appVerifier)
        .then(() => {
          setOpenMobileVerificationModal(true)
        })
        .catch((error) => {
          showErrorAlert(error.message)
        })
    } else {
      showErrorAlert('Please enter a correct mobile number')
    }
  }

  const handleMobileVerificationConfirmation = () => {
    const { confirmationResult } = window

    confirmationResult.confirm(verificationCode)
      .then(() => {
        setOpenMobileVerificationModal(false)
        setVerificationCode('')
        setMobileNumberVerified(true)
        showSuccessAlert('Successful Verification')
      }).catch((error) => {
        showErrorAlert(error.message)
      });
  }

  const handleMobileVerificationClose = () => {
    setOpenMobileVerificationModal(false)
  }

  return (
    <>
      <Typography variant="caption">Please verify your mobile number</Typography>
      <div className={classes.mobileVerififcation}>
        <div id="recaptcha-container" />
        <Button
          variant="contained"
          size="small"
          onClick={handleMobileVerification}
        >
          Verifiy
        </Button>
      </div>
      <Modal
        open={openMobileVerificationModal}
        className={classes.mobileVerififcationModal}
        onClose={handleMobileVerificationClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <>
          <Paper className={classes.mobileVerififcationModalPaper}>
            <Typography variant="subtitle2">A verification code has been sent as an SMS to your mobile number</Typography>
            <TextField
              size="small"
              variant="outlined"
              margin="normal"
              id="verificationCode"
              label="Enter Verification Code"
              name="verificationCode"
              placeholder="123456"
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleMobileVerificationConfirmation}
            >
              Submit Code
            </Button>
          </Paper>
        </>
      </Modal>
    </>
  )
}

NumberVerificationMessage.propTypes = {
  classes: PropTypes.object.isRequired,
  mobileNumber: PropTypes.string.isRequired,
  setMobileNumberVerified: PropTypes.func.isRequired,
}

export default NumberVerificationMessage
