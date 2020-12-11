import fastify, { FastifyInstance } from "fastify";

const init = (route): FastifyInstance => {
  const server = fastify();

  server.route(route);

  return server;
};

export default init;
