import config from "../../../../../config";
import MostSpeechesHandler from "./MostSpeechesHandler";
import MostSecurityHandler from "./MostSecurityHandler";
import LeastWordyHandler from "./LeastWordyHandler";

export enum StatsType {
  MostSpeeches = "mostSpeeches",
  MostSecurity = "mostSecurity",
  LeastWordy = "leastWordy",
}

export default {
  [StatsType.MostSpeeches]: new MostSpeechesHandler(config.statsOptions),
  [StatsType.MostSecurity]: new MostSecurityHandler(config.statsOptions),
  [StatsType.LeastWordy]: new LeastWordyHandler(),
};
