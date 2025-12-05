document.addEventListener("DOMContentLoaded", function () {
  var cartDataElement = document.getElementById("cart-data");
  var cartId = cartDataElement
    ? cartDataElement.getAttribute("data-cart-id")
    : null;

  if (cartId) {
    var cartLink = document.getElementById("cart-link");
    if (cartLink) {
      cartLink.href = "/carts/" + cartId;
    }
  }
});
