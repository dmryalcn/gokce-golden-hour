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

import {

getAuth,
signInWithEmailAndPassword,
signOut,
onAuthStateChanged

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* =========================================================
FIREBASE CONFIG
========================================================= */

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

/* =========================================================
APP
========================================================= */

const app =
initializeApp(firebaseConfig);

const db =
getFirestore(app);

const auth =
getAuth(app);

/* =========================================================
GLOBAL ACCESS
========================================================= */

window.db = db;
window.auth = auth;

/* =========================================================
FIREBASE FUNCTIONS
========================================================= */

window.firebaseFns = {

/* Firestore */

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
limit,

/* Auth */

signInWithEmailAndPassword,
signOut,
onAuthStateChanged

};

/* =========================================================
AUTH HELPERS
========================================================= */

window.authHelpers = {

async login(email,password){

```
return await signInWithEmailAndPassword(
  auth,
  email,
  password
);
```

},

async logout(){

```
return await signOut(auth);
```

},

listen(callback){

```
return onAuthStateChanged(
  auth,
  callback
);
```

}

};

/* =========================================================
READY
========================================================= */

console.log(
"G&Y Firebase Auth Connected Successfully"
);
