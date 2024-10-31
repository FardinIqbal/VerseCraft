import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = ["feed"]

    connect() {
        this.currentIndex = 0;
        this.setupKeyboardNavigation();
        this.setupTouchNavigation();

        // Focus on the scroll container when the page loads
        this.element.focus();

        // Event listener for clicking outside the container
        document.addEventListener("click", this.handleClickOutside.bind(this));
    }

    setupKeyboardNavigation() {
        this.boundHandleKeyPress = this.handleKeyPress.bind(this)
        document.addEventListener("keydown", this.boundHandleKeyPress)
    }

    handleKeyPress(event) {
        if (event.key === "ArrowDown" || event.key === "j") {
            this.navigateToNext();
        } else if (event.key === "ArrowUp" || event.key === "k") {
            this.navigateToPrevious();
        }
        // Refocus on the container after each key press
        this.element.focus();
    }

    navigateToNext() {
        const poems = Array.from(this.feedTarget.children);
        if (this.currentIndex < poems.length - 1) {
            this.currentIndex++;
            poems[this.currentIndex].scrollIntoView({ behavior: "smooth" });
        }
    }

    navigateToPrevious() {
        const poems = Array.from(this.feedTarget.children);
        if (this.currentIndex > 0) {
            this.currentIndex--;
            poems[this.currentIndex].scrollIntoView({ behavior: "smooth" });
        }
    }

    setupTouchNavigation() {
        this.touchStartY = 0;
        this.element.addEventListener("touchstart", (e) => {
            this.touchStartY = e.touches[0].clientY;
        });

        this.element.addEventListener("touchend", (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            const diff = this.touchStartY - touchEndY;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.navigateToNext();
                } else {
                    this.navigateToPrevious();
                }
            }
        });
    }

    handleClickOutside(event) {
        if (!this.element.contains(event.target)) {
            document.removeEventListener("keydown", this.boundHandleKeyPress);
        } else {
            this.element.focus();
        }
    }

    disconnect() {
        document.removeEventListener("keydown", this.boundHandleKeyPress);
        document.removeEventListener("click", this.handleClickOutside.bind(this));
    }
}
