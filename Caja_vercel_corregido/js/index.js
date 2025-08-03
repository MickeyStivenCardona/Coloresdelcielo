import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function obtenerProductos() {
  const querySnapshot = await getDocs(collection(db, "productos"));
  const productos = [];
  querySnapshot.forEach((doc) => {
    productos.push({ id: doc.id, ...doc.data() });
  });
  return productos;
}