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
    var shipInfoBox = document.querySelector(".informationFields");
    shipInfoBox.addEventListener("input", activeValidationShip);


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
        if ((textInputs[i].backgroundColor == "red" || (textInputs[i].value == "" && textInputs[i].id != "shipAddressLineTwo"))) {
            for (var x = 0; x < labelTargets.length; x++) {
                if (textInputs[i].id == labelTargets[x]) {
                    var id = document.querySelector("#" + labelTargets[x]);
                    alert(listOfLabels[x].innerText + " is invalid");
                    id.style.backgroundColor = "red";
                    passValidation = false;
                }
            }
        }
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
            email: [document.querySelector("#shipEmail").value]
        }
        sessionStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));
        document.querySelector("#shippingInfo").style.display = "none";
        document.querySelector("#paymentInfo").style.display = "block";
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
        if (textInputs[i].backgroundColor == "red" || textInputs[i].value == "") {
            for (var x = 0; x < labelTargets.length; x++) {
                if (textInputs[i].id == labelTargets[x]) {
                    var id = document.querySelector("#" + labelTargets[x]);
                    alert(listOfLabels[x].innerText + " is invalid");
                    id.style.backgroundColor = "red";
                    passValidation = false;
                }
            }
        }
    }
    if (passValidation) {
        window.location.replace("confirmation.html")
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
        document.querySelector("#payAddressLineOne").value = shipInfo.AddrLineOne;
        document.querySelector("#payAddressLineTwo").value = shipInfo.AddrLineTwo;
        document.querySelector("#payCity").value = shipInfo.City;
        document.querySelector("#payZipCode").value = shipInfo.ZipCode;
        document.querySelector("#payState").value = shipInfo.state;
        document.querySelector("#payEmail").value = shipInfo.email;
    } else if (document.querySelector("#sameAddrAsShip").checked == false) {
        for (var i = 0; i < infoBlock.length; i++) {
            infoBlock[i].disabled = false;
        }
    }
}


function activeValidationShip() {
    var emailPattern = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/ // modified from https://regexr.com/2rhq7
    var cardNumberPattern = /^\d{16}$/;
    var cvvPattern = /^\d{3}$/;
    var expDatePattern = /^[0-1][0-9]\/\d{2}$/;
    var phonePattern = /^(?:\d{1}\s)?\(?(\d{3})\)?-?\s?(\d{3})-?\s?(\d{4})$/; // Modified from https://regexr.com/38ohj
    var zipPattern = /^\d{5}$/
        // butt load of if else statements
        {
            if (shipFirstName.value == "") {
                shipFirstName.style.backgroundColor = "red";
            } else {
                shipFirstName.style.backgroundColor = "white";
            }
            if (shipLastName.value == "") {
                shipLastName.style.backgroundColor = "red";
            } else {
                shipLastName.style.backgroundColor = "white";
            }
            if (!phonePattern.test(document.querySelector("#shipPhone").value)) {
                shipPhone.style.backgroundColor = "red";
            } else {
                shipPhone.style.backgroundColor = "white";
            }
            if (shipAddressLineOne.value == "") {
                shipAddressLineOne.style.backgroundColor = "red";
            } else {
                shipAddressLineOne.style.backgroundColor = "white";
            }
            if (shipAddressLineTwo.value == "") {
                shipAddressLineTwo.style.backgroundColor = "white";
            } else {
                shipAddressLineTwo.style.backgroundColor = "white";
            }
            if (shipCity.value == "") {
                shipCity.style.backgroundColor = "red";
            } else {
                shipCity.style.backgroundColor = "white";
            }
            if (!zipPattern.test(document.querySelector("#shipZipCode").value)) {
                shipZipCode.style.backgroundColor = "red";
            } else {
                shipZipCode.style.backgroundColor = "white";
            }
            if (!shipState.value) {
                shipState.style.backgroundColor = "red";
            } else {
                shipState.style.backgroundColor = "white";
            }
            if (!emailPattern.test(document.querySelector("#shipEmail").value)) {
                shipEmail.style.backgroundColor = "red";
            } else {
                shipEmail.style.backgroundColor = "white";
            }

            if (!cardNumberPattern.test(document.querySelector("#cardNumber").value)) {
                cardNumber.style.backgroundColor = "red";
            } else {
                cardNumber.style.backgroundColor = "white";
            }
            if (!expDatePattern.test(document.querySelector("#expiration").value)) {
                expiration.style.backgroundColor = "red";
            } else {
                expiration.style.backgroundColor = "white";
            }
            if (!cvvPattern.test(document.querySelector("#cvv").value)) {
                cvv.style.backgroundColor = "red";
            } else {
                cvv.style.backgroundColor = "white";
            }
            if (cardHolderName.value == "") {
                cardHolderName.style.backgroundColor = "red";
            } else {
                cardHolderName.style.backgroundColor = "white";
            }
            if (!phonePattern.test(document.querySelector("#payPhone").value)) {
                payPhone.style.backgroundColor = "red";
            } else {
                payPhone.style.backgroundColor = "white";
            }
            if (payAddressLineOne.value == "") {
                payAddressLineOne.style.backgroundColor = "red";
            } else {
                payAddressLineOne.style.backgroundColor = "white";
            }
            if (payAddressLineTwo.value == "") {
                payAddressLineTwo.style.backgroundColor = "white";
            } else {
                payAddressLineTwo.style.backgroundColor = "white";
            }
            if (payCity.value == "") {
                payCity.style.backgroundColor = "red";
            } else {
                payCity.style.backgroundColor = "white";
            }
            if (payZipCode.value == "") {
                payZipCode.style.backgroundColor = "red";
            } else {
                payZipCode.style.backgroundColor = "white";
            }
            if (!payState.value) {
                payState.style.backgroundColor = "red";
            } else {
                payState.style.backgroundColor = "white";
            }
            if (!emailPattern.test(document.querySelector("#payEmail").value)) {
                payEmail.style.backgroundColor = "red";
            } else {
                payEmail.style.backgroundColor = "white";
            }
        }






}