import AbstractStatsTypeHandler from "./AbstractStatsTypeHandler";

interface StatsItem {
  speaker: string;
  words: string;
}

interface StatsCollection {
  [key: string]: number;
}

class LeastWordyHandler extends AbstractStatsTypeHandler<
  StatsItem,
  StatsCollection,
  unknown
> {
  constructor() {
    super(null);
  }

  public collect(
    item: StatsItem,
    collection: StatsCollection | null = null,
  ): StatsCollection | null {
    const wordsNumber = Number(item.words);

    if (!collection) {
      collection = {};
    }

    if (!collection[item.speaker]) {
      collection[item.speaker] = wordsNumber;

      return collection;
    }

    collection[item.speaker] = collection[item.speaker] + wordsNumber;

    return collection;
  }

  public evaluate(statsCollections: (StatsCollection | null)[]): string | null {
    const mergedCollection = super.collectionMerge(statsCollections);

    const speakerStats = super.createSpeakerStats(
      mergedCollection,
      (a, b) => a > b,
    );

    return speakerStats.speakers.length === 1 ? speakerStats.speakers[0] : null;
  }
}

export default LeastWordyHandler;
