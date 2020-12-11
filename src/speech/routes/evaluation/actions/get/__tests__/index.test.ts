import { createReadStream } from "fs";
import { ENDPOINT_NAME } from "../../..";
import init from "../../../../../../__testHelpers__/init";
import route from "../index";

const someValidUrl = "https://some-valid-url.com/test.csv";
const someAnotherValidUrl = "https://some-valid-url.com/test2.csv";
const someAnotherValidUrl2 = "https://some-valid-url.com/test3.csv";
const someUnclearValuesUrl = "https://some-valid-url.com/unclear.csv";

const mockFilesMap = {
  [someValidUrl]: `${__dirname}/mocks/test.csv`,
  [someAnotherValidUrl]: `${__dirname}/mocks/test2.csv`,
  [someAnotherValidUrl2]: `${__dirname}/mocks/test3.csv`,
  [someUnclearValuesUrl]: `${__dirname}/mocks/unclear.csv`,
};

jest.mock("node-fetch", () => (url: string) => {
  if (mockFilesMap[url]) {
    return {
      status: 200,
      ok: true,
      headers: { get: () => "text/csv" },
      body: createReadStream(mockFilesMap[url]),
    };
  }

  return {
    status: 404,
    ok: false,
    body: () => ({}),
  };
});

describe(`${ENDPOINT_NAME} GET`, () => {
  describe("Given the service is running", () => {
    let server;

    beforeAll(() => {
      console.error = jest.fn();

      server = init(route);
    });

    afterAll(() => {
      server.close();
    });

    describe("and the endpoint is called", () => {
      describe("and the url query parameter is missing", () => {
        let data;

        beforeAll(async () => {
          data = await server.inject({
            method: "GET",
            url: `${ENDPOINT_NAME}`,
          });
        });

        it("responses status of 400", () => {
          expect(data.statusCode).toBe(400);
        });
      });

      describe("and the url query parameter is set to a single valid value", () => {
        describe("and the given url delivers clear stats results", () => {
          let data;
          let body;

          beforeAll(async () => {
            data = await server.inject({
              method: "GET",
              url: `${ENDPOINT_NAME}?url=${someValidUrl}`,
            });

            body = JSON.parse(data.body);
          });

          it("responses status of 200", () => {
            expect(data.statusCode).toBe(200);
          });

          it("sets the stats 'mostSpeeches' to the value 'Caesare Collins'", () => {
            expect(body.mostSpeeches).toBe("Caesare Collins");
          });

          it("sets the stats 'mostSecurity' to the value 'Alexander Abel'", () => {
            expect(body.mostSecurity).toBe("Alexander Abel");
          });

          it("sets the stats 'leastWordy' to the value 'Bernhard Belling'", () => {
            expect(body.leastWordy).toBe("Bernhard Belling");
          });
        });

        describe("and the given url does not delivers clear stats results", () => {
          let data;
          let body;

          beforeAll(async () => {
            data = await server.inject({
              method: "GET",
              url: `${ENDPOINT_NAME}?url=${someUnclearValuesUrl}`,
            });

            body = JSON.parse(data.body);
          });

          it("responses status of 200", () => {
            expect(data.statusCode).toBe(200);
          });

          it("sets the stats 'mostSpeeches' to the value 'null'", () => {
            expect(body.mostSpeeches).toBeNull();
          });

          it("sets the stats 'mostSecurity' to the value 'null'", () => {
            expect(body.mostSecurity).toBeNull();
          });

          it("sets the stats 'leastWordy' to the value 'null'", () => {
            expect(body.leastWordy).toBeNull();
          });
        });
      });

      describe("and the url query parameter is set to multiple valid values", () => {
        describe("and all given urls are valid", () => {
          let data;
          let body;

          beforeAll(async () => {
            data = await server.inject({
              method: "GET",
              url: `${ENDPOINT_NAME}?url=${someValidUrl}&url=${someAnotherValidUrl}&url=${someAnotherValidUrl2}`,
            });

            body = JSON.parse(data.body);
          });

          it("responses status of 200", () => {
            expect(data.statusCode).toBe(200);
          });

          it("sets the stats 'mostSpeeches' to the value 'Caesare Collins'", () => {
            expect(body.mostSpeeches).toBe("Caesare Collins");
          });

          it("sets the stats 'mostSecurity' to the value 'Tim Abel'", () => {
            expect(body.mostSecurity).toBe("Tim Abel");
          });

          it("sets the stats 'leastWordy' to the value 'Tim Abel'", () => {
            expect(body.leastWordy).toBe("Tim Abel");
          });
        });

        describe("and not all given urls are valid", () => {
          let data;

          beforeAll(async () => {
            data = await server.inject({
              method: "GET",
              url: `${ENDPOINT_NAME}?url=${someValidUrl}&url=${someAnotherValidUrl}&url=https://broken.com`,
            });
          });

          it("responses status of 400", () => {
            expect(data.statusCode).toBe(400);
          });
        });
      });
    });
  });
});
