// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

let app;
let database;
let analytics;
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgTN9-DDeWvZOev6Gj2t0xqEHXm3yoh74",
  authDomain: "anura-messaging.firebaseapp.com",
  databaseURL: "https://anura-messaging-default-rtdb.firebaseio.com",
  projectId: "anura-messaging",
  storageBucket: "anura-messaging.appspot.com",
  messagingSenderId: "179043958828",
  appId: "1:179043958828:web:554efe7e16799d1a0e1189",
  measurementId: "G-PN9KVYT6P6",
};

if (typeof window !== "undefined") {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  database = getDatabase();
}

export { app, database, analytics };
