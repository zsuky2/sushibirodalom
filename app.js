const cartContainer = document.querySelector(".cart-container");
const serviceList = document.querySelector(".service-list");


eventListeners();

//All event listeners
function eventListeners() {

    window.addEventListener("DOMContentLoaded", () => {

        loadJSON();
    })

    //toggle navbar when toggle button is clicked
    document.querySelector(".navbar-toggler").addEventListener("click", () => {

        document.querySelector(".navbar-collapse").classList.toggle("show-navbar");
    });

    // Show/hide cart container
    document.getElementById("cart-btn").addEventListener("click", () => {

        cartContainer.classList.toggle("show-cart-container");
    })
}

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
                            <p class="service-price">${service.price}Forint</p>
                        </div>
                    </div>
                `;
            });
            serviceList.innerHTML=html;
        })
}