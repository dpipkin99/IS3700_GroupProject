var removeButton = document.querySelectorAll(".buttonRemove");

for (var i = 0; i < removeButton.length; i++) {
    var button = removeButton[i];
    button.addEventListener("click", function(event) {
        var buttonClicked = event.target;
        buttonClicked.parentElement.parentElement.remove();
        updateCartTotal();
    });
}

function updateCartTotal() {
    var cartContainer = document.querySelector('.cartItems');
    var cartRows = cartContainer.querySelectorAll('.cartRow');
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i];
        var priceElement = cartRow.querySelectorAll('.cartPrice')[0];
        var quantityElement = cartRow.querySelectorAll('.quantityInput');
        console.log(priceElement, quantityElement);
        var price = parseFloat(priceElement.innerText.replace('$', ''));
        console.log(price)
        var cartTotal = document.querySelector('.totalPrice');
        total = parseFloat(cartTotal.innerText.replace('$', ''));
        total -= price;
        console.log(total);
        // need to finish by updating the total price and multiplying the price by the quantity in the cart row...

    }


}