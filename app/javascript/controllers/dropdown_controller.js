// app/javascript/controllers/dropdown_controller.js

import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = ["content"]
    static classes = ["open"]

    connect() {
        document.addEventListener('click', this.handleClickOutside.bind(this))
    }

    disconnect() {
        document.removeEventListener('click', this.handleClickOutside.bind(this))
    }

    toggle(event) {
        event.preventDefault()
        event.stopPropagation()
        this.contentTarget.classList.toggle(this.openClass)
    }

    handleClickOutside(event) {
        if (!this.element.contains(event.target) &&
            this.contentTarget.classList.contains(this.openClass)) {
            this.contentTarget.classList.remove(this.openClass)
        }
    }
}