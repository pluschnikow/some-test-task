import { FastifyReply } from "fastify";

const messageStatusMap: { [key: number]: string } = {
  400: "Bad Request Error",
  404: "Not Found",
  500: "Internal Server Error",
};

const sendError = (
  reply: FastifyReply,
  status: number,
  message?: string,
): FastifyReply =>
  reply
    .code(status)
    .type("application/json")
    .send({
      status,
      message: message || messageStatusMap[status],
    });

export default sendError;
