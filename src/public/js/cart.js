// /public/js/cart.js
var socket = io();

// CartId se obtiene de un atributo en el body
var cartId = document.body.getAttribute("data-cart-id");

// Escuchar clics en botones "Agregar al carrito"
var buttons = document.querySelectorAll(".add-to-cart-btn");
for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function () {
    var productId = this.getAttribute("data-id");
    socket.emit("addToCart", { cartId: cartId, productId: productId });
  });
}

// Recibir carrito actualizado
socket.on("cartUpdated", function (cart) {
  alert(
    "Producto agregado al carrito! Total productos: " + cart.products.length
  );
});

// Recibir errores
socket.on("error", function (msg) {
  alert(msg);
});
