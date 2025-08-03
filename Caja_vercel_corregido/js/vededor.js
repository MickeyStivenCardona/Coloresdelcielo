import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
  import {
    getFirestore,
    collection,
    getDocs,
    getDoc,
    setDoc,
    updateDoc,
    doc
  } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

  const firebaseConfig = {
    apiKey: "AIzaSyDBz1f7G4nzNzVmdsV_-J1Oau-v_j4m-wg",
    authDomain: "coloresdelcielo.firebaseapp.com",
    projectId: "coloresdelcielo",
    storageBucket: "coloresdelcielo.appspot.com",
    messagingSenderId: "270205510079",
    appId: "1:270205510079:web:fb3b2497aa2dd443a2c10a"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  async function fetchMesas() {
    const mesasSnapshot = await getDocs(collection(db, "mesas"));
    const mesasList = document.getElementById("mesas-list");
    mesasList.innerHTML = "";
    mesasSnapshot.forEach((doc) => {
      const data = doc.data();
      const mesa = document.createElement("div");
      mesa.className = "mesa";
      mesa.innerHTML = `<strong>${data.nombre}</strong> – Mozo: ${data.mozo}`;
      mesasList.appendChild(mesa);
    });
  }

  async function fetchProductos() {
    const productosSnapshot = await getDocs(collection(db, "productos"));
    const productosList = document.getElementById("productos-list");
    productosList.innerHTML = "";
    productosSnapshot.forEach((doc) => {
      const data = doc.data();
      const producto = document.createElement("div");
      producto.className = "producto";
      producto.innerHTML = `<span>${data.name} - $${data.price.toFixed(2)}</span>`;
      productosList.appendChild(producto);
    });
  }

  async function cargarCaja() {
    const estadoRef = doc(db, "caja", "estado");
    const docSnap = await getDoc(estadoRef);

    if (!docSnap.exists()) return;

    const data = docSnap.data();
    document.getElementById("inicio-dia").textContent = data.inicio ? `$${parseFloat(data.inicio).toFixed(2)}` : "---";
    document.getElementById("fin-dia").textContent = data.fin ? `$${parseFloat(data.fin).toFixed(2)}` : "---";

    const ganancia = (data.inicio && data.fin)
      ? `$${(parseFloat(data.fin) - parseFloat(data.inicio)).toFixed(2)}`
      : "---";

    document.getElementById("ganancia-dia").textContent = ganancia;
  }

  async function abrirCaja() {
    const estadoRef = doc(db, "caja", "estado");
    const docSnap = await getDoc(estadoRef);

    if (docSnap.exists() && docSnap.data().inicio) {
      return showAlert("La caja ya fue abierta hoy.");
    }

    const monto = prompt("¿Con cuánto dinero inicias?");
    if (monto && !isNaN(parseFloat(monto))) {
      await setDoc(estadoRef, {
        inicio: parseFloat(monto),
        fin: null
      });
      showAlert("Caja abierta correctamente.");
      cargarCaja();
    }
  }

  async function cerrarCaja() {
    const estadoRef = doc(db, "caja", "estado");
    const docSnap = await getDoc(estadoRef);

    if (!docSnap.exists() || !docSnap.data().inicio) {
      return showAlert("Primero debes abrir la caja.");
    }

    if (docSnap.data().fin) {
      return showAlert("La caja ya fue cerrada hoy.");
    }

    const monto = prompt("¿Con cuánto dinero cierras?");
    if (monto && !isNaN(parseFloat(monto))) {
      await updateDoc(estadoRef, {
        fin: parseFloat(monto)
      });
      showAlert("Caja cerrada correctamente.");
      cargarCaja();
    }
  }

  function showAlert(message) {
    const alerta = document.getElementById("alerta");
    alerta.textContent = message;
    alerta.style.display = "block";
    setTimeout(() => (alerta.style.display = "none"), 3000);
  }

  // ⏳ Inicialización
  window.addEventListener("DOMContentLoaded", () => {
    fetchMesas();
    fetchProductos();
    cargarCaja();

    document.getElementById("abrir-caja").addEventListener("click", abrirCaja);
    document.getElementById("cerrar-caja").addEventListener("click", cerrarCaja);
  });