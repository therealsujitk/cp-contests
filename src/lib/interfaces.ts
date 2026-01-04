export interface Contest {
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
   * A cover image url for the contest
   */
  coverImage?: string;
}
