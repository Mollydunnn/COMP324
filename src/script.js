//Uncomment the line below and refresh page to clear local storage
//localStorage.clear();

/*
*   This function will call immediatly when the page loads.
*/

window.onload = function() {

    //If on the in-cart page, display the items
    if (this.document.title == 'Cart') {
        displayCart();
    }

    if (this.document.title == 'In Stock') {
        //this.inStockPictures();
    }

    if (this.document.title == "Saved") {
        this.displaySavedItems()
    }

    //Sets cart to correct number in nav bar
    let list = JSON.parse(window.localStorage.getItem('cartItems')); 
    this.updateNav(list);
    

}



/*
*   Adds an item to the cart or saved items list, currently saves the brand, name, and price as an object
*/
function addItem(button, location) {
    //Gets the array of items already in the cart from local storage
    let list = JSON.parse(window.localStorage.getItem(location));
    if(list == null) {
        list = [];
    }

    //Gets the item details from the HTML
    let details = button.parentElement.getElementsByClassName("product-description");
    let b = details[0].textContent;
    let n = details[1].textContent;
    let p = details[2].textContent;

    //Gets url for item image
    let i = button.parentElement.parentElement.getElementsByTagName('div')[0].getElementsByTagName("img")[0].src;


    //Gets the size of the item
    let s = button.parentElement.parentElement.getElementsByTagName('div')[1].getElementsByTagName('div')[2].getElementsByTagName('button')[0].innerText;
    if (s.length > 11) {
        s = s.slice(13, 14);
        console.log(s);
    } else {
        s = null;
    }
    

    if (s || location == 'savedItems'){
        //Creates an item object too save in array
        const item = {
            brand: b,
            name: n,
            price: p,
            img: i,
            qty: 1,
            size:s
        }

        //Checks to see if item is already in the cart
        let found = false;
        for (let i = 0; i < list.length; i ++) {
            if (list[i].brand == item.brand && list[i].name == item.name && item.size == list[i].size) {
                found = true;
                list[i].qty += 1;
            }
        }

        //Add item to the array and save it in the local storage
        if (!found) {
            list.push(item);
        }
        console.log(location, list);
        localStorage.setItem(location, JSON.stringify(list));

        //Gets the HTML cart element from the nav bar to update the number 
        updateNav(list);
    }
}


/*
*   Removes item from a cart
*   The item will be completly removed, does not consider qty
*/
function removeItemFromCart(button) {
    //Gets the array of items already in the cart from local storage
    let list = JSON.parse(window.localStorage.getItem('cartItems'));
    if(list == null) {
        list = [];
    }

    //Get details of the item to be removed
    let itemToRemoveBrand = button.parentElement.getElementsByTagName("h2")[0].innerText;
    let itemToRemoveName = button.parentElement.getElementsByTagName("h3")[0].innerText;
    let itemToRemoveSize = button.parentElement.getElementsByTagName("h4")[0].innerText.slice(5,6);
    console.log(itemToRemoveBrand, itemToRemoveName, itemToRemoveSize);

    //Finds the item in the array that needs to be removed
    for (let i = 0; i < list.length; i++) {
        if (list[i].name == itemToRemoveName && list[i].brand == itemToRemoveBrand && list[i].size == itemToRemoveSize) {
            list.splice(i, 1);
            console.log(list);
        }
    }
    localStorage.setItem('cartItems', JSON.stringify(list));

    displayCart();
    updateNav(list);
}


/*
*   Basis for displaying the items in the cart once on the in-cart page
*/
function displayCart() {
    let list = JSON.parse(window.localStorage.getItem('cartItems'));
    let ele = document.getElementById('Content');
    let totalPrice = 0;
    let numItems = 0;
    

    //If cart is empty
    if(list == null) {
        let cart = "<li id = \"Items\"><p>Cart is empty</p></li>";
        ele.innerHTML = cart;

    //If cart is not empty
    } else {
        numItems += 1;
        let cart = "";
        for (let i = 0; i < list.length; i++) {
            totalPrice += parseInt(list[i].price.slice(1)) * list[i].qty;
            cart += `
            <li id= "Items">
                <hr>
                <a href=# onclick = "removeItemFromCart(this)">X</a>
                <img src="${list[i].img}">
                <h2>${list[i].brand}</h2>
                <h3>${list[i].name}</h3>
                <br>
                <h4 id="SameLine">SIZE ${list[i].size}&#x2228</h4>
                <h4 id="SameLine">QTY ${list[i].qty} &#x2228</h4>
                <h5 id="Price">${list[i].price}</h5>
                <hr>
            </li>
            `
        }

        ele.innerHTML = cart + `
        <li id="OrderSummary">
            <h1>Order Summary</h1>
            <h3 id="subSummary">SUBTOTAL</h3>
            <h3 id="subSummary">$ ${totalPrice}</h3>
            <h3 id="subSummary">SHIPPING</h3>
            <h3 id="subSummary">$ 5</h3>
            <h3 id="subSummary">SALES TAX</h3>
            <h3 id="subSummary">$ 3.07</h3>
            <h2 id="Total">TOTAL</h2>
            <h2 id="Total">$ ${totalPrice + 8.07}</h2>
            <a href="#" id="Checkout">CHECKOUT</a> 
            <!--Will eventually link to the checkout page--> 
        </li>
        `           
        }
        updateNav(list);
    }


function displaySavedItems() {
    let list = JSON.parse(window.localStorage.getItem('savedItems'));
    let ele = document.getElementById('saved-items-main');
    console.log(list);
    let items = ""

    //If cart is empty
    if(list == null) {
        items = "<li id = \"Items\"><p>No saved items</p></li>";
        ele.innerHTML = items;

    //If cart is not empty
    } else {
        for (let i = 0; i < list.length; i++) {
            items += `
            <div class = "saved-item" >
                <a href=#>
                    <div>
                        <a href=#>X</a>
                    </div>
                    <div>
                        <img src="${list[i].img}">
                        <h2>${list[i].brand}</h2>
                        <p>${list[i].name}</p>
                        <p>${list[i].price}</p>
                    </div>
                </a>
            </div>
            `
        }
    }
    ele.innerHTML = items;
}


function updateNav(list) {
    //Gets the HTML cart element from the nav bar to update the number 
    let ele = document.getElementById("cart");
    let numItems = 0;
    for (let i = 0; i < list.length; i++) {
        numItems += list[i].qty;
    }
    let newCart = "<a href=Cart.html>Cart (" + (numItems) + ")</a>";
    ele.innerHTML = newCart;
}


function setSize(size, button) {
    console.log(size);
    console.log(button.parentElement.parentElement);
    let container = button.parentElement.parentElement;
    container.innerHTML = `
        <button onclick = "openSizeSelector(this)">Select Size: ${size}</button>
    `
    
}

function openSizeSelector(button) {
    console.log(button.parentElement);
    let container = button.parentElement;
    console.log(container);
    button.parentElement.innerHTML = `
        <button onclick = "openSizeSelector(this)">Select Size</button>
        <ul>
            <li onclick="setSize(\`Small\`, this)">Small</li>
            <li onclick="setSize(\`Medium\`, this)">Medium</li>
            <li onclick="setSize(\`Large\`, this)">Large</li>
        </ul>
    `;
}

