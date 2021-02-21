import React, { useState, useEffect } from 'react';
import {
  Typography, Button, RadioGroup, Radio, FormControlLabel,
  TextField, MenuItem, IconButton, Icon, List, ListItemText, ListItem, Grid, LinearProgress,
  useMediaQuery, Box,
} from '@material-ui/core'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles, useTheme } from '@material-ui/core/styles'
import languages from 'language-list'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import { getNames } from 'country-list'
import PropTypes from 'prop-types'
import GoogleApiWrapper from '../Map'
import { firebaseAddUserPersonalInfo, storage, auth } from '../../../api/Firebase'
import { useUser } from '../../../context/UserContext'
import { useAlert } from '../../../context/AlertContext'
import NextBackButtons from '../NextBackButtons'
// import NumberVerificationMessage from '../NumberVerificationMessage'
import { strings } from '../../../constants'

function WorkerRegistrationStepOne({ setActiveStep }) {
  const [photo, setPhoto] = useState('')
  const [profilePictureUrl, setProfilePictureUrl] = useState('')
  const [progress, setProgress] = useState(0);
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
  // const [mobileNumberVerified, setMobileNumberVerified] = useState(false)
  const [emergencyName, setEmergencyName] = useState('')
  const [emergencyMobileNumber, setEmergencyMobileNumber] = useState('')
  const [gender, setGender] = useState('')
  const [birthday, setBirthday] = useState(new Date())
  const [birthCountry, setBirthCountry] = useState('Australia')
  const countriesArray = getNames()
  const [bio, setBio] = useState('')

  const { user, addUser } = useUser()
  const theme = useTheme()
  const { showErrorAlert } = useAlert()
  const matches = useMediaQuery(theme.breakpoints.up('lg'))

  const loadWidget = () => {
    const { AddressFinder } = window
    const widget = new AddressFinder.Widget(
      document.getElementById('address1'),
      process.env.REACT_APP_ADDRESS_KEY,
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

  useEffect(() => {
    // firebaseRecaptchaGenerator()

    const script = document.createElement('script');

    script.src = 'https://api.addressfinder.io/assets/v3/widget.js';
    script.async = true;
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
      // setMobileNumberVerified(false)
    }

    if (user.emergency) {
      setEmergencyName(user.emergency.emergencyName)
      setEmergencyMobileNumber(user.emergency.emergencyMobileNumber)
    }

    if (user.gender) {
      setGender(user.gender)
    }

    if (user.birthday) {
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
      marginTop: theme.spacing(3),
      [theme.breakpoints.down('lg')]: {
        marginTop: theme.spacing(0),
      },
    },
    margin: {
      marginTop: theme.spacing(2),
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
    languageListItem: {
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
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }))

  const classes = useStyles()

  const handleAddPhoto = (e) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0])
    }
  }

  const handlePhotoUpload = () => {
    if (photo) {
      const uploadPhoto = storage.ref(`profile_images/${auth.currentUser.uid}/${photo.name}`).put(photo)

      uploadPhoto.on('state_changed',
        (snapshot) => {
          setProgress(Math.floor(snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        },
        (error) => {
          if (error.message) {
            showErrorAlert(error.message)
          } else {
            showErrorAlert('Photo could not be uploaded')
          }
        },
        () => {
          uploadPhoto.snapshot.ref.getDownloadURL()
            .then((url) => {
              setProfilePictureUrl(url)
            })
            .catch((error) => {
              if (error.message) {
                showErrorAlert(error.message)
              } else {
                showErrorAlert('Photo could not be uploaded')
              }
            })
        })
    } else {
      showErrorAlert('Please choose a photo first')
    }
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

  const handleDateChange = (date) => {
    setBirthday(date);
  }

  const handleChangeBirthCountry = (e) => {
    setBirthCountry(e.target.value)
  }

  const checkFields = () => {
    if (profilePictureUrl) {
      if (languageList) {
        // if (mobileNumber && mobileNumberVerified) {
        //   return true
        // }

        // showErrorAlert('Please make sure you entered a valid mobile number. Please verify you mobile number.')

        // return false
        return true
      }

      showErrorAlert('Please make sure you added a language you speak.')

      return false
    }

    showErrorAlert('Please make sure you uploaded your photo.')

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
      firebaseAddUserPersonalInfo(profilePictureUrl, languageList, address, mobileNumber, emergency, gender, birthdayMilliseconds, birthCountry, bio)
        .then((userInfo) => {
          addUser(userInfo)
          setActiveStep((prevActiveStep) => prevActiveStep + 1)
        })
        .catch((error) => {
          if (error.message) {
            showErrorAlert(error.message)
          } else {
            showErrorAlert('Registration failed. Please contact Kindle support')
          }
        })
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className={classes.root}>
      <form className={classes.form} onSubmit={(e) => handleNext(e)}>
        <Box mt={2}>
          <Typography variant="subtitle1" color="primary">1) Upload your photo</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
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
                    color="secondary"
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
            <Grid item xs={false} lg={6} className={classes.avatar}>
              {matches && (
              <img
                alt="Profile Picture"
                src={profilePictureUrl || `${process.env.PUBLIC_URL}/images/user.png`}
                style={{
                  width: theme.spacing(30), height: theme.spacing(30), borderRadius: theme.spacing(15), objectFit: 'cover',
                }}
              />
              )}
            </Grid>
          </Grid>
        </Box>
        <Box mt={2}>
          <Typography variant="subtitle1" color="primary">2) What languages do you speak ?</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <List dense className={classes.languageList}>
                {languageList.map((language) => (
                  <div key={language} className={classes.languageListItem}>
                    <ListItem>
                      <ListItemText primary={language} />
                    </ListItem>
                    <IconButton onClick={() => handleDeleteLanguage(language)}>
                      <DeleteForeverIcon />
                    </IconButton>
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
                  <Icon fontSize="small">add_circle</Icon>
                </IconButton>
              </div>
            </Grid>
          </Grid>
        </Box>
        <Box mt={2}>
          <Typography variant="subtitle1" color="primary">3) What is your address ?</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
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
                value={address2 || ''}
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
            <Grid item xs={12} lg={6} className={classes.map}>
              <div style={{ position: 'relative', width: '100%', height: '100%' }} id="map">
                <GoogleApiWrapper lat={lat} long={long} />
              </div>
            </Grid>
          </Grid>
        </Box>
        <Box mt={2}>
          <Typography variant="subtitle1" color="primary">4) What is your mobile number ?</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
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
              {/* {!mobileNumberVerified
                ? (
                  <NumberVerificationMessage
                    mobileNumber={mobileNumber}
                    setMobileNumberVerified={setMobileNumberVerified}
                    classes={classes}
                  />
                )
                : <Typography variant="caption">Mobile number has been verified</Typography>} */}
            </Grid>
          </Grid>
        </Box>
        <Box mt={2}>
          <Typography variant="subtitle1" color="primary">5) Who should we contact in case of emergency ?</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
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
            </Grid>
          </Grid>
        </Box>
        <Box mt={2}>
          <Typography variant="subtitle1" color="primary">6) What is your gender ?</Typography>
          <RadioGroup onChange={(e) => setGender(e.target.value)} value={gender}>
            <FormControlLabel value="Male" control={<Radio color="primary" required />} label="Male" />
            <FormControlLabel value="Female" control={<Radio color="primary" required />} label="Female" />
          </RadioGroup>
        </Box>
        <Box mt={2}>
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
        </Box>
        <Box mt={2}>
          <Typography variant="subtitle1" color="primary">8) In which country you were born ?</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
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
            </Grid>
          </Grid>
        </Box>
        <Box mt={2}>
          <Typography variant="subtitle1" color="primary">9) Write a short biography for your profile</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6} className={classes.bio}>
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
            <Grid item xs={12} lg={6}>
              {matches && (
                <>
                  <Typography variant="subtitle2" color="primary">Example</Typography>
                  <Typography variant="caption">
                    {strings.worker_bio}
                  </Typography>
                </>
              )}
            </Grid>
          </Grid>
        </Box>
        <NextBackButtons classes={classes} handleBack={handleBack} disable />
      </form>
    </div>
  );
}

WorkerRegistrationStepOne.propTypes = {
  setActiveStep: PropTypes.func.isRequired,
}

export default WorkerRegistrationStepOne
