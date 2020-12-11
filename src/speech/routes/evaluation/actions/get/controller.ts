import {
  ContextConfigDefault,
  FastifyReply,
  FastifyRequest,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  RequestGenericInterface,
  RouteOptions,
} from "fastify";

import config from "../../../../config";
import { ENDPOINT_NAME } from "../..";
import schema from "./schema";
import FetchService from "../lib/FetchService";
import StatsService from "../lib/StatsService";
import { StatsType } from "../lib/statsTypeHandlers";
import sendError from "../../../../utils/sendError";

interface GetRequest extends RequestGenericInterface {
  Querystring: { url: string[] };
}

const handler = async (
  request: FastifyRequest<
    GetRequest,
    RawServerDefault,
    RawRequestDefaultExpression
  >,
  reply: FastifyReply,
): Promise<any> => {
  const urls = Array.isArray(request.query.url)
    ? request.query.url
    : [request.query.url];

  const statsService = new StatsService([
    StatsType.MostSpeeches,
    StatsType.MostSecurity,
    StatsType.LeastWordy,
  ]);
  const fetchService = new FetchService(config.file);

  try {
    await statsService.collectData(
      urls.map(fetchService.fetch.bind(fetchService)),
    );
  } catch (error) {
    console.error("Failed to fetch stats data.", error);

    return sendError(reply, 400);
  }

  try {
    const evaluation = statsService.evaluate();

    reply.status(200).type("application/json").send(evaluation);
  } catch (error) {
    return sendError(reply, 500);
  }
};

const getAction: RouteOptions<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  GetRequest,
  ContextConfigDefault
> = {
  method: "GET",
  url: `${ENDPOINT_NAME}`,
  schema,
  handler,
};

export default getAction;
