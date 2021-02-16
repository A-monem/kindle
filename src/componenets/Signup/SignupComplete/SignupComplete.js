import React, { useContext } from 'react'
import { Button, Typography } from '@material-ui/core'
import PropTypes from 'prop-types'
import { firebaseSendVerificationEmail } from '../../../api/Firebase'
import { strings } from '../../../constants'
import { AlertContext } from '../../../context/AlertContext'

function SignupComplete({ classes }) {
  const { showSuccessAlert, showErrorAlert } = useContext(AlertContext)

  return (
    <div className={classes.paper}>
      <Typography variant="h6" color="primary">
        {strings.signupThankyou}
      </Typography>
      <Typography variant="caption" display="block" gutterBottom className={classes.margin}>
        {strings.signupVerification}
      </Typography>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="secondary"
        onClick={() => {
          firebaseSendVerificationEmail()
            .then(() => showSuccessAlert(strings.verificationEmailResend))
            .catch((error) => showErrorAlert(error.message))
        }}
      >
        Resend
      </Button>
    </div>
  )
}

SignupComplete.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default SignupComplete
