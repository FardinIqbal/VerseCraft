// app/javascript/controllers/alert_controller.js

import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    connect() {
        // Auto-dismiss after 5 seconds if it's a success message
        if (this.element.classList.contains('alert-success')) {
            setTimeout(() => {
                this.dismiss()
            }, 5000)
        }
    }

    dismiss() {
        this.element.remove()
    }
}