// app/javascript/controllers/menu_controller.js

import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = ["menu", "button"]
    static classes = ["visible"]

    connect() {
        // Close menu when clicking outside
        document.addEventListener('click', this.handleClickOutside.bind(this))
    }

    disconnect() {
        document.removeEventListener('click', this.handleClickOutside.bind(this))
    }

    toggle() {
        if (this.menuTarget.classList.contains(this.visibleClass)) {
            this.close()
        } else {
            this.open()
        }
    }

    open() {
        this.menuTarget.classList.add(this.visibleClass)
        this.buttonTarget.setAttribute('aria-expanded', 'true')
    }

    close() {
        this.menuTarget.classList.remove(this.visibleClass)
        this.buttonTarget.setAttribute('aria-expanded', 'false')
    }

    handleClickOutside(event) {
        if (!this.element.contains(event.target) &&
            this.menuTarget.classList.contains(this.visibleClass)) {
            this.close()
        }
    }
}