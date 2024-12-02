import { updateGamePass } from "./xbGameBuilder.js";
import { updatePSPlus } from "./psGameBuilder.js";

updateGamePass(0).then(updatePSPlus);
//the above should populate the db with all the information from the xbox and ps apis
//currently buggy, race condition that will need to be resolved later. run separately for now. 