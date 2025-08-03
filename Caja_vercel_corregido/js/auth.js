import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDBz1f7G4nzNzVmdsV_-J1Oau-v_j4m-wg",
  authDomain: "coloresdelcielo.firebaseapp.com",
  projectId: "coloresdelcielo",
  storageBucket: "coloresdelcielo.appspot.com",
  messagingSenderId: "270205510079",
  appId: "1:270205510079:web:fb3b2497aa2dd443a2c10a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const form = document.getElementById("login-form");
const errorDiv = document.getElementById("error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorDiv.textContent = "";

  const email = form.email.value;
  const password = form.password.value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const perfilRef = doc(db, "usuarios", uid);
    const perfilSnap = await getDoc(perfilRef);

    if (perfilSnap.exists()) {
      const data = perfilSnap.data();
      if (data.rol === "admin") {
        window.location.href = "admin.html";
      } else if (data.rol === "vendedor") {
        window.location.href = "vendedor.html";
      } else {
        errorDiv.textContent = "Rol no válido.";
      }
    } else {
      errorDiv.textContent = "No se encontró perfil para este usuario.";
    }

  } catch (err) {
    errorDiv.textContent = "Error: " + err.message;
  }
});
