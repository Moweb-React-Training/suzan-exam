import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';


const firebaseConfig = {
    apiKey: "AIzaSyAL7PVTDiDpwApkRAsiLUq-jwUZYd98Fs8",
    authDomain: "fir-notification-setup.firebaseapp.com",
    projectId: "fir-notification-setup",
    storageBucket: "fir-notification-setup.appspot.com",
    messagingSenderId: "687392077617",
    appId: "1:687392077617:web:5927162c2ebff078c9a210",
    measurementId: "G-19BLLE1TRY"
  };

  
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const getMessagingToken = (setTokenFound) => {
  return getToken(messaging, { vapidKey:"BAXZD9ZR39KOTpi3vrkDm0Sd2QzRJT0I594ctvWjvCCXswgAzWOY1kWN1GxOyIBj44DM0UDCbaKE4_d3rDZL1-o"}).then((currentToken) => {
    if (currentToken) {
      console.log('current token for client: ', currentToken);
      setTokenFound(true);  
      // Track the token -> client mapping, by sending to the backend server
      // show on the UI that permission is secured
    } else {
      console.log('No registration token available. Request permission to generate one.');
      setTokenFound(false);
      // shows on the UI that permission is required 
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // catch error while creating the client token
  });
};

export const onMessageListener = () => new Promise((resolve) => {
  onMessage(messaging, (payload) => {
    resolve(payload);
  });
});