import fetch, { Headers } from "node-fetch";

interface Options {
  allowedContentTypes: string[];
}

class FetchService {
  private options: Options;

  constructor(options: Options) {
    this.options = options;
  }

  public async fetch(url: string): Promise<NodeJS.ReadableStream> {
    const response = await fetch(url);

    if (!response.ok || this.isInvalid(response.headers)) {
      throw new Error(`Fetch failed: ${url}`);
    }

    return response.body;
  }

  private isInvalid(headers: Headers): boolean {
    const contentType = headers.get("content-type");

    if (!contentType) {
      return true;
    }

    return !this.options.allowedContentTypes.includes(contentType);
  }
}

export default FetchService;
