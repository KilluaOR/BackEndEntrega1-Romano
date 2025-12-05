document.addEventListener("DOMContentLoaded", function () {
  var socket = io();
  var cartDataElement = document.getElementById("cart-data");
  var cartId = cartDataElement 
    ? cartDataElement.getAttribute("data-cart-id")
    : null;
  
  var addToCartBtn = document.getElementById("add-to-cart-btn");
  if (addToCartBtn && cartId) {
    addToCartBtn.addEventListener("click", function () {
      var productId = this.getAttribute("data-product-id");
      
      if (!productId) {
        alert("Error: No se pudo obtener el ID del producto.");
        return;
      }
      
      socket.emit("addToCart", { cartId: cartId, productId: productId });
    });
  }
  
  socket.on("cartUpdated", function (cart) {
    alert(
      "✅ Producto agregado al carrito!\nTotal productos: " +
        (cart.products ? cart.products.length : 0)
    );
  });
  
  socket.on("newCartId", function (newCartId) {
    cartId = newCartId;
    var cartDataElement = document.getElementById("cart-data");
    if (cartDataElement) {
      cartDataElement.setAttribute("data-cart-id", newCartId);
    }
    var cartLink = document.getElementById("cart-link");
    if (cartLink) {
      cartLink.href = "/carts/" + newCartId;
    }
  });
  
  socket.on("error", function (msg) {
    console.error("Error del servidor:", msg);
    alert("❌ Error: " + (typeof msg === "string" ? msg : JSON.stringify(msg)));
  });
  
  socket.on("connect", function () {});
  
  socket.on("disconnect", function () {});
});

