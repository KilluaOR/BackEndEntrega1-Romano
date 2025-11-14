const socket = io();

socket.on("productos", (products) => {
  const list = document.getElementById("productList");
  if (!list) return;

  list.innerHTML = "";

  products.forEach((p) => {
    const li = document.createElement("li");
    li.id = `p-${p.id}`;
    li.innerHTML = `<strong>${p.title}</strong> - $${p.price} <button onclick="eliminarProducto(${p.id})">Eliminar</button>`;
    list.appendChild(li);
  });
});

function eliminarProducto(id) {
  socket.emit("eliminarProducto", id);
}

document.getElementById("productForm")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const product = {
    title: formData.get("title"),
    description: formData.get("description"),
    code: formData.get("code"),
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock")),
    category: formData.get("category"),
    status: formData.get("status") === "true",
    thumbnails: formData.get("thumbnails")
      ? formData
          .get("thumbnails")
          .split(",")
          .map((t) => t.trim())
      : [],
  };

  socket.emit("nuevoProducto", product);
  e.target.reset();
});
