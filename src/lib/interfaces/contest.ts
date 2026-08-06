import type { Problem } from "./problem";

export interface ContestMetadata {
  /**
   * The title of the contest
   */
  title: string;

  /**
   * The url of the contest
   */
  url: string;

  /**
   * The starting time
   */
  startTime: Date;

  /**
   * The ending time
   */
  endTime: Date;

  /**
   * A cover image url for the contest
   */
  coverImage?: string;
}

export interface CodeforcesContest {
  /**
   * The id of the contest
   */
  id: number;

  /**
   * The name of the contest
   */
  name: string;

  /**
   * The starting time in seconds since the epoch
   */
  startTimeSeconds: number;

  /**
   * The duration of the contest in seconds
   */
  durationSeconds: number;

  /**
   * The time at which the ratings got updated
   */
  ratingUpdateTimeSeconds: number;

  /**
   * The problems in the contest
   */
  problems: Problem[];

  /**
   * The old rating of the user before the contest
   */
  oldRating?: number;

  /**
   * The new rating of the user after the contest
   */
  newRating?: number;
}
