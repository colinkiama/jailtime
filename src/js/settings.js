import { stimulusApp } from "./app.js";

import BlocklistController from "./controllers/BlocklistController.js";

stimulusApp.register("blocklist", BlocklistController);

console.log("Registered Stimulus Controllers");