var socket = io();

// Tomamos el cartId del data attribute
var cartContainer = document.getElementById("cartContainer");
var cartId = cartContainer.getAttribute("data-cart-id");

// Escuchamos cuando se actualiza el carrito
socket.on("cartUpdated", function (cart) {
  if (cart._id !== cartId) return; // solo actualizar si es este carrito

  var cartProducts = cart.products;
  var ul = document.getElementById("cartProducts");

  if (!ul) {
    ul = document.createElement("ul");
    ul.className = "list-group";
    ul.id = "cartProducts";
    cartContainer.innerHTML = "";
    cartContainer.appendChild(ul);
  } else {
    ul.innerHTML = "";
  }

  var total = 0;

  for (var i = 0; i < cartProducts.length; i++) {
    var p = cartProducts[i];
    var li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML =
      "<div><strong>" +
      p.product.title +
      "</strong><br>" +
      "<small>Precio unitario: $" +
      p.product.price +
      "</small><br>" +
      "<small>Cantidad: " +
      p.quantity +
      "</small><br>" +
      "<small>Total: $" +
      p.product.price * p.quantity +
      "</small></div>";
    ul.appendChild(li);

    total += p.product.price * p.quantity;
  }

  // Actualizar total
  var totalEl = cartContainer.querySelector("h4");
  if (!totalEl) {
    totalEl = document.createElement("h4");
    cartContainer.appendChild(totalEl);
  }
  totalEl.innerText = "Total del carrito: $" + total;
});
