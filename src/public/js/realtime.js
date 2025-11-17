const socket = io();

socket.on("productos", (products) => {
  const list = document.getElementById("productList");
  if (!list) return;

  list.innerHTML = "";

  products.forEach((p) => {
    const li = document.createElement("li");
    li.id = `p-${p.id}`;
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";

    // Crear el contenido con la misma estructura que Handlebars
    const titleSpan = document.createElement("span");
    const strong = document.createElement("strong");
    strong.textContent = p.title;
    titleSpan.appendChild(strong);

    const priceBadge = document.createElement("span");
    priceBadge.className = "badge bg-primary";
    priceBadge.textContent = `$${p.price}`;

    // Solo agregar botón de eliminar si estamos en la página de realtime
    if (document.getElementById("productForm")) {
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "btn btn-danger btn-sm ms-2";
      deleteBtn.textContent = "Eliminar";
      deleteBtn.onclick = () => eliminarProducto(p.id);
      li.appendChild(titleSpan);
      li.appendChild(priceBadge);
      li.appendChild(deleteBtn);
    } else {
      li.appendChild(titleSpan);
      li.appendChild(priceBadge);
    }

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
