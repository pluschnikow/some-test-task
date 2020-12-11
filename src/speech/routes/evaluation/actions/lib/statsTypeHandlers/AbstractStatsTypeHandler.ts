interface SpeakerStats {
  value: number;
  speakers: string[];
}

abstract class AbstractStatsTypeHandler<StatsItem, StatsCollection, Options> {
  protected options: Options;

  constructor(options: Options) {
    this.options = options;
  }

  public collect(
    item: StatsItem,
    collection: StatsCollection,
  ): StatsCollection | null {
    return collection;
  }

  public evaluate(collections: (StatsCollection | null)[]): string | null {
    return null;
  }

  protected collectionMerge(
    statsCollections: (StatsCollection | null)[],
  ): StatsCollection {
    let mergedCollection: StatsCollection = {} as StatsCollection;

    statsCollections.forEach((statsCollection: StatsCollection | null) => {
      if (!statsCollection) {
        return;
      }

      const speakers: string[] = Object.keys(statsCollection);

      mergedCollection = speakers.reduce((merged, speaker) => {
        if (!merged[speaker]) {
          merged[speaker] = statsCollection[speaker];

          return merged;
        }

        merged[speaker] += statsCollection[speaker];

        return merged;
      }, mergedCollection);
    });

    return mergedCollection;
  }

  protected createSpeakerStats(
    mergedCollection: StatsCollection,
    statsCondition: (a: number, b: number) => boolean,
  ): SpeakerStats {
    const speakerStats: SpeakerStats = {
      value: 0,
      speakers: [],
    };
    const speakers: string[] = Object.keys(mergedCollection);

    speakers.forEach((speaker: string) => {
      if (
        speakerStats.value === 0 ||
        speakerStats.value === mergedCollection[speaker]
      ) {
        speakerStats.value = mergedCollection[speaker];
        speakerStats.speakers.push(speaker);

        return;
      }

      if (statsCondition(speakerStats.value, mergedCollection[speaker])) {
        speakerStats.value = mergedCollection[speaker];
        speakerStats.speakers = [speaker];
      }
    });

    return speakerStats;
  }
}

export default AbstractStatsTypeHandler;
