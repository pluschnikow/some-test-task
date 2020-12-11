import { FastifySchema } from "fastify";

const schema: FastifySchema = {
  querystring: {
    type: "object",
    required: ["url"],
    properties: {
      url: {
        oneOf: [
          { type: "string" },
          {
            type: "array",
            items: { type: "string" },
          },
        ],
      },
    },
  },
};

export default schema;
