// app/javascript/themeToggle.js

document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".stories-bar__container");
    const leftArrow = document.querySelector(".stories-bar__arrow--left");
    const rightArrow = document.querySelector(".stories-bar__arrow--right");

    // Scroll right by a fixed amount when the right arrow is clicked
    rightArrow.addEventListener("click", () => {
        container.scrollBy({
            left: 150, // Adjust scroll distance as needed
            behavior: "smooth"
        });
    });

    // Scroll left by a fixed amount when the left arrow is clicked
    leftArrow.addEventListener("click", () => {
        container.scrollBy({
            left: -150, // Adjust scroll distance as needed
            behavior: "smooth"
        });
    });
});
