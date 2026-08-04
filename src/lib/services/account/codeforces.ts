import type { CodeforcesContest } from '$lib/interfaces/contest';
import type { Problem } from '$lib/interfaces/problem';
import type { Submission } from '$lib/interfaces/submission';

export interface AccountData {
  contests: CodeforcesContest[];
  rating: number;
  maxRating: number;
  skippedContests: number;
  acceptedCount: number;
  totalCount: number;
}

async function getContests(contestIds: number[]): Promise<Record<number, CodeforcesContest>> {
  const url = new URL(`http://${window.location.host}/api/contests`);
  url.searchParams.set('platform', 'codeforces');
  contestIds.forEach(id => url.searchParams.append('id', id.toString()));

  const response = await (await fetch(url)).json();
  return response.contests as Record<number, CodeforcesContest>;
}

async function getUserRatingHistory(handle: string) : Promise<{ contestId: number; contestName: string; oldRating: number; newRating: number; }[]> {
  const url = new URL('https://codeforces.com/api/user.rating');
  url.searchParams.set('handle', handle);

  const response = await (await fetch(url)).json();
  return response.result.map((entry: any) => ({
    contestId: entry.contestId,
    contestName: entry.contestName,
    oldRating: entry.oldRating,
    newRating: entry.newRating,
  }));
}

async function getSubmissionHistory(handle: string): Promise<Submission[]> {
  const url = new URL('https://codeforces.com/api/user.status');
  url.searchParams.set('handle', handle);
  
  const response = await (await fetch(url)).json();
  return response.result.map((s: any) => ({
    id: s.id,
    problem: {
      contestId: s.problem.contestId,
      index: s.problem.index,
    },
    verdict: s.verdict,
    creationTimeSeconds: s.creationTimeSeconds,
  })).toReversed();
}

async function getUserContestsAndSubmissions(handle: string) : Promise<[CodeforcesContest[], Submission[]]> {
  const ratingHistory = await getUserRatingHistory(handle);
  const submissionHistory = await getSubmissionHistory(handle);
  const firstSubmissions: Record<string, Submission> = {};
  const codeforcesContests = await getContests(ratingHistory.map(entry => entry.contestId));

  for (const submission of submissionHistory) {
    const key = `${submission.problem.contestId}-${submission.problem.index}`;
    if (submission.verdict !== 'OK' || firstSubmissions[key]) continue;
    firstSubmissions[key] = submission;
  }

  const userContests = ratingHistory.map(entry => {
    const contestEndTimeSeconds = codeforcesContests[entry.contestId]?.startTimeSeconds + codeforcesContests[entry.contestId]?.durationSeconds || 0;

    return {
      id: entry.contestId,
      name: entry.contestName,
      startTimeSeconds: codeforcesContests[entry.contestId]?.startTimeSeconds || 0,
      durationSeconds: codeforcesContests[entry.contestId]?.durationSeconds || 0,
      problems: codeforcesContests[entry.contestId]?.problems?.map((p: Problem) => {
        const submission = firstSubmissions[`${entry.contestId}-${p.index}`];

        if (submission) {
          return {
            ...p,
            status: submission.creationTimeSeconds <= contestEndTimeSeconds ? 'SOLVED' : 'UPSOLVED',
          };
        }

        return { ...p, status: 'UNSOLVED' };
      }) || [],
      oldRating: entry.oldRating,
      newRating: entry.newRating,
    } as CodeforcesContest;
  });

  return [userContests.toReversed(), submissionHistory];
}

export async function getAccountData(handle: string): Promise<AccountData> {
  const [contests, submissions] = await getUserContestsAndSubmissions(handle);

  const currentRating = contests[0]?.newRating ?? 0;
  const maxRating = contests.toSorted((a, b) => (b.newRating ?? 0) - (a.newRating ?? 0))[0]?.newRating ?? 0;
  const skippedContestSubmissions = [...new Set(submissions.filter(s => s.verdict === 'SKIPPED').map(s => s.problem.contestId))];
  const skippedContests = skippedContestSubmissions.filter(id => !contests.find(c => c.id === id));
  const acceptedCount = [...new Set(submissions.filter(s => s.verdict === 'OK').map(s => `${s.problem.contestId}/${s.problem.index}`))];

  return { 
    contests: contests,
    rating: currentRating,
    maxRating: maxRating,
    skippedContests: skippedContests.length,
    acceptedCount: acceptedCount.length,
    totalCount: submissions.length,
  };
}
