import { ApiWithSession } from "./ApiWithSession.js";

export type RequestHandler<TApiRequest extends ApiWithSession, TApiResponse> = (data: TApiRequest) => TApiResponse | Promise<TApiResponse>;
