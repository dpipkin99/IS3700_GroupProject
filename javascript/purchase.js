if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}
// detects if the page is ready to go
function ready(event) {
    document.querySelector("#sameAddrAsShip").checked = false;
    savedCart = JSON.parse(sessionStorage.getItem("cartContents"))
    for (i = 0; i < savedCart.title.length; i++) {
        restoreSavedCart(savedCart.title[i], savedCart.price[i], savedCart.quantity[i])
    }
    var removeButton = document.querySelectorAll(".buttonRemove");
    for (var i = 0; i < removeButton.length; i++) {
        var button = removeButton[i];
        button.addEventListener("click", removeCartButton);
    }
    var shipmentButton = document.querySelector("#confirmshipment");
    shipmentButton.addEventListener('click', validateShipInfo);
    var paymentButton = document.querySelector("#confirmPayment");
    paymentButton.addEventListener('click', validatePayInfo);
    var shipInfoSameBox = document.querySelector("#sameAddrAsShip");
    shipInfoSameBox.addEventListener("change", insertSameShipBillInfo)
}



function removeCartButton(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
    updateCart();
}


function updateCartTotal() {
    var cartContainer = document.querySelector('.cartItems');
    var cartRows = cartContainer.querySelectorAll('.cartRow');
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i];
        var priceElement = cartRow.querySelectorAll('.cartPrice')[0];
        var quantityElement = cartRow.querySelectorAll('.quantityInput')[0];
        var price = parseFloat(priceElement.innerText.replace('$', ''));
        var quantity = quantityElement.value;
        total += (price * quantity);

    }
    document.querySelector('.totalPrice').innerText = '$' + Math.round(total * 100) / 100;
}

function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateCartTotal();
    updateCart();
}

function updateCart() {

    var cartContents = { title: [], price: [], quantity: [] };
    var cartListRow = document.querySelectorAll('.inCart').length;
    console.log(cartListRow);
    var total = document.querySelector('.totalPrice').innerText;
    for (var i = 0; i < cartListRow; i++) {

        cartContents.title[i] = (document.querySelectorAll(".inCart")[i].innerText);
        cartContents.price.push(document.querySelectorAll(".cartPrice")[i].innerText);
        cartContents.quantity.push(document.querySelectorAll(".quantityInput")[i].value);

    }
    sessionStorage.setItem("cartContents", JSON.stringify(cartContents))
    sessionStorage.setItem("total", total);

}

function restoreSavedCart(title, price, quantity) {

    var cartRow = document.createElement('div');
    cartRow.classList.add('cartRow')
    var cartItems = document.querySelectorAll('.cartItems')[0];
    var cartItemNames = document.querySelectorAll('.cartItemTitle');
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('this item has already been added to the cart');
            return;
        }
    }
    var cartRowContents = `
    <div class="inCart cartItem cartColumn">
        <span class="cartItemTitle">${title}</span>
    </div>
    <span class="cartPrice cartColumn">${price}</span>
    <div class="cartQuantity cartColumn">
        <input class="quantityInput" type="number" value="${quantity}"></div>
    <div class="cartColumn">    <button class="buttonDefault buttonRemove" type="button">REMOVE</button>
    </div>
    `;
    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);
    updateCartTotal();
    updateCart();
    cartRow.querySelectorAll('.buttonRemove')[0].addEventListener('click', removeCartButton);
    cartRow.querySelectorAll('.quantityInput')[0].addEventListener('change', quantityChanged);
}

function validateShipInfo() {
    var passValidation = true;
    var listOfLabels = document.querySelectorAll("label");
    var labelTargets = [];
    var inputs = [];
    var textInputs = document.querySelectorAll(".shipInput");
    for (var i = 0; i < listOfLabels.length; i++) {
        labelTargets.push(listOfLabels[i].htmlFor);
    }

    for (var i = 0; i < textInputs.length; i++) {
        if (textInputs[i].value == "" || textInputs[i].value == null) {
            for (var x = 0; x < labelTargets.length; x++) {
                if (textInputs[i].id == labelTargets[x] && textInputs[i].id != "shipAddressLineTwo") {
                    var id = document.querySelector("#" + labelTargets[x]);
                    alert(listOfLabels[x].innerText + " cannot be empty.");
                    id.style.backgroundColor = "red";
                    passValidation = false;
                }
            }
        }

    }
    if (document.querySelector("#shipState").value == "blank") {
        alert("State cannot be left blank.");
        document.querySelector("#shipState").style.backgroundColor = "red";
        passValidation = false;
    }

    if (document.querySelector("#shipPhone").value == "" || isNaN(document.querySelector("#shipPhone").value) || document.querySelector("#shipPhone").value.length != 10) {
        alert("Phone number is Invalid");
        document.querySelector("#shipPhone").style.backgroundColor = "red";
        passValidation = false;
    }
    if (document.querySelector("#shipZipCode").value == "" || isNaN(document.querySelector("#shipZipCode").value) || document.querySelector("#shipZipCode").value.length != 5) {
        alert("ZipCode is Invalid");
        document.querySelector("#shipZipCode").style.backgroundColor = "red";
        passValidation = false;
    }
    if (passValidation) {
        var shippingInfo = {
            Address: [document.querySelector("#shipFirstName").value],
            LastName: [document.querySelector("#shipLastName").value],
            Phone: [document.querySelector("#shipPhone").value],
            AddrLineOne: [document.querySelector("#shipAddressLineOne").value],
            AddrLineTwo: [document.querySelector("#shipAddressLineTwo").value],
            City: [document.querySelector("#shipCity").value],
            ZipCode: [document.querySelector("#shipZipCode").value],
            state: [document.querySelector("#shipState").value],
            email: [document.querySelector("#shipEmail".value)]
        }
        sessionStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));
        document.querySelector("#shippingInfo").style.display = "none";
        document.querySelector("#paymentInfo").style.display = "block";
    }
}

function insertSameShipBillInfo() {
    var infoBlock = document.querySelectorAll(".payInput");
    if (document.querySelector("#sameAddrAsShip").checked == true) {
        for (var i = 0; i < infoBlock.length; i++) {
            infoBlock[i].disabled = true;
        }
        shipInfo = JSON.parse(sessionStorage.getItem("shippingInfo"));
        document.querySelector("#payPhone").value = shipInfo.Phone;
        document.querySelector("#PayAddressLineOne").value = shipInfo.AddrLineOne;
        document.querySelector("#PayAddressLineTwo").value = shipInfo.AddrLineTwo;
        document.querySelector("#PayCity").value = shipInfo.City;
        document.querySelector("#payZipCode").value = shipInfo.ZipCode;
        document.querySelector("#payState").value = shipInfo.state;
        document.querySelector("payEmail").value = shipInfo.email;
    } else if (document.querySelector("#sameAddrAsShip").checked == false) {
        for (var i = 0; i < infoBlock.length; i++) {
            infoBlock[i].disabled = false;
        }
    }
}

function validatePayInfo() {
    var passValidation = true;
    var listOfLabels = document.querySelectorAll("label");
    var labelTargets = [];
    var inputs = [];
    var textInputs = document.querySelectorAll(".payInput");
    for (var i = 0; i < listOfLabels.length; i++) {
        labelTargets.push(listOfLabels[i].htmlFor);
    }

    for (var i = 0; i < textInputs.length; i++) {
        if (textInputs[i].value == "" || textInputs[i].value == null) {
            for (var x = 0; x < labelTargets.length; x++) {
                if (textInputs[i].id == labelTargets[x]) {
                    var id = document.querySelector("#" + labelTargets[x]);
                    alert(listOfLabels[x].innerText + " cannot be empty.");
                    id.style.backgroundColor = "red";
                    passValidation = false;
                }
            }
        }

    }
    if (document.querySelector("#expiration").value == "") {
        alert("Expiration cannot be blank");
        id.style.backgroundColor = "red";
        passValidation = false;
    }
    if (document.querySelector("#cardNumber").value == "" || isNaN(document.querySelector("#cardNumber").value) || document.querySelector("#cardNumber").value.length != 16) {
        alert("CVV is Invalid");
        id.style.backgroundColor = "red";
        passValidation = false;
    }
    if (document.querySelector("#cvv").value == "" || isNaN(document.querySelector("#cvv").value) || document.querySelector("#cvv").value.length != 3) {
        alert("CVV is Invalid");
        id.style.backgroundColor = "red";
        passValidation = false;
    }
    if (document.querySelector("#payState").value == "blank") {
        alert("State cannot be left blank.");
        id.style.backgroundColor = "red";
        passValidation = false;
    }
    if (document.querySelector("#payZipCode").value == "" || isNaN(document.querySelector("#payZipCode").value) || document.querySelector("#payZipCode").value.length != 5) {
        alert("ZipCode is Invalid");
        document.querySelector("#payZipCode").style.backgroundColor = "red";
        passValidation = false;
    }
    if (document.querySelector("#payPhone").value == "" || isNaN(document.querySelector("#payPhone").value) || document.querySelector("#payPhone").value.length != 10) {
        alert("Phone number is Invalid");
        id.style.backgroundColor = "red";
        passValidation = false;
    }

    if (passValidation) {
        window.location.replace("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    }

}