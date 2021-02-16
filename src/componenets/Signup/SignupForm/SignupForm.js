import React, { useState, useContext } from 'react';
import {
  Button, Typography, TextField, FormControlLabel, MenuItem, Checkbox, Link,
} from '@material-ui/core'
import PropTypes from 'prop-types'
import { firebaseAddUser } from '../../../api/Firebase'
import { strings } from '../../../constants'
import { AlertContext } from '../../../context/AlertContext'
import { keyIdGenerator } from '../../../api/RandomId'

function SignupForm({ classes, setShowForm }) {
  const [type, setType] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreement, setAgreement] = useState(false)
  const { showErrorAlert } = useContext(AlertContext)
  const textFieldParams = [
    {
      id: 'signup-firstName',
      label: 'First Name',
      name: 'firstName',
      onChange: (e) => setFirstName(e.target.value),
      type: 'text',
      value: firstName,
    },
    {
      id: 'signup-lastName',
      label: 'Last Name',
      name: 'lastName',
      onChange: (e) => setLastName(e.target.value),
      type: 'text',
      value: lastName,
    },
    {
      id: 'signup-email',
      label: 'Email Address',
      name: 'email',
      onChange: (e) => setEmail(e.target.value),
      type: 'text',
      value: email,
    },
    {
      id: 'signup-password',
      label: 'Password',
      name: 'password',
      onChange: (e) => setPassword(e.target.value),
      type: 'password',
      value: password,
    },
  ]
  const typeOptions = [{ text: 'I am looking for support', value: 'client' }, { text: 'I am a support worker', value: 'worker' }]

  const checkFields = () => {
    if (agreement === false) {
      showErrorAlert(strings.signup_error)

      return false
    }

    return true
  }

  const resetFields = () => {
    setType('')
    setFirstName('')
    setLastName('')
    setEmail('')
    setPassword('')
    setAgreement(false)
  }

  const handleFormSubmit = () => {
    const status = checkFields()

    if (status) {
      const complete = false

      firebaseAddUser(type, firstName, lastName, email, password, complete)
        .then(() => {
          resetFields()
          setShowForm(false)
        })
        .catch((e) => {
          showErrorAlert(e.message)
        })
    }
  }

  return (
    <>
      <form onSubmit={(e) => e.preventDefault() && false} className={classes.form}>
        <Typography variant="h6" className={classes.margin}>
          Sign Up
        </Typography>
        <TextField
          fullWidth
          select
          variant="outlined"
          margin="normal"
          required
          label="Select account type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          {typeOptions.map((option) => (
            <MenuItem key={keyIdGenerator()} value={option.value}>
              {option.text}
            </MenuItem>
          ))}
        </TextField>
        {textFieldParams.map((field) => (
          <TextField
            key={field.id}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id={field.id}
            label={field.label}
            type={field.type}
            name={field.name}
            value={field.value}
            onChange={field.onChange}
          />
        ))}
        <FormControlLabel
          className={classes.margin}
          control={(
            <Checkbox
              value
              color="primary"
              onChange={(e) => {
                setAgreement(e.target.checked)
              }}
            />
          )}
          label={strings.signup_confirmation}
        />
        <Typography variant="caption" display="block" gutterBottom>
          Read Kindle’s&nbsp;
          <Link href="/terms" target="_blank" color="primary">
            Terms of Use
          </Link>
          &nbsp;and&nbsp;
          <Link href="/privacy" target="_blank" color="primary">
            Privacy Policy
          </Link>
          .
        </Typography>
        <Button
          className={classes.margin}
          type="submit"
          fullWidth
          variant="contained"
          color="secondary"
          onClick={handleFormSubmit}
        >
          Sign Up
        </Button>
      </form>
    </>
  )
}

SignupForm.propTypes = {
  classes: PropTypes.object.isRequired,
  setShowForm: PropTypes.func.isRequired,
}

export default SignupForm
