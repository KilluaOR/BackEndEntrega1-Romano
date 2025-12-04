var socket = io();

var cartId = document.body.getAttribute("data-cart-id");

var buttons = document.querySelectorAll(".add-to-cart-btn");
for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function () {
    var productId = this.getAttribute("data-id");
    socket.emit("addToCart", { cartId: cartId, productId: productId });
  });
}

socket.on("cartUpdated", function (cart) {
  alert(
    "Producto agregado al carrito! Total productos: " + cart.products.length
  );
});

socket.on("error", function (msg) {
  alert(msg);
});
