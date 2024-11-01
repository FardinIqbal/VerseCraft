// app/javascript/controllers/index.js
// Import and register all your controllers from the importmap under controllers/*

import { application } from "./application"

// Eager load all controllers defined in the import map under controllers/**/*_controller
import { eagerLoadContributors } from "@hotwired/stimulus-loading"
eagerLoadContributors(application, application.controllers)