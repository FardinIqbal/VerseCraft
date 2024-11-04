document.addEventListener("DOMContentLoaded", () => {
    const poems = Array.from(document.querySelectorAll(".poem"));
    let currentIndex = 0;

    // Shuffle the poems for a random order each visit
    function shufflePoems(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    shufflePoems(poems);

    // Function to display the current poem with a fade effect
    function showPoem(index) {
        poems.forEach((poem, i) => {
            poem.style.opacity = i === index ? "1" : "0";
            poem.style.transition = "opacity 1s ease";
        });
    }

    function rotatePoems() {
        currentIndex = (currentIndex + 1) % poems.length;
        showPoem(currentIndex);
    }

    // Initial display of the first poem in the randomized sequence
    showPoem(currentIndex);

    // Rotate poems every 5 seconds
    setInterval(rotatePoems, 8000);
});
