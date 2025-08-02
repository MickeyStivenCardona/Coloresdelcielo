// admin.js - Productos y Mesas usando Firestore
import { db } from './firebase.js';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔔 Alertas
function showAlert(message, elementId = null) {
  const alertDiv = document.getElementById("alerta");
  alertDiv.textContent = message;
  alertDiv.style.display = "block";
  if (elementId) {
    const input = document.getElementById(elementId);
    input.classList.add("input-error");
    setTimeout(() => input.classList.remove("input-error"), 2000);
  }
  setTimeout(() => (alertDiv.style.display = "none"), 3000);
}

// ✅ Confirmación personalizada
function confirmAction(message, callback) {
  const box = document.getElementById("confirm-box");
  const msg = document.getElementById("confirm-message");
  msg.textContent = message;
  box.style.display = "block";

  document.getElementById("confirm-yes").onclick = () => {
    callback(true);
    box.style.display = "none";
  };
  document.getElementById("confirm-no").onclick = () => {
    callback(false);
    box.style.display = "none";
  };
}

///////////////////// PRODUCTOS /////////////////////

// Agregar producto
async function addProduct() {
  const name = document.getElementById("product-name").value.trim();
  const price = parseFloat(document.getElementById("product-price").value);

  if (!name) return showAlert("Nombre del producto requerido.", "product-name");
  if (isNaN(price)) return showAlert("Precio inválido.", "product-price");

  await addDoc(collection(db, "productos"), { name, price });
  showAlert("Producto agregado correctamente.");
  renderProducts();
}

// Renderizar productos
function renderProducts() {
  const list = document.getElementById("product-list");
  list.innerHTML = "";

  getDocs(collection(db, "productos")).then((snapshot) => {
    snapshot.forEach((doc) => {
      const data = doc.data();
      const li = document.createElement("li");
      li.innerHTML = `
        ${data.name} - $${parseFloat(data.price).toFixed(2)}
        <button class="edit-btn">✏️</button>
        <button class="delete-btn">🗑️</button>
      `;

      li.querySelector(".edit-btn").addEventListener("click", () => {
        editProduct(doc.id, data);
      });

      li.querySelector(".delete-btn").addEventListener("click", () => {
        deleteProduct(doc.id);
      });

      list.appendChild(li);
    });
  });
}

// Editar producto
async function editProduct(id) {
  confirmAction("¿Editar este producto?", async (ok) => {
    if (!ok) return;

    const newName = prompt("Nuevo nombre:");
    const newPrice = prompt("Nuevo precio:");

    if (!newName || isNaN(parseFloat(newPrice))) return;

    await updateDoc(doc(db, "productos", id), {
      name: newName.trim(),
      price: parseFloat(newPrice),
    });

    showAlert("Producto editado correctamente.");
    renderProducts();
  });
}

// Eliminar producto
async function deleteProduct(id) {
  confirmAction("¿Eliminar este producto?", async (ok) => {
    if (!ok) return;

    await deleteDoc(doc(db, "productos", id));
    showAlert("Producto eliminado.");
    renderProducts();
  });
}

///////////////////// MESAS /////////////////////

// Agregar mesa
async function addMesa() {
  const nombre = document.getElementById("mesa-nombre").value.trim();
  const mozo = document.getElementById("mesa-mozo").value.trim();

  if (!nombre) return showAlert("Nombre de la mesa requerido.", "mesa-nombre");
  if (!mozo) return showAlert("Nombre del mozo requerido.", "mesa-mozo");

  await addDoc(collection(db, "mesas"), { nombre, mozo });
  showAlert("Mesa agregada correctamente.");
  renderMesas();
}

// Renderizar mesas
function renderMesas() {
  const list = document.getElementById("mesa-list");
  list.innerHTML = "";

  getDocs(collection(db, "mesas")).then((snapshot) => {
    snapshot.forEach((doc) => {
      const data = doc.data();
      const li = document.createElement("li");
      li.innerHTML = `
        ${data.nombre} – Mozo: ${data.mozo}
        <button class="edit-btn">✏️</button>
        <button class="delete-btn">🗑️</button>
      `;

      li.querySelector(".edit-btn").addEventListener("click", () => {
        editMesa(doc.id, data);
      });

      li.querySelector(".delete-btn").addEventListener("click", () => {
        deleteMesa(doc.id);
      });

      list.appendChild(li);
    });
  });
}

// Editar mesa
async function editMesa(id) {
  confirmAction("¿Editar esta mesa?", async (ok) => {
    if (!ok) return;

    const newName = prompt("Nuevo nombre de mesa:");
    const newMozo = prompt("Nuevo nombre del mozo:");

    if (!newName || !newMozo) return;

    await updateDoc(doc(db, "mesas", id), {
      nombre: newName.trim(),
      mozo: newMozo.trim(),
    });

    showAlert("Mesa editada correctamente.");
    renderMesas();
  });
}

// ✅ Eliminar mesa (solo una vez)
async function deleteMesa(id) {
  confirmAction("¿Eliminar esta mesa?", async (ok) => {
    if (!ok) return;

    await deleteDoc(doc(db, "mesas", id));
    showAlert("Mesa eliminada.");
    renderMesas();
  });
}

///////////////////// INICIO /////////////////////

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderMesas();

  document.getElementById("add-product-btn").addEventListener("click", addProduct);
  document.getElementById("add-mesa-btn").addEventListener("click", addMesa);
});
