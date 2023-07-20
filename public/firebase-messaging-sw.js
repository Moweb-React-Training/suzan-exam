import  initializeApp  from 'firebase/app';
import firebase from 'firebase/app';
import Scripts from" https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js";
import Scriptag from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js';


var firebaseConfig = {
    apiKey: "AIzaSyAL7PVTDiDpwApkRAsiLUq-jwUZYd98Fs8",
    authDomain: "fir-notification-setup.firebaseapp.com",
    projectId: "fir-notification-setup",
    storageBucket: "fir-notification-setup.appspot.com",
    messagingSenderId: "687392077617",
    appId: "1:687392077617:web:5927162c2ebff078c9a210",
    measurementId: "G-19BLLE1TRY"
  };

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});