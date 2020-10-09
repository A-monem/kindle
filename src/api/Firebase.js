import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/analytics'

var firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
  }

firebase.initializeApp(firebaseConfig)
firebase.analytics()

export const auth = firebase.auth()
export const firestore = firebase.firestore()
export const storage = firebase.storage()

export const firebaseRecaptchaGenerator = () => {
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container')
  window.recaptchaVerifier.render()
}

export const firebaseSendVerificationCode = (phoneNumber, appVerifier) => {
  return new Promise((resolve, reject) => {
    console.log(phoneNumber)
    auth.signInWithPhoneNumber(phoneNumber, appVerifier)
    .then((confirmationResult) => {
      window.confirmationResult = confirmationResult
      resolve()
    })
    .catch((error) => reject(error.message))
  })
}

export const firebaseAddUser = (type, firstName, lastName, email, password, complete) => {
  return new Promise((resolve, reject) => {
    auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        firestore.collection('users').doc(auth.currentUser.uid).set({
          firstName,
          lastName,
          type, 
          email, 
          complete
        })
      })
      .then(() => {
        auth.currentUser.updateProfile({
          displayName: `${firstName} ${lastName}`
        })
      })
      .then(() => {
        auth.currentUser.sendEmailVerification()
          .then(() => resolve())
          .catch(error => reject(error))
      })
      .catch(function(error) {
        reject(error)
    })
  })
}

export const firebaseSendVerificationEmail = () => {
  return new Promise((resolve, reject) => {
        auth.currentUser.sendEmailVerification()
          .then(() => resolve())
          .catch(error => reject(error))
 
  })
}

export const firebaseLogin = (email, password) => {
  return new Promise((resolve, reject) => {
      auth.signInWithEmailAndPassword(email, password)
        .then(() => {
          if (auth.currentUser.emailVerified){
            firestore.collection('users').doc(auth.currentUser.uid).get()
            .then((user) => {
              resolve(user.data())
            })
            .catch(error => reject(error.message))
          } else {
            firebaseSendVerificationEmail()
            reject('Please verifiy your email address. Check your email address inbox or junk mail to verify')
          }
        })
        .catch(error => reject(error.message))
  })
}

export const firebaseLogout = () => {
  return new Promise((resolve, reject) => {
       auth.signOut()
       .then(() => {
         resolve()
        })
        .catch(error => reject(error.message))
  })
}

export const firebaseAddUserPersonalInfo = (profilePictureUrl, languageList, address, mobileNumber, emergency, gender, birthday, birthCountry, bio) => {
  return new Promise((resolve, reject) => {
    firestore.collection('users').doc(auth.currentUser.uid).get()
      .then((info) => {
        console.log({profilePictureUrl}, {languageList}, {address}, {mobileNumber}, {emergency}, {gender}, {birthday}, {birthCountry}, {bio})
        let user = info.data()
        console.log(user)
        user['profilePictureUrl'] = profilePictureUrl
        user['languages'] = languageList
        user['address'] = address
        user['mobileNumber'] = mobileNumber
        user['emergency'] = emergency
        user['gender'] = gender
        user['birthday'] = birthday
        user['birthCountry'] = birthCountry
        user['biograpghy'] = bio
        firestore.collection('users').doc(auth.currentUser.uid).set(user)
          .then(() => resolve(user))
          .catch(error => {
            console.log("i am here firebase")
            reject(error.message)
          })
      })
      .catch(error => reject(error.message))
  })
}

export const firebaseAddDisabilityInfo = (disabilityInfo) => {
  return new Promise((resolve, reject) => {
    firestore.collection('users').doc(auth.currentUser.uid).get()
      .then((info) => {
        let user = info.data()
        user['disabilityInfo'] = disabilityInfo
        firestore.collection('users').doc(auth.currentUser.uid).set(user)
          .then(() => resolve())
          .catch(error => reject(error.message))
      })
      .catch(error => reject(error.message))
  })
}

export const firebaseAddRefereeInfo = (refereeInfo) => {
  return new Promise((resolve, reject) => {
    firestore.collection('users').doc(auth.currentUser.uid).get()
      .then((info) => {
        let user = info.data()
        user['referee'] = refereeInfo
        firestore.collection('users').doc(auth.currentUser.uid).set(user)
          .then(() => resolve())
          .catch(error => reject(error.message))
      })
      .catch(error => reject(error.message))
  })
}

export const firebaseAddFinancialInfo = (financialInfo) => {
  return new Promise((resolve, reject) => {
    firestore.collection('users').doc(auth.currentUser.uid).get()
      .then((info) => {
        let user = info.data()
        user['financial'] = financialInfo
        firestore.collection('users').doc(auth.currentUser.uid).set(user)
          .then(() => resolve())
          .catch(error => reject(error.message))
      })
      .catch(error => reject(error.message))
  })
}

export const firebaseAddUserInfo = (name, newInfo) => {
  return new Promise((resolve, reject) => {
    firestore.collection('users').doc(auth.currentUser.uid).get()
      .then((info) => {
        let user = info.data()
        user[name] = newInfo
        firestore.collection('users').doc(auth.currentUser.uid).set(user)
          .then(() => resolve(user))
          .catch(error => reject(error.message))
      })
      .catch(error => reject(error.message))
  })
}

export const firebaseGetServiceAgreementUrl = () => {
  return new Promise((resolve, reject) => {
    storage.ref('service_agreement/Kindle_Service_Agreement.pdf').getDownloadURL()
      .then((url) => resolve(url))
      .catch(error => reject(error.message))
  })
}

export const firebaseSetRegistrationComplete = () => {
  return new Promise((resolve, reject) => {
    firestore.collection('users').doc(auth.currentUser.uid).get()
    .then((info) => {
      let user = info.data()
      user['complete'] = true
      firestore.collection('users').doc(auth.currentUser.uid).set(user)
        .then(() => resolve(user))
        .catch(error => reject(error.message))
    })
    .catch(error => reject(error.message))
  })
}

// **************************************************************** //

export const firebaseGetTimetable = (userId) => {
  return new Promise((resolve, reject) => {

    if (!userId) {
      userId = auth.currentUser.uid
    }

    firestore.collection('users').doc(userId).get()
    .then((info) => {
      const timetable = info.data().timetable
      console.log(timetable)
      resolve(timetable)
    })
    .catch(error => reject(error.message))
  })
}

export const firebaseSetTimetable = (timetable) => {
  return new Promise((resolve, reject) => {
    firestore.collection('users').doc(auth.currentUser.uid).get()
    .then((info) => {
      let user = info.data()
      user['timetable'] = timetable
      firestore.collection('users').doc(auth.currentUser.uid).set(user)
        .then(() => resolve(user))
        .catch(error => reject(error.message))
    })
    .catch(error => reject(error.message))
  })
}

export const firebaseAddEventToTimetable = (event) => {
  return new Promise((resolve, reject) => {
    firestore.collection('users').doc(auth.currentUser.uid).get()
    .then((info) => {
      let user = info.data()
      let timetable = user.timetable
      console.log(timetable)
      timetable.push(event)
      user['timetable'] = timetable
      firestore.collection('users').doc(auth.currentUser.uid).set(user)
        .then(() => resolve(timetable))
        .catch(error => reject(error.message))
    })
    .catch(error => reject(error.message))
  })
}

