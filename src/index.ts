import fastify from "fastify";

import config from "../config/common";
import { routes } from "./speech";
import errorHandler from "./speech/utils/errorHandler";

const server = fastify();

for (const routeKey in routes) {
  server.register(routes[routeKey]);
}

server.setErrorHandler(errorHandler);

const start = async () => {
  try {
    await server.listen(config.api.port, config.api.address);

    console.log(`server listening at ${config.api.port}`);
  } catch (error) {
    console.error("Server error", { error });

    process.exit(1);
  }
};

start();
