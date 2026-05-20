import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  where,
  limit

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {

  apiKey:
  "AIzaSyAvp8zij9FF7Jmae0inb3mKBie1ZrW8Dzs",

  authDomain:
  "gokceyalcin-7d5a2.firebaseapp.com",

  projectId:
  "gokceyalcin-7d5a2",

  storageBucket:
  "gokceyalcin-7d5a2.firebasestorage.app",

  messagingSenderId:
  "948754842189",

  appId:
  "1:948754842189:web:6850d52f763f333715d204"

};

const app =
initializeApp(firebaseConfig);

const db =
getFirestore(app);

/* GLOBAL ACCESS */

window.db = db;

/* FIREBASE FUNCTIONS */

window.firebaseFns = {

  collection,
  addDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  where,
  limit

};

/* SECURITY HELPERS */

window.adminSecurity = {

  sessionKey:
  "gy_admin_session",

  login(password){

    if(password === "GY2026SecureAdmin"){
      
      sessionStorage.setItem(
        this.sessionKey,
        "true"
      );

      return true;

    }

    return false;

  },

  logout(){

    sessionStorage.removeItem(
      this.sessionKey
    );

  },

  isLoggedIn(){

    return sessionStorage.getItem(
      this.sessionKey
    ) === "true";

  }

};

console.log(
  "G&Y Firebase Connected Successfully"
);
