// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDBz1f7G4nzNzVmdsV_-J1Oau-v_j4m-wg",
  authDomain: "coloresdelcielo.firebaseapp.com",
  projectId: "coloresdelcielo",
  storageBucket: "coloresdelcielo.appspot.com",
  messagingSenderId: "270205510079",
  appId: "1:270205510079:web:fb3b2497aa2dd443a2c10a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

console.log("Firestore conectado:", db);