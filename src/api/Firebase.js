import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/analytics'
import 'firebase/messaging'
import randomId from 'random-id'
import moment from 'moment'

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

const len = 10
const pattern = 'aA0'

export const auth = firebase.auth()
export const firestore = firebase.firestore()
export const storage = firebase.storage()
export const messaging = firebase.messaging()

export const firebaseGetToken = () => {
  
  Notification.requestPermission()
    .then((permission) => {
      console.log(permission)

      messaging.getToken({vapidKey:'BMfUY_D1iYZp0oJHFjTfkosgBzBD6qPl8N5pr1ugMpoAoxcB770zvG2LjadkiEOzdDYtB3yAjouF-kVVUfdkqEA'})
      .then((token) => {
       
        console.log(token)

        // messaging.onBackgroundMessage(function(payload) {
        //   console.log('[firebase-messaging-sw.js] Received background message ', payload);
      
        // });
        
      })
      .catch((error) => console.log(error.message))

    })
    .catch((error) => console.log(error.message))
 
}


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
      .then(() => firestore.collection('timetables').doc(auth.currentUser.uid).set({
        Ongoing: [],
        Once: []
      }))
      .then(() => firestore.collection('timesheets').doc(auth.currentUser.uid).set({}))
      .then(() => firestore.collection('reviews').doc(auth.currentUser.uid).set({}))
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
         // if (auth.currentUser.emailVerified){
            firestore.collection('users').doc(auth.currentUser.uid).get()
            .then((user) => {
              resolve(user.data())
            })
            .catch(error => reject(error.message))
          // } else {
          //   firebaseSendVerificationEmail()
          //   reject('Please verifiy your email address. Check your email address inbox or junk mail to verify')
          // }
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
        
        let user = info.data()
        
        user['membership'] = Date.now()
        user['avatar'] = profilePictureUrl
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

export const firebaseGetUserInfo = (id) => {
  return new Promise((resolve, reject) => {
    firestore.collection('users').doc(id).get()
      .then((info) => {
        resolve(info.data())
      })
      .catch(error => reject(error))
  })
}

export const firebaseGetAllUsers = (userType) => {
  return new Promise((resolve, reject) => {
    firestore.collection('users').where('type', '!=', userType).get()
      .then((snapshot) => {
          let users = []
          snapshot.forEach((doc) => users.push({
            id: doc.id,
            data: doc.data()
          }))
          resolve(users)
      })
      .catch(error => reject(error))
  })
}

export const firebaseGetServiceAgreementUrl = (document) => {
  return new Promise((resolve, reject) => {
    storage.ref(`service_agreement/${document}.pdf`).getDownloadURL()
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

export const firebaseGetTimetable = () => {
  return new Promise((resolve, reject) => {
    firestore.collection('timetables').doc(auth.currentUser.uid).get()
    .then((info) => {
      const timetable = info.data()
      //once off & ongoing
      resolve(timetable)
    })
    .catch(error => reject(error.message))
  })
}

export const firebaseAddEventToTimetable = (event, eventType, user) => {
  return new Promise((resolve, reject) => {
    
    let job = {
      name: event.name,
      avatar: event.avatar,
      rate: event.rate,
      time: []
    }

    event.particularSupportTime.forEach((supportTime) => {
      job.time.push({
        startDate: supportTime.from,
        endDate: supportTime.to,
      })
    })

    console.log(eventType)

    firestore.collection('timetables').doc(auth.currentUser.uid).get()
      .then((info) => {
        let timetable = info.data()
        timetable[eventType].push(job)
        firestore.collection('timetables').doc(auth.currentUser.uid).set(timetable)
          .then(() => {
            firestore.collection('timetables').doc(event.workerId).get()
              .then((info) => {
                let timetable = info.data()
                job.name = `${user.firstName} ${user.lastName}`
                job.avatar = user.avatar
                timetable[eventType].push(job)
                firestore.collection('timetables').doc(event.workerId).set(timetable)
              })
              .then(() => resolve())
              .catch(error => reject(error.message))
          })
          .catch(error => reject(error.message))
      })
      .catch(error => reject(error.message))
  })
}

export const firebasePostJob = (job) => {
  return new Promise((resolve, reject) => {

      const id = randomId(len, pattern)
      
      job['jobId'] = id
      job['offers'] = []

      firestore.collection('jobs').doc(id).set(job)
        .then(() => resolve())
        .catch(error => reject(error))

  })
}

export const firebaseGetJob = (id) => {
  return new Promise((resolve, reject) => {

      firestore.collection('jobs').doc(id).get()
        .then((doc) => {
           resolve(doc.data())
        })
        .catch(error => reject(error.message))

  })
}

export const firebaseDeleteJob = (postTime) => {
  return new Promise((resolve, reject) => {
  
    firestore.collection('jobs').where( 'id' ,'==', auth.currentUser.uid).where( 'postTime' ,'==', postTime).get()
      .then((snapshot) => {
        snapshot.forEach((doc) =>{
          firestore.collection('jobs').doc(doc.id).delete()
        });
      })
      .then(() => resolve())
      .catch(error => reject(error.message))

  })
}

export const firebaseSendOffer = (jobId, offer) => {
  return new Promise((resolve, reject) => {
      firestore.collection('jobs').doc(jobId).get()
        .then((info) => {
          let job = info.data()
          job['offers'].push(offer)
          firestore.collection('jobs').doc(jobId).set(job)
            .then(() => resolve(job))
            .catch(error => reject(error.message))
          })
        .catch(error => reject(error.message))
  })
}

export const firebaseAcceptOffer = (jobId, index, user) => {
  return new Promise((resolve, reject) => {
      firestore.collection('jobs').doc(jobId).get()
        .then((info) => {
          let job = info.data()
          
          job['status'] = 'Closed'
          
          let x = []

          job['offers'].forEach((offer, i) => {
              if (i === index){
                offer.status = 'Accepted'
                firebaseAddEventToTimetable(offer, job.jobType, user)
              } else {
                offer.status = 'Rejected'
              }
              x.push(offer)
          })

          job['offers'] = x
          
          firestore.collection('jobs').doc(jobId).set(job)
            .then(() => resolve(job))
            .catch(error => reject(error.message))
          })
        .catch(error => reject(error.message))
  })
}


export const firebaseSendMessage = (message) => {
  return new Promise((resolve, reject) => {

    const id = randomId(len, pattern)
    console.log(message.jobId)
    firestore.collection('messages').where("jobId", "==", message.jobId).where("clientId", "==", message.clientId).where("workerId", "==", message.workerId).get()
      .then((snapshot) => {
          if (snapshot.docs.length > 0){
            snapshot.forEach((doc) => {
              firebaseReplyMessage(doc.id, message.messages[0])
            })
          } else {
            firestore.collection('messages').doc(id).set(message)
              .then(() => resolve())
              .catch(error => reject(error))
          }
      })
      .catch(error => reject(error))
  })
}

export const firebaseReplyMessage = (id, message) => {
  return new Promise((resolve, reject) => {
    firestore.collection('messages').doc(id).get()
      .then((info) => {
        let data = info.data()
        data.status = 'new'
        data.messages.push(message)
        console.log(data)
        firestore.collection('messages').doc(id).set(data)
          .then(() => resolve())
          .catch(error => reject(error.message))
      })
      .catch(error => reject(error.message))
  })
}

export const firebaseGetUserMessages = (user) => {
  return new Promise((resolve, reject) => {

    let queryId = ''
    let otherUserId = ''
    let messages = []

    if (user.type === 'client') {
      queryId = 'clientId'
      otherUserId = 'workerId'
    } else if ((user.type === 'worker')) {
      queryId = 'workerId'
      otherUserId = 'clientId'
    }

      firestore.collection('messages').where( queryId ,'==', auth.currentUser.uid).get()
          .then((snapshot) => {
            snapshot.forEach((doc, i) => {
              let messageHolder = doc.data()
            
              firebaseGetUserInfo(messageHolder[otherUserId])
                  .then((otherUser) => {
                  
                      messageHolder['otherUser'] = otherUser
                      messageHolder['jobPostTime'] = moment(messageHolder.jobPostTime).format('MMMM Do YYYY, h:mm a')
                      messageHolder['docId'] = doc.id
                      messages.push(messageHolder)
                  })
                  .then(() => {
                    if (messages.length === snapshot.size){
                      resolve(messages)
                    }
                  })
                  .catch(error => reject(error.message))
            })
          })
          .catch(error => reject(error.message))
  })
}

export const firebaseSetMessageAsRead = (id) => {
  return new Promise((resolve, reject) => {

      firestore.collection('messages').doc(id).get()
          .then((doc) => {
              let msg = doc.data()
              msg['status'] = 'read'
              firestore.collection('messages').doc(id).set(msg)
              .then(() => resolve())
          })
          .catch(error => reject(error.message))
  })
}



