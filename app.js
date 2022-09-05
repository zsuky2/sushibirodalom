//variables and contains
const cartContainer = document.querySelector(".cart-container");
const serviceList = document.querySelector(".service-list");
const cartList = document.querySelector(".cart-list");
const cartTotalValue = document.getElementById("cart-total-value");
const cartCountInfo = document.getElementById("cart-count-info");

let cartItemID = 1;

eventListeners();

//All event listeners
function eventListeners() {

    window.addEventListener("DOMContentLoaded", () => {

        loadJSON();
        loadCart();
    });

    //toggle navbar when toggle button is clicked
    document.querySelector(".navbar-toggler").addEventListener("click", () => {

        document.querySelector(".navbar-collapse").classList.toggle("show-navbar");
    });

    // Show/hide cart container
    document.getElementById("cart-btn").addEventListener("click", () => {

        cartContainer.classList.toggle("show-cart-container");
    });

    //add to cart
    serviceList.addEventListener('click', purchaseService);

    //remove from cart
    cartList.addEventListener("click", deleteService);

    document.getElementById("checkbox").addEventListener("change",function(){

        document.body.classList.toggle("dark-mode");
    })
}

//update cart info
function updateCartInfo() {

    let cartInfo = findCartInfo();
    cartCountInfo.textContent = cartInfo.serviceCount;
    cartTotalValue.textContent = cartInfo.total;
}

updateCartInfo();

//load service items content form JSON file
function loadJSON() {

    fetch("services.json")
        .then(response => response.json())
        .then(data => {

            let html = "";

            data.forEach(service => {

                html += `
                <div class="service-item">
                    <div class="service-img">
                        <img src="${service.imgSrc}" alt="service image">
                        <button type="button" class="add-to-cart-btn"><i
                        class="fas fa-shopping-cart"></i>Kosárba</button>
                    </div>
                    <div class="service-content">
                        <h3 class="service-name">${service.name}</h3>
                        <span class="service-category">${service.category}</span>
                        <p class="service-price">${service.price} Forint</p>
                    </div>
                </div>
            `;
            });
            serviceList.innerHTML = html;
        })
        .catch(error => {
            alert(`User live server or local server`);
        });
}

//purchase service from the product list
function purchaseService(e) {
    if (e.target.classList.contains("add-to-cart-btn")) {
        let service = e.target.parentElement.parentElement;
        getServiceInfo(service);
    }
}

//get service info after add to cart button is clicked
function getServiceInfo(service) {


    let serviceInfo = {

        id: cartItemID,
        imgSrc: service.querySelector(".service-img img").src,
        name: service.querySelector(".service-name").textContent,
        category: service.querySelector(".service-category").textContent,
        price: service.querySelector(".service-price").textContent
    }
    cartItemID++;
    addToCartList(serviceInfo);
    saveServiceInStorage(serviceInfo);
}

//add the selected service to the cart list
function addToCartList(service) {

    const cartItem = document.createElement("div");
    
    cartItem.classList.add("cart-item");
    cartItem.setAttribute("data-id", `${service.id}`);
    cartItem.innerHTML = `
        <img src="${service.imgSrc}" alt="service image">
        <div class="cart-item-info">
            <h3 class="cart-item-name">${service.name}</h3>
            <span class="cart-item-category">${service.category}</span>
            <span class="cart-item-price">${service.price}</span>
        </div>
        <button type="button" class="cart-item-del-btn">
            <i class="fas fa-times"></i>
        </button>
    `;
    cartList.appendChild(cartItem);
}

//save the product in the local storage
function saveServiceInStorage(item) {

    let services = getServiceFromStorage();
    services.push(item);
    localStorage.setItem("services", JSON.stringify(services));
    updateCartInfo();
}

//get all the services info is there is any in the local storage

function getServiceFromStorage() {

    return localStorage.getItem("services") ? JSON.parse(localStorage.getItem("services")) : [];
    //returns empty array if there isn't any product info
}

//load carts product
function loadCart() {

    let services = getServiceFromStorage();
    if (services.length < 1) {
        cartItemID = 1; //if there is no any product in the local storage
    } else {
        cartItemID = services[services.length - 1].id;
        cartItemID++; //else get the id of the last product and increase it by 1
    }
    services.forEach(service => addToCartList(service));

    //calculate and update UI of cart info
    updateCartInfo();
}

//calculate titak price of the cart and other info
function findCartInfo() {

    let services = getServiceFromStorage();
    let forintHU = Intl.NumberFormat('hu-HU');
    let total = services.reduce((acc, service) => {
        let price = parseFloat(service.price);
        return acc += price;
    }, 0);

    return {
        total: forintHU.format(total)+" Forint",
        serviceCount: services.length
    }
}

//delete product from cart list and locale storage
function deleteService(e){

    let cartItem;

    if(e.target.tagName==="BUTTON"){
        
        cartItem=e.target.parentElement;
        cartItem.remove();
    }else if(e.target.tagName==="I"){

        cartItem= e.target.parentElement.parentElement;
        cartItem.remove();
    }

    
    let services = getServiceFromStorage();
    let updatedServices = services.filter(services=>{

        return services.id!==parseInt(cartItem.dataset.id);
    });
    
    localStorage.setItem("services", JSON.stringify (updatedServices));

    updateCartInfo();
}