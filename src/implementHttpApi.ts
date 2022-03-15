import type { RequestHandler } from "./RequestHandler.js";
import type { ApiWithSession } from "./ApiWithSession.js";
import type { Decoder } from "@mojotech/json-type-validation";
import type { HttpApiDefinition } from "yhttp_api";
import type { YHttpServerApp, YHttpRequest, YHttpResponse } from "./implementerLib";
import { ApiRoot } from "./ApiRoot.js";

export function implementHttpApi<TLiteral extends string, TApiRequest, TApiResponse>(
    apiRoot: ApiRoot, //YHttpServerApp,
    apiDefinition: HttpApiDefinition<TLiteral, TApiRequest, TApiResponse>,
    requestHandler: RequestHandler<TApiRequest & ApiWithSession, TApiResponse>,
) {
    const { method, routeUrl } = apiDefinition;

    const fullHandlerFunc = async (request: YHttpRequest, response: YHttpResponse) => {
        const rawRequestData = method === "GET" || method === "get" ? request.query : request.body;
        const requestData: any = apiDefinition.requestDecoder.runWithException(rawRequestData);
        requestData.routeUrl = routeUrl;
        const responseData = await requestHandler(requestData);
        const verifiedResponseData = apiDefinition.responseDecoder.runWithException(responseData);
        response.send(verifiedResponseData);
    };

    const fullUrl = apiRoot.virtualFolder + routeUrl;
    switch (method) {
        case "GET":
            apiRoot.httpServerApp.get(fullUrl, fullHandlerFunc);
            return;
        case "PUT":
            apiRoot.httpServerApp.put(fullUrl, fullHandlerFunc);
            return;
        case "POST":
            apiRoot.httpServerApp.post(fullUrl, fullHandlerFunc);
            return;
        default:
            throw new Error(`CODE00000001 Method '${method}' @notImplemented by httpRequestConfig`);
    }
}
