import {
  FastifyError,
  FastifyReply,
  FastifyRequest,
  RawRequestDefaultExpression,
  RawServerDefault,
} from "fastify";

import sendError from "./sendError";

const errorHandler = (
  error: FastifyError,
  request: FastifyRequest<any, RawServerDefault, RawRequestDefaultExpression>,
  reply: FastifyReply,
): void => {
  const status = error.statusCode || reply.raw?.statusCode || 500;

  sendError(reply, status);
};

export default errorHandler;
