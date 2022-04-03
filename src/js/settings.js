import { stimulusApp } from "./app.js";

import BlocklistController from "./controllers/BlocklistController.js";
import BlocklistItemController from "./controllers/BlocklistItemController.js";

stimulusApp.register("blocklist", BlocklistController);
stimulusApp.register("blocklist-item", BlocklistItemController);
