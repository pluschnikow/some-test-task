import csv from "csv-parser";
import statsTypeHandlers, { StatsType } from "./statsTypeHandlers";

interface Evaluation {
  [key: string]: string | null;
}

type CollectionStatsTypeItem = { [key: string]: number } | null;

type CollectionStatsType = Record<string, CollectionStatsTypeItem>;

type Collection = Record<string, CollectionStatsType>;

class StatsService {
  private statsTypes: StatsType[];
  private collection: Collection = {};

  constructor(statsTypes: StatsType[]) {
    this.statsTypes = statsTypes;
  }

  public async collectData(
    sources: Promise<NodeJS.ReadableStream>[],
  ): Promise<void> {
    await Promise.all(sources.map(await this.readSource.bind(this)));
  }

  public evaluate(): Evaluation {
    const evaluation: Evaluation = {};

    this.statsTypes.forEach((statsType: StatsType) => {
      const handler = statsTypeHandlers[statsType];

      const statsCollections: CollectionStatsTypeItem[] = Object.keys(
        this.collection,
      ).map((index: string) => {
        return this.collection[index][statsType];
      });

      evaluation[statsType] = handler.evaluate(statsCollections);
    });

    return evaluation;
  }

  private async readSource(
    source: Promise<NodeJS.ReadableStream>,
    sourceId: number,
  ): Promise<void> {
    let sourceStream: NodeJS.ReadableStream;

    try {
      sourceStream = await source;
    } catch (error) {
      throw new Error(error);
    }

    if (!this.collection[sourceId]) {
      this.collection[sourceId] = {};
    }

    await new Promise((resolve, reject) => {
      sourceStream
        .pipe(
          csv({
            separator: ", ",
            mapValues: ({ value }) => String(value).trim(),
            mapHeaders: ({ header }) => String(header).trim().toLowerCase(),
          }),
        )
        .on("data", (item) => {
          this.statsTypes.forEach((statsType: StatsType) => {
            const handler = statsTypeHandlers[statsType];

            this.collection[sourceId][statsType] = handler.collect(
              item,
              this.collection[sourceId][statsType],
            );
          });
        })
        .on("finish", () => {
          resolve(null);
        })
        .on("error", (error) => {
          reject(error);
        });
    }).catch((error) => {
      console.log(`Reading source failed: ${error}`);

      throw new Error("Error while source reading!");
    });
  }
}

export default StatsService;
