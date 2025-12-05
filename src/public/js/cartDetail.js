var socket = io();

var cartContainer = document.getElementById("cartContainer");
var cartId = cartContainer.getAttribute("data-cart-id");

socket.on("cartUpdated:" + cartId, function (cart) {
  actualizarVistaCarrito(cart);
});

socket.on("cartUpdated", function (cart) {
  if (String(cart._id) === String(cartId)) {
    actualizarVistaCarrito(cart);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("delete-product-btn")) {
      var productId = e.target.getAttribute("data-product-id");
      if (productId && confirm("¿Estás seguro de que quieres eliminar este producto del carrito?")) {
        eliminarProductoDelCarrito(productId);
      }
    }

    if (e.target && e.target.classList.contains("update-quantity-btn")) {
      var productId = e.target.getAttribute("data-product-id");
      var quantityInput = document.getElementById("quantity-" + productId);
      if (productId && quantityInput) {
        var quantity = parseInt(quantityInput.value);
        if (quantity > 0) {
          actualizarCantidadProducto(productId, quantity);
        } else {
          alert("La cantidad debe ser mayor a 0");
        }
      }
    }

    if (e.target && e.target.id === "clear-cart-btn") {
      if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
        vaciarCarrito();
      }
    }
  });
});

function eliminarProductoDelCarrito(productId) {
  fetch(`/api/carts/${cartId}/products/${productId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert("Error: " + data.error);
      } else {
        location.reload();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error al eliminar el producto");
    });
}

function actualizarCantidadProducto(productId, quantity) {
  fetch(`/api/carts/${cartId}/products/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quantity: quantity }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert("Error: " + data.error);
      } else {
        location.reload();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error al actualizar la cantidad");
    });
}

function vaciarCarrito() {
  fetch(`/api/carts/${cartId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert("Error: " + data.error);
      } else {
        location.reload();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error al vaciar el carrito");
    });
}

function actualizarVistaCarrito(cart) {
  if (String(cart._id) !== String(cartId)) {
    return;
  }

  var cartProducts = cart.products || [];
  var ul = document.getElementById("cartProducts");
  var hr = cartContainer.querySelector("hr");
  var totalEl = cartContainer.querySelector("h4");

  cartContainer.innerHTML = "";

  if (cartProducts.length === 0) {
    var emptyMsg = document.createElement("p");
    emptyMsg.textContent = "El carrito está vacío.";
    cartContainer.appendChild(emptyMsg);
  } else {
    ul = document.createElement("ul");
    ul.className = "list-group";
    ul.id = "cartProducts";

    var total = 0;

    for (var i = 0; i < cartProducts.length; i++) {
      var p = cartProducts[i];

      if (!p.product) continue;

      var li = document.createElement("li");
      li.className =
        "list-group-item d-flex justify-content-between align-items-center";
      li.setAttribute("data-product-id", p.product._id);
      
      var productDiv = document.createElement("div");
      productDiv.className = "flex-grow-1";
      
      var title = document.createElement("strong");
      title.textContent = p.product.title || "Producto sin título";
      productDiv.appendChild(title);
      productDiv.appendChild(document.createElement("br"));
      
      var priceText = document.createElement("small");
      priceText.textContent = "Precio unitario: $" + (p.product.price || 0);
      productDiv.appendChild(priceText);
      productDiv.appendChild(document.createElement("br"));
      
      var quantityDiv = document.createElement("div");
      quantityDiv.className = "mt-2 d-flex align-items-center gap-2";
      
      var quantityLabel = document.createElement("label");
      quantityLabel.className = "form-label mb-0";
      quantityLabel.setAttribute("for", "quantity-" + p.product._id);
      quantityLabel.textContent = "Cantidad:";
      quantityDiv.appendChild(quantityLabel);
      
      var quantityInput = document.createElement("input");
      quantityInput.type = "number";
      quantityInput.className = "form-control form-control-sm quantity-input";
      quantityInput.id = "quantity-" + p.product._id;
      quantityInput.value = p.quantity || 0;
      quantityInput.min = "1";
      quantityInput.style.width = "80px";
      quantityInput.setAttribute("data-product-id", p.product._id);
      quantityDiv.appendChild(quantityInput);
      
      var updateBtn = document.createElement("button");
      updateBtn.className = "btn btn-sm btn-primary update-quantity-btn";
      updateBtn.setAttribute("data-product-id", p.product._id);
      updateBtn.textContent = "Actualizar";
      quantityDiv.appendChild(updateBtn);
      
      productDiv.appendChild(quantityDiv);
      
      var totalText = document.createElement("small");
      totalText.className = "d-block mt-1";
      totalText.textContent = "Total: $" + ((p.product.price || 0) * (p.quantity || 0));
      productDiv.appendChild(totalText);
      
      li.appendChild(productDiv);
      
      var deleteDiv = document.createElement("div");
      deleteDiv.className = "ms-3";
      
      var deleteBtn = document.createElement("button");
      deleteBtn.className = "btn btn-sm btn-danger delete-product-btn";
      deleteBtn.setAttribute("data-product-id", p.product._id);
      deleteBtn.textContent = "Eliminar";
      deleteDiv.appendChild(deleteBtn);
      
      li.appendChild(deleteDiv);
      ul.appendChild(li);

      total += (p.product.price || 0) * (p.quantity || 0);
    }

    cartContainer.appendChild(ul);

    hr = document.createElement("hr");
    hr.className = "my-4";
    cartContainer.appendChild(hr);

    var totalDiv = document.createElement("div");
    totalDiv.className = "d-flex justify-content-between align-items-center";
    
    totalEl = document.createElement("h4");
    totalEl.innerHTML =
      "Total del carrito: $<span id='cartTotalAmount'>" + total + "</span>";
    totalDiv.appendChild(totalEl);
    
    var clearBtn = document.createElement("button");
    clearBtn.className = "btn btn-danger";
    clearBtn.id = "clear-cart-btn";
    clearBtn.setAttribute("data-cart-id", cartId);
    clearBtn.textContent = "Vaciar Carrito";
    totalDiv.appendChild(clearBtn);
    
    cartContainer.appendChild(totalDiv);
  }
}
