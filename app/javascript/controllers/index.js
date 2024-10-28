// app/javascript/controllers/index.js

import { application } from "controllers/application"
import { eagerLoadControllersFrom } from "@hotwired/stimulus-loading"
import { registerControllers } from "@hotwired/stimulus-loading"

// Import controllers
import MenuController from "./menu_controller"
import DropdownController from "./dropdown_controller"
import AlertController from "./alert_controller"

// Register controllers
application.register("menu", MenuController)
application.register("dropdown", DropdownController)
application.register("alert", AlertController)

// Load and register all controllers within this directory and all subdirectories
eagerLoadControllersFrom("controllers", application)