import AbstractStatsTypeHandler from "./AbstractStatsTypeHandler";

interface Options {
  mostSpeechesYear: number;
}

interface StatsItem {
  speaker: string;
  date: string;
}

interface StatsCollection {
  [key: string]: number;
}

class MostSpeechesHandler extends AbstractStatsTypeHandler<
  StatsItem,
  StatsCollection,
  Options
> {
  constructor(options: Options) {
    super(options);
  }

  public collect(
    item: StatsItem,
    collection: StatsCollection | null = null,
  ): StatsCollection | null {
    const year = new Date(item.date).getFullYear();

    if (year !== this.options.mostSpeechesYear) {
      return collection;
    }

    if (!collection) {
      collection = {};
    }

    if (!collection[item.speaker]) {
      collection[item.speaker] = 0;
    }

    collection[item.speaker] += 1;

    return collection;
  }

  public evaluate(statsCollections: (StatsCollection | null)[]): string | null {
    const mergedCollection = super.collectionMerge(statsCollections);

    const speakerStats = super.createSpeakerStats(
      mergedCollection,
      (a, b) => a < b,
    );

    return speakerStats.speakers.length === 1 ? speakerStats.speakers[0] : null;
  }
}

export default MostSpeechesHandler;
