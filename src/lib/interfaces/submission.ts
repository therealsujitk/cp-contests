export interface Submission {
  id: number;
  problem: {
    contestId: number;
    index: string;
  };
  verdict: string;
  creationTimeSeconds: number;
}
