import React, { useState, useEffect, useContext } from 'react';
import {
  Typography, Button, Paper, RadioGroup, Radio, FormControlLabel, TextField,
  MenuItem, IconButton, Icon, List, ListItemText, ListItem, Grid, Modal, Snackbar, LinearProgress,
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles, useTheme } from '@material-ui/core/styles'
import languages from 'language-list'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import { getNames } from 'country-list'
import GoogleApiWrapper from '../Map'
import {
  firebaseRecaptchaGenerator, firebaseSendVerificationCode,
  firebaseAddUserPersonalInfo, firebaseLogin, storage, auth,
} from '../../../api/Firebase'
import { strings } from '../../../constants'
import { UserContext } from '../../../context/UserContext'

export default function WorkerRegistrationStepOne({ setActiveStep }) {
  const [openError, setOpenError] = useState(false)
  const [openSuccess, setOpenSuccess] = useState(false)
  const [message, setMessage] = useState('')
  const [photo, setPhoto] = useState(null)
  const [profilePictureUrl, setProfilePictureUrl] = useState(null)
  const [progress, setProgress] = React.useState(0);
  const [languageList, setLanguageList] = useState(['English'])
  const [languageHolder, setLanguageHolder] = useState('')
  const languagesArray = languages().getData()
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [suburb, setSuburb] = useState('')
  const [stateAus, setStateAus] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [lat, setLat] = useState()
  const [long, setLong] = useState()
  const [mobileNumber, setMobileNumber] = useState('')
  const [openMobileVerificationModal, setOpenMobileVerificationModal] = useState(false)
  const [verificationCode, setVerificationCode] = useState(null)
  const [mobileNumberVerified, setMobileNumberVerified] = useState(false)
  const [emergencyName, setEmergencyName] = useState('')
  const [emergencyMobileNumber, setEmergencyMobileNumber] = useState('')
  const [gender, setGender] = useState('')
  const [birthday, setBirthday] = useState(new Date())
  const [birthCountry, setBirthCountry] = useState('Australia')
  const countriesArray = getNames()
  const [bio, setBio] = useState('')
  const theme = useTheme()
  const { user, addUser } = useContext(UserContext)

  useEffect(() => {
    firebaseRecaptchaGenerator()

    const script = document.createElement('script');

    script.src = 'https://api.addressfinder.io/assets/v3/widget.js';
    script.async = true;
    // eslint-disable-next-line no-use-before-define
    script.onload = loadWidget
    document.body.appendChild(script);

    if (user.profilePictureUrl) {
      setProfilePictureUrl(user.profilePictureUrl)
    }

    if (user.languages) {
      setLanguageList(user.languages)
    }

    if (user.address) {
      setAddress1(user.address.address1)
      setAddress2(user.address.address2)
      setSuburb(user.address.suburb)
      setStateAus(user.address.stateAus)
      setPostalCode(user.address.postalCode)
    }

    if (user.mobileNumber) {
      setMobileNumber(user.mobileNumber)
      setMobileNumberVerified(true)
    }

    if (user.emergency) {
      setEmergencyName(user.emergency.emergencyName)
      setEmergencyMobileNumber(user.emergency.emergencyMobileNumber)
    }

    if (user.gender) {
      setGender(user.gender)
    }

    if (user.birthday) {
      console.log(new Date(user.birthday))
      setBirthday(new Date(user.birthday))
    }

    if (user.birthCountry) {
      setBirthCountry(user.birthCountry)
    }

    if (user.biograpghy) {
      setBio(user.biograpghy)
    }
  }, [])

  const useStyles = makeStyles(() => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      flexGrow: 1,
      width: '100%',
      marginTop: theme.spacing(2),
    },
    margin: {
      marginTop: theme.spacing(2),
    },
    photo: {
      marginTop: theme.spacing(10),
      width: '100%',
    },
    photoUpload: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      alignItems: 'space-evenly',
      width: '100%',
      height: '100%',
    },
    photoUploadButtons: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    avatar: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    language: {
      width: '50%',
    },
    languageList: {
      width: '100%',
    },
    languageListItem: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'space-between',
      paddingRight: 0,
    },
    languageSelect: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%',
    },
    location: {
      marginTop: theme.spacing(2),
      width: '100%',
    },
    addressTwo: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    map: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
    },
    mobile: {
      marginTop: theme.spacing(2),
      width: '50%',
    },
    emergancy: {
      marginTop: theme.spacing(2),
      width: '50%',
    },
    mobileVerififcation: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      marginTop: theme.spacing(2),
    },
    mobileVerififcationModal: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    mobileVerififcationModalPaper: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: theme.spacing(80),
      height: theme.spacing(50),
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
    bio: {
      marginTop: theme.spacing(2),
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
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
  const handleAddPhoto = (e) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0])
    }
  }
  const handlePhotoUpload = () => {
    const uploadPhoto = storage.ref(`profile_images/${auth.currentUser.uid}/${photo.name}`).put(photo)

    uploadPhoto.on('state_changed',
      (snapshot) => {
        setProgress(Math.floor(snapshot.bytesTransferred / snapshot.totalBytes) * 100)
      },
      (error) => {
        setMessage(error.message)
        setOpenError(true)
      },
      () => {
        uploadPhoto.snapshot.ref.getDownloadURL()
          .then((url) => {
            setProfilePictureUrl(url)
          })
          .catch((error) => {
            setMessage(error.message)
            setOpenError(true)
          })
      })
  }
  const handleChangeLanguage = (e) => {
    setLanguageHolder(e.target.value)
  }
  const handleAddlanguage = () => {
    if (languageHolder !== '') {
      const arr = [...languageList]

      if (!arr.includes(languageHolder)) {
        arr.push(languageHolder)
        setLanguageList(arr)
      }
    }
  }
  const handleDeleteLanguage = (language) => {
    const arr = languageList.filter((lang) => lang !== language)

    setLanguageList(arr)
  }
  const loadWidget = () => {
    const { AddressFinder } = window
    const widget = new AddressFinder.Widget(
      document.getElementById('address1'),
      '3V8QKPFBJYDNHLU679RE',
      'AU',
    );

    widget.on('result:select', (fullAddress, metaData) => {
      setAddress1(metaData.address_line_1)
      setAddress2(metaData.address_line_2)
      setSuburb(metaData.locality_name)
      setStateAus(metaData.state_territory)
      setPostalCode(metaData.postcode)
      setLong(metaData.longitude)
      setLat(metaData.latitude)
    });
  }
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
          setMessage(error)
          setOpenError(true)
        })
    } else {
      setMessage('Please enter a correct mobile number')
      setOpenError(true)
    }
  }
  const handleMobileVerificationConfirmation = () => {
    const { confirmationResult } = window

    confirmationResult.confirm(verificationCode)
      .then(() => {
        setOpenMobileVerificationModal(false)
        setVerificationCode(null)
        setMobileNumberVerified(true)
        setMessage('Successful Verification')
        setOpenSuccess(true)
      }).catch((error) => {
        setMessage(error.message)
        setOpenError(true)
      });
  }
  const handleMobileVerificationClose = () => {
    setOpenMobileVerificationModal(false)
  }
  const handleDateChange = (date) => {
    setBirthday(date);
  }
  const handleChangeBirthCountry = (e) => {
    setBirthCountry(e.target.value)
  }
  const checkFields = () => {
    if (profilePictureUrl) {
      if (languageList) {
        if (mobileNumber && mobileNumberVerified) {
          return true
        }

        setMessage('Please make sure you entered a valid mobile number. Please verify you mobile number.')
        setOpenError(true)

        return false
      }

      setMessage('Please make sure you added a language you speak.')
      setOpenError(true)

      return false
    }

    setMessage('Please make sure you uploaded your photo.')
    setOpenError(true)

    return false
  }
  const handleNext = (e) => {
    e.preventDefault()

    const check = checkFields()
    const address = {
      address1,
      address2,
      suburb,
      stateAus,
      postalCode,
    }
    const emergency = {
      emergencyName,
      emergencyMobileNumber,
    }
    const birthdayMilliseconds = birthday.getTime()

    if (check) {
      // eslint-disable-next-line max-len
      firebaseAddUserPersonalInfo(profilePictureUrl, languageList, address, mobileNumber, emergency, gender, birthdayMilliseconds, birthCountry, bio)
        .then((userInfo) => {
          addUser(userInfo)
          setActiveStep((prevActiveStep) => prevActiveStep + 1)
        })
        .catch((error) => {
          setMessage(error)
          setOpenError(true)
        })
    }
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className={classes.root}>
      <form className={classes.form} onSubmit={(e) => handleNext(e)}>
        <div className={classes.photo}>
          <Typography variant="subtitle1" color="primary">1) Upload your photo</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <div className={classes.photoUpload}>
                <div className={classes.photoUploadButtons}>
                  <TextField
                    size="small"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="uploadphoto"
                    name="uploadphoto"
                    type="file"
                    onChange={handleAddPhoto}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{ marginTop: theme.spacing(1), marginLeft: theme.spacing(2) }}
                    onClick={handlePhotoUpload}
                  >
                    Upload
                  </Button>
                </div>
                <LinearProgress value={progress} variant="determinate" color="primary" />
              </div>
            </Grid>
            <Grid item xs={6} className={classes.avatar}>
              <img
                alt="Profile Picture"
                src={profilePictureUrl || './user.png'}
                // eslint-disable-next-line max-len
                style={{ width: theme.spacing(30), height: theme.spacing(30), borderRadius: theme.spacing(15) }}
              />
            </Grid>
          </Grid>
        </div>
        <div className={classes.language}>
          <Typography variant="subtitle1" color="primary">2) What languages do you speak ?</Typography>
          <List dense className={classes.languageList}>
            {languageList.map((language) => (
              <div key={language} className={classes.languageListItem}>
                <ListItem>
                  <ListItemText primary={language} />
                </ListItem>
                <IconButton onClick={() => handleDeleteLanguage(language)}><DeleteForeverIcon color="primary" /></IconButton>
              </div>
            ))}
          </List>
          <div className={classes.languageSelect}>
            <TextField
              fullWidth
              select
              size="small"
              label="Select a language"
              style={{ margin: 0, padding: 0 }}
              value={languageHolder}
              onChange={handleChangeLanguage}
              variant="outlined"
            >
              {languagesArray.map((option) => (
                <MenuItem key={option.code} value={option.language}>
                  {option.language}
                </MenuItem>
              ))}
            </TextField>
            <IconButton onClick={() => handleAddlanguage()}>
              <Icon color="primary" fontSize="small">add_circle</Icon>
            </IconButton>
          </div>
        </div>
        <div className={classes.location}>
          <Typography variant="subtitle1" color="primary">3) What is your address ?</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                size="small"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="address1"
                label="Address line 1"
                name="address1"
                value={address1}
                onChange={(e) => {
                  setAddress1(e.target.value)
                  setAddress2('')
                  setSuburb('')
                  setStateAus('')
                  setPostalCode('')
                }}
              />
              <TextField
                size="small"
                variant="outlined"
                margin="normal"
                fullWidth
                id="address2"
                label="Address line 2"
                name="address2"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
              />
              <div className={classes.addressTwo}>
                <TextField
                  size="small"
                  variant="outlined"
                  margin="normal"
                  required
                  style={{ marginRight: theme.spacing(1) }}
                  id="suburb"
                  label="Suburb"
                  name="suburb"
                  value={suburb}
                  onChange={(e) => setSuburb(e.target.value)}
                />
                <TextField
                  size="small"
                  variant="outlined"
                  margin="normal"
                  required
                  style={{ marginRight: theme.spacing(1) }}
                  id="state"
                  label="State"
                  name="state"
                  value={stateAus}
                  onChange={(e) => setStateAus(e.target.value)}
                />
                <TextField
                  size="small"
                  variant="outlined"
                  margin="normal"
                  required
                  id="postalCode"
                  label="Postal Code"
                  name="postalCode"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />

              </div>
            </Grid>
            <Grid item xs={6} className={classes.map}>
              <div style={{ position: 'relative', width: '100%', height: '100%' }} id="map">
                <GoogleApiWrapper lat={lat} long={long} />
              </div>
            </Grid>
          </Grid>
        </div>
        <div className={classes.mobile}>
          <Typography variant="subtitle1" color="primary">4) What is your mobile number ?</Typography>
          <TextField
            size="small"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="mobileNumber"
            label="Mobile Number"
            name="mobileNumber"
            type="tel"
            placeholder="0444888999"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
          {!mobileNumberVerified
            ? (
              <>
                <Typography variant="caption">Please verify your mobile number</Typography>
                <div className={classes.mobileVerififcation}>
                  <div id="recaptcha-container" />
                  <Button
                    variant="contained"
                    color="primary"
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
                        color="primary"
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
            : <Typography variant="caption">Mobile number has been verified</Typography>}
        </div>
        <div className={classes.emergancy}>
          <Typography variant="subtitle1" color="primary">5) Who should we contact in case of emergency ?</Typography>
          <TextField
            size="small"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="Full Name"
            name="emergancyFullName"
            placeholder="James Bond"
            value={emergencyName}
            onChange={(e) => setEmergencyName(e.target.value)}
          />
          <TextField
            size="small"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="emergencymobileNumber"
            label="Emergency Mobile Number"
            name="emergencymobileNumber"
            type="tel"
            placeholder="0444888999"
            value={emergencyMobileNumber}
            onChange={(e) => setEmergencyMobileNumber(e.target.value)}
          />
        </div>
        <div style={{ marginTop: theme.spacing(2) }}>
          <Typography variant="subtitle1" color="primary">6) What is your gender ?</Typography>
          <RadioGroup onChange={(e) => setGender(e.target.value)} value={gender}>
            <FormControlLabel value="Male" control={<Radio color="primary" required />} label="Male" />
            <FormControlLabel value="Female" control={<Radio color="primary" required />} label="Female" />
          </RadioGroup>
        </div>
        <div style={{ marginTop: theme.spacing(2) }}>
          <Typography variant="subtitle1" color="primary">7) What is your date of birth ?</Typography>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              format="dd/MM/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Birthday"
              value={birthday}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
        </div>
        <div style={{ marginTop: theme.spacing(2), width: '50%' }}>
          <Typography variant="subtitle1" color="primary">8) In which country you were born ?</Typography>
          <TextField
            fullWidth
            select
            size="small"
            label="Select a country"
            value={birthCountry}
            onChange={handleChangeBirthCountry}
            variant="outlined"
            style={{ marginTop: theme.spacing(2) }}
          >
            {countriesArray.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className={classes.margin}>
          <Typography variant="subtitle1" color="primary">9) Write a short biography for your profile</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} className={classes.bio}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="bio"
                label="Biography"
                name="bio"
                multiline
                rows={7}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="primary">Example</Typography>
              <Typography variant="body2">{strings.client_bio}</Typography>
            </Grid>
          </Grid>

        </div>
        <div className={classes.buttons}>
          <Button
            variant="contained"
            disabled
            onClick={handleBack}
            className={classes.backButton}
          >
            Back
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Next
          </Button>
        </div>
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
      </form>
    </div>
  );
}
