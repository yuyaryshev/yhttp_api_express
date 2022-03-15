import { YHttpServerApp } from "./implementerLib.js";

export interface ApiRoot {
    httpServerApp: YHttpServerApp;
    virtualFolder: string;
}
