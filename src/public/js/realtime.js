const socket = io();

socket.on("productos", (products) => {
  const list = document.getElementById("productList");
  if (!list) return;

  list.innerHTML = "";

  products.forEach((p) => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-3";

    const card = document.createElement("div");
    card.className = "card";
    card.id = `p-${p._id}`;

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const title = document.createElement("h5");
    title.className = "card-title";
    title.textContent = p.title || "Sin título";
    cardBody.appendChild(title);

    const description = document.createElement("p");
    description.className = "card-text";
    description.innerHTML = `<strong>Descripción:</strong> ${
      p.description || "Sin descripción"
    }`;
    cardBody.appendChild(description);

    const price = document.createElement("p");
    price.className = "card-text";
    price.innerHTML = `<strong>Precio:</strong> $${p.price || 0}`;
    cardBody.appendChild(price);

    const category = document.createElement("p");
    category.className = "card-text";
    category.innerHTML = `<strong>Categoría:</strong> ${
      p.category || "Sin categoría"
    }`;
    cardBody.appendChild(category);

    const stock = document.createElement("p");
    stock.className = "card-text";
    stock.innerHTML = `<strong>Stock:</strong> ${p.stock || 0}`;
    cardBody.appendChild(stock);

    const code = document.createElement("p");
    code.className = "card-text";
    code.innerHTML = `<strong>Código:</strong> ${p.code || "Sin código"}`;
    cardBody.appendChild(code);

    const status = document.createElement("p");
    status.className = "card-text";
    status.innerHTML = `<strong>Status:</strong> ${
      p.status ? "Activo" : "Inactivo"
    }`;
    cardBody.appendChild(status);

    if (
      p.thumbnails &&
      Array.isArray(p.thumbnails) &&
      p.thumbnails.length > 0
    ) {
      const thumbnailsLabel = document.createElement("p");
      thumbnailsLabel.className = "card-text";
      thumbnailsLabel.innerHTML = "<strong>Imágenes:</strong>";
      cardBody.appendChild(thumbnailsLabel);

      const thumbnailsDiv = document.createElement("div");
      thumbnailsDiv.className = "mb-2";

      p.thumbnails.forEach((thumb) => {
        const img = document.createElement("img");
        img.src = thumb;
        img.alt = p.title || "Producto";
        img.className = "img-thumbnail me-1";
        img.style.maxWidth = "100px";
        img.style.maxHeight = "100px";
        thumbnailsDiv.appendChild(img);
      });

      cardBody.appendChild(thumbnailsDiv);
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger btn-sm delete-product-btn";
    deleteBtn.setAttribute("data-product-id", p._id);
    deleteBtn.textContent = "Eliminar";
    cardBody.appendChild(deleteBtn);

    card.appendChild(cardBody);
    col.appendChild(card);
    list.appendChild(col);
  });
});

function eliminarProducto(id) {
  socket.emit("eliminarProducto", id);
}

document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("delete-product-btn")) {
      var productId = e.target.getAttribute("data-product-id");
      if (productId) {
        eliminarProducto(productId);
      }
    }
  });
});

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
