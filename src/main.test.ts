import { expect } from "chai";
import express from "express";
import axios from "axios";
import { httpApiDefinition, httpApiFunction } from "yhttp_api";
import { string } from "@mojotech/json-type-validation";
import { implementHttpApi } from "./implementHttpApi.js";
import { ApiRoot } from "./ApiRoot.js";

describe(`main.test.ts`, () => {
    it(`get`, async () => {
        const api1 = httpApiDefinition("GET", "api1", { a: string(), b: string() }, { r: string() });

        const port = 3770;
        const virtualFolder = "/api/";

        const httpServerApp = express();
        httpServerApp.use(express.json());

        const apiRoot: ApiRoot = {
            httpServerApp,
            virtualFolder,
        };

        let runningInstance: any;
        try {
            implementHttpApi(apiRoot, api1, (req) => {
                return { r: req.a + " " + req.b + " PONG!" };
            });

            runningInstance = httpServerApp.listen(port, () => {
                console.log(`Test server is listening on port ${port}`);
            });

            const axiosInstance = axios.create({ baseURL: `http://localhost:${port}${virtualFolder}` });
            const api1func = httpApiFunction(axiosInstance, api1);

            const resp = await api1func({ a: "AA", b: "BB" });
            expect(resp).to.deep.equal({ r: "AA BB PONG!" });
        } finally {
            if (runningInstance) {
                runningInstance.close(() => {
                    console.log(`Test server is on port ${port} is now offline.`);
                });
            }
        }
    });

    it(`post`, async () => {
        const api2 = httpApiDefinition("POST", "api2", { a: string(), b: string() }, { r: string() });

        const port = 3771;
        const virtualFolder = "/api/";

        const httpServerApp = express();
        httpServerApp.use(express.json());

        const apiRoot: ApiRoot = {
            httpServerApp,
            virtualFolder,
        };

        let runningInstance: any;
        try {
            implementHttpApi(apiRoot, api2, (req) => {
                return { r: req.a + " " + req.b + " PONG!" };
            });

            runningInstance = httpServerApp.listen(port, () => {
                console.log(`Test server is listening on port ${port}`);
            });

            const axiosInstance = axios.create({ baseURL: `http://localhost:${port}${virtualFolder}` });
            const api2func = httpApiFunction(axiosInstance, api2);

            const resp = await api2func({ a: "AA", b: "BB" });
            expect(resp).to.deep.equal({ r: "AA BB PONG!" });
        } finally {
            if (runningInstance) {
                runningInstance.close(() => {
                    console.log(`Test server is on port ${port} is now offline.`);
                });
            }
        }
    });
});
