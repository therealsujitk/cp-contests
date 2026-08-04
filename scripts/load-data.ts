import downloadedContests from '../src/lib/data/codeforces-contests.json';
import { writeFile } from "fs/promises";

async function fetchCodeforcesContestList() : Promise<number[]> {
  const url = new URL('https://codeforces.com/api/contest.list');
  url.searchParams.append('gym', 'false');

  const response = await fetch(url);
  const data = await response.json();

  return data.result
      .filter((contest: any) => contest.phase === 'FINISHED')
      .sort((a: any, b: any) => b.startTimeSeconds - a.startTimeSeconds)
      .map((contest: any) => contest.id)
      .slice(0, 100); // Limit to the latest 100 contests
}

async function fetchCodeforcesContest(contestId: number) {
  const url = new URL('https://codeforces.com/api/contest.standings');
  url.searchParams.append('contestId', contestId.toString());

  const response = await fetch(url);
  const data = await response.json();

  return {
    id: contestId,
    name: data.result.contest.name,
    startTimeSeconds: data.result.contest.startTimeSeconds,
    durationSeconds: data.result.contest.durationSeconds,
    problems: data.result.problems.map((problem: any) => ({
      index: problem.index,
      name: problem.name,
      rating: problem.rating,
    }))
  };
}

async function fetchCodeforcesContests() {
  const contestIds = await fetchCodeforcesContestList();
  const newContests: { [key: number]: any } = {};

  for (const contestId of contestIds) {
    if (contestId in downloadedContests && downloadedContests[contestId].problems[0].rating !== undefined) {
      continue;
    }

    try {
      newContests[contestId] = await fetchCodeforcesContest(contestId);
      console.log(`Fetched contest data for ID ${contestId}`);
    } catch (error) {
      console.error(`Error fetching contest data for ID ${contestId}:`, error);
      break; // Stop fetching further contests if an error occurs
    }
  }

  return { ...downloadedContests, ...newContests };
}

async function downloadContestData() {
  const codeforcesContests = await fetchCodeforcesContests();
  await writeFile('./src/lib/data/codeforces-contests.json', JSON.stringify(codeforcesContests, null, 2));
}

downloadContestData();
