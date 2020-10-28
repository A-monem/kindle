importScripts('https://www.gstatic.com/firebasejs/7.21.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.21.0/firebase-messaging.js');

var firebaseConfig = {
    apiKey: "AIzaSyCKrmpyYSBvKuFZ3JAmppApjLcR7EVN-nQ",
    authDomain: "kindle-9e359.firebaseapp.com",
    databaseURL: "https://kindle-9e359.firebaseio.com",
    projectId: "kindle-9e359",
    storageBucket: "kindle-9e359.appspot.com",
    messagingSenderId: "685681329066",
    appId: "1:685681329066:web:2576a102391275ee41e1d3",
    measurementId: "G-BX18V9CFVT"
  };

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging();

