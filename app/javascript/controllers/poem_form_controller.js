// app/javascript/controllers/poem_form_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = ["guidelines", "contentInput"]

    connect() {
        console.log("PoemFormController connected")
    }

    updateGuidelines(event) {
        const selectedForm = event.target.value
        console.log("Selected form:", selectedForm)

        if (!selectedForm) {
            this.guidelinesTarget.innerHTML = ""
            this.updateContentStyles("")
            return
        }

        fetch(`/poems/form_guidelines/${selectedForm}`, {
            headers: {
                'Accept': 'text/html',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
            }
        })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
                return response.text()
            })
            .then(html => {
                console.log("Received HTML:", html)
                this.guidelinesTarget.innerHTML = html
                this.updateContentStyles(selectedForm)
            })
            .catch(error => {
                console.error('Error loading form guidelines:', error)
                this.guidelinesTarget.innerHTML = '<p class="text-error">Unable to load form guidelines.</p>'
            })
    }

    updateContentStyles(form) {
        const supportedForms = ['free_verse', 'sonnet', 'haiku', 'tanka', 'limerick']
        this.contentInputTarget.classList.remove(...supportedForms)
        if (form) {
            this.contentInputTarget.classList.add(form)
        }
    }
}