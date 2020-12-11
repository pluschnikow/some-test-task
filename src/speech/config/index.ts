const { TMP_STORAGE } = process.env;

const config = {
  storage: {
    path: TMP_STORAGE ?? `${process.cwd()}/tmp`,
  },
  file: {
    allowedContentTypes: ["text/csv"],
  },
  statsOptions: {
    mostSpeechesYear: 2013,
    mostSecurityTopic: "Inner Security",
  },
};

export default config;
