const asNumber = (value: string | undefined, defaultValue: number): number =>
  value ? parseInt(value, 10) : defaultValue;

const { PORT } = process.env;

const config = {
  api: {
    address: "127.0.0.1",
    port: asNumber(PORT, 8080),
  },
};

export default config;
