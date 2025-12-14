class Order{
    constructor(image, name, price, quantity){
        this.image = image;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }
}

const buttons = {
    hide: document.querySelector("#hide_button"),
    show: document.querySelector("#show_button"),

    order: document.querySelector("#order_button"),
    rem: document.querySelector("#rem"),
    add: document.querySelector("#add")
}

const size_buttons = {
    short: document.querySelector("#short"),
    tall: document.querySelector("#tall"),
    grande: document.querySelector("#grande"),
    venti: document.querySelector("#venti"),
    array: [short, tall, grande, venti]
}

const milk_buttons = {
    oat: document.querySelector("#oat"),
    soy: document.querySelector("#soy"),
    almond: document.querySelector("#almond"),
    array: [oat, soy, almond]
}

const extra_buttons = {
    sugar: document.querySelector("#sugar"),
    milk: document.querySelector("#milk"),
    array: [milk, sugar]
}

let is_extra_chosen = {
    sugar: false,
    milk: false,
}

const elements = {
    screen_shade: document.querySelector(".screen_shade"),
    slide_panel: document.querySelector(".slide_panel"),

    coffee_img: document.querySelector("#coffee_image"),
    coffee_name: document.querySelector("#coffee_box").querySelector("h1"),
    coffee_desc: document.querySelector("#coffee_box").querySelector("p"),
    coffee_price: document.querySelector("#price_and_switch").querySelector("h2"),
    coffee_quantity: document.querySelector("#switch").querySelector("p"),

    orders: document.querySelector("#order_list"),
    order_count: document.querySelector("#order_panel").querySelector("h5"),

    price_all: document.querySelector("#price_all")
}

let cost = {
    def: 0,
    size: 0,
    milk: 0,
    extra: 0,
}

const sumCost = () => {
    return cost.def + cost.size + cost.milk + cost.extra;
}

let orders = [];
let quantity = 1;
const cData = JSON.parse(localStorage.getItem("selectedCoffee"));

function clamp(value, min, max){
    return Math.min(Math.max(min, value), max);
}

const UpdateCost = () => {
    elements.coffee_price.textContent = `$${(sumCost() * quantity).toFixed(2)}`;
}

const updateQuantity = (change) => {
    quantity = clamp(quantity + change, 1, 99);
    elements.coffee_quantity.textContent = quantity;

    UpdateCost();
}

function PlaceOrder(){
    order = new Order(cData["orderImage"], cData["name"], sumCost() * quantity, quantity);

    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));
}

function ParseOrders(){
    if(!localStorage.getItem("orders")) return [];
    jsonOrd = JSON.parse(localStorage.getItem("orders"));

    jsonOrd.forEach(ord => {
        orders.push(new Order(ord["image"], ord["name"], ord["price"], ord["quantity"]));
    })
}

function UpdateOrdersVisual(){
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

const InitializeButtons = () => {
    buttons.show.addEventListener("click", () => {
        elements.screen_shade.classList.remove("off");
        elements.slide_panel.classList.toggle("on");
    })

    buttons.hide.addEventListener("click", () => {
        elements.screen_shade.classList.toggle("off");
        elements.slide_panel.classList.remove("on");
    })

    buttons.order.addEventListener("click", () => {
        PlaceOrder();
        UpdateOrdersVisual();
        window.location.href = "index.html";
    })

    buttons.add.addEventListener("click", () => {
        updateQuantity(1);
    })

    buttons.rem.addEventListener("click", () => {
        updateQuantity(-1);
    })

    size_buttons.array.forEach(but => {
        but.addEventListener("click", () => PickSize(but, size_buttons.array));
    })

    milk_buttons.array.forEach(but => {
        but.addEventListener("click", () => PickMilk(but, milk_buttons.array));
    })

    extra_buttons.array.forEach(but => {
        but.addEventListener("click", () => ToggleExtra(but));
    })
}

const ButtonSwitch = (button, buttons) => {
    buttons.forEach(but => {
        but.classList.remove("picked");
    });

    button.classList.toggle("picked");
}

const PickSize = (sizeButton) => {
    ButtonSwitch(sizeButton, size_buttons.array);

    if(sizeButton == size_buttons.short) cost.size = 0;
    if(sizeButton == size_buttons.tall) cost.size = 0.5;
    if(sizeButton == size_buttons.grande) cost.size = 1;
    if(sizeButton == size_buttons.venti) cost.size = 1.5;

    UpdateCost();
}

const PickMilk = (milkButton) => {
    ButtonSwitch(milkButton, milk_buttons.array);

    if(milkButton == milk_buttons.oat) cost.milk = 0;
    if(milkButton == milk_buttons.soy) cost.milk = 0.3;
    if(milkButton == milk_buttons.almond) cost.milk = 0.5;

    UpdateCost();
}

const ToggleExtra = (extraButton) => {
    extraButton.classList.toggle("picked");
    switch(extraButton){
        case extra_buttons.sugar:
            if(!is_extra_chosen.sugar) cost.extra += 0.1;
            else cost.extra -= 0.1;
            is_extra_chosen.sugar = !is_extra_chosen.sugar;
            break;
        case extra_buttons.milk:
            if(!is_extra_chosen.milk) cost.extra += 0.2;
            else cost.extra -= 0.2;
            is_extra_chosen.milk = !is_extra_chosen.milk;
            break;
    }
    UpdateCost();
}

const LoadCurrentCoffee = () => {
    elements.coffee_img.src = cData["topdownImage"];
    elements.coffee_name.textContent = cData["name"];
    elements.coffee_desc.textContent = cData["desc"];
    cost.def = parseFloat(cData["price"]);

    UpdateCost();
}

const DocumentInitialization = () => {
    elements.screen_shade.classList.toggle("off");

    PickSize(size_buttons.short);
    PickMilk(milk_buttons.oat);

    updateQuantity(0);
    
    ParseOrders();
    UpdateOrdersVisual();

    LoadCurrentCoffee();
    InitializeButtons();
}

DocumentInitialization();