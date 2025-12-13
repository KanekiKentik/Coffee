const buttons = {
    hide: document.querySelector("#hide_button"),
    show: document.querySelector("#show_button"),
}

const elements = {
    screen_shade: document.querySelector(".screen_shade"),
    slide_panel: document.querySelector(".slide_panel")
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
}

const DocumentInitialization = () => {
    elements.screen_shade.classList.toggle("off");

    InitializeButtons();
}

DocumentInitialization();