class CoffeeData{
    constructor(name, indexImage, topdownImage, orderImage, price, desc){
        this.indexImage = indexImage;
        this.topdownImage = topdownImage;
        this.orderImage = orderImage;
        this.name = name;
        this.price = price;
        this.desc = desc;
    }
}

//localStorage.setItem("orders", "");
let currentFilterButton = NaN;

const buttons = {
    hide: document.querySelector("#hide_button"),
    show: document.querySelector("#show_button"),
}

const cat_buttons = {
    cap: document.querySelector("#cap"),
    ame: document.querySelector("#ame"),
    lat: document.querySelector("#lat"),
    array: [lat, ame, cap]
}

const elements = {
    screen_shade: document.querySelector(".screen_shade"),
    slide_panel: document.querySelector(".slide_panel"),

    coffee_container: document.querySelector("#coffee_box"),

    orders: document.querySelector("#order_list"),
    order_count: document.querySelector("#order_panel").querySelector("h5"),

    price_all: document.querySelector("#price_all"),

    coffee_search: document.querySelector("#coffee_search"),
    search_div: document.querySelector(".search_div")
}

const coffeeList = [
    new CoffeeData("Cappuccino", "images/Cappuccino/index.jpg", "images/Cappuccino/topdown.png", "images/Cappuccino/order.png", 2.49, "A perfect harmony of bold espresso, steamed milk, and a luxurious layer of velvety foam. Each sip balances rich coffee flavor with creamy sweetness, creating a comforting and classic Italian experience in every cup."),
    new CoffeeData("Americano", "images/Americano/index.png", "images/Americano/topdown.png", "images/Americano/order.png", 1.99, "Strong, smooth, and elegantly simple. Hot water poured over a shot of espresso creates a clean, robust flavor with a rich aroma. A pure coffee experience for those who appreciate depth without distraction."),
    new CoffeeData("Latte", "images/Latte/index.jpg", "images/Latte/topdown.png", "images/Latte/order.png", 1.29, "Silky-smooth espresso blended with steamed milk, topped with a light layer of microfoam. Creamy, mild, and endlessly customizable, it's the perfect canvas for latte art and a comforting daily ritual.")
]

const CreateCoffeeDOM = (cData) => {
    const cDiv = document.createElement("div");
    cDiv.innerHTML = `<div class="inner_coffee_box">
                            <img src="${cData.indexImage}">
                            <div class="column_between">
                                <h2>${cData.name}</h2>
                                <div class="price_tag">
                                    <p>$${cData.price}</p>
                                    <button>+</button>
                                </div>
                            </div>
                        </div>`;
    cDiv.classList.add("coffee_box_instance");

    const transitionButton = cDiv.querySelector("button");
    transitionButton.addEventListener("click", () => {
        localStorage.setItem("selectedCoffee", JSON.stringify(cData));
        window.location.href = "coffee_card.html";
    })

    return cDiv;
}

const ButtonSwitch = (button, buttons) => {
    buttons.forEach(but => {
        but.classList.remove("picked");
    });

    if(button == -1) return;
    button.classList.toggle("picked");
}

const FillCoffeeBox = (lst, len = 1) => {
    elements.coffee_container.innerHTML = "";
    for(i = 0; i < lst.length * len; i++){
        elements.coffee_container.appendChild(CreateCoffeeDOM(lst[i % lst.length]));
    }
}

function UpdateOrdersVisual(orders){
    elements.orders.innerHTML = ``;
    let price = 0;

    orders.forEach(ord => {
        const ordDiv = document.createElement("div");
        ordDiv.classList.add("order_instance");

        ordDiv.innerHTML = `<img src=${ord.image}>
                        <h4>${ord.name}</h4>
                        <p>${ord.quantity}</p>`;

        elements.orders.appendChild(ordDiv);

        price += ord.price;
    })

    elements.price_all.textContent = `$${price.toFixed(2)}`;
    elements.order_count.textContent = orders.length;
}

function GetFilteredCoffeeList(name){
    newLst = [];

    coffeeList.forEach(cof => {
        if(cof.name == name) newLst.push(cof);
    });

    return newLst;
}

function SetupCategoryButton(but, coffeeType){
    but.addEventListener("click", () => {
        if (currentFilterButton != but) {
            FillCoffeeBox(GetFilteredCoffeeList(coffeeType));
            currentFilterButton = but;
            ButtonSwitch(but, cat_buttons.array);
        }
        else{
            FillCoffeeBox(coffeeList, 4);
            currentFilterButton = NaN;
            ButtonSwitch(-1, cat_buttons.array);
        }
    })
}

function HandleCoffeeSearch(req){
    if(req.length == 0){
        FillCoffeeBox(coffeeList, 4) 
        return;
    }

    const coffeeRegex = "^[a-zA-Z]{3,}";

    const match = (req.trim()).match(coffeeRegex);

    if(match){
        FillCoffeeBox(GetFilteredCoffeeList(match));
        elements.search_div.classList.remove("red");
    }
    else elements.search_div.classList.add("red");
}

const InitializeButtons = () => {
    buttons.show.addEventListener("click", () => {
        elements.screen_shade.classList.remove("off");
        elements.slide_panel.classList.toggle("on");
    })

    buttons.hide.addEventListener("click", () => {
        elements.screen_shade.classList.toggle("off");
        elements.slide_panel.classList.remove("on");
    })

    SetupCategoryButton(cat_buttons.ame, "Americano");
    SetupCategoryButton(cat_buttons.lat, "Latte");
    SetupCategoryButton(cat_buttons.cap, "Cappuccino");
}

const DocumentInitialization = () => {
    elements.screen_shade.classList.toggle("off");

    InitializeButtons();
    FillCoffeeBox(coffeeList, 4);

    orders = JSON.parse(localStorage.getItem("orders"));
    if(orders){
        UpdateOrdersVisual(orders);
    }

    elements.coffee_search.addEventListener("keydown", (ev) => {
        if(ev.key == "Enter") HandleCoffeeSearch(elements.coffee_search.value);
    })
}

DocumentInitialization();