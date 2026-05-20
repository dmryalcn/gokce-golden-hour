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
orderBy

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

window.db = db;

window.firebaseFns = {

collection,
addDoc,
getDocs,
onSnapshot,
serverTimestamp,
query,
orderBy

};
