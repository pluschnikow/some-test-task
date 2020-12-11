export const ENDPOINT_NAME = "/evaluation";

import { FastifyInstance, RouteShorthandOptions } from "fastify";
import * as actions from "./actions";

const routes = (
  fastify: FastifyInstance<any>,
  opts: RouteShorthandOptions,
  done: () => void,
): void => {
  for (const actionKey in actions) {
    fastify.route(actions[actionKey]);
  }

  done();
};

export default routes;
